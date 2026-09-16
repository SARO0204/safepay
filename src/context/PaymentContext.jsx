import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  spendingByCategory as initialSpending,
  transactions as initialTransactions,
  user,
} from "../data/mockData.js";

const LEGACY_STORAGE_KEY = "upi-safe-payment-state";
const STORAGE_KEY = "upi-safe-wallet-state-v2";
const STORAGE_VERSION_KEY = "upi-safe-wallet-state-version";
const CURRENT_WALLET_VERSION = 2;
const PIN_STORAGE_KEY = "upi-safe-payment-pin";
const DEFAULT_WALLET_BALANCE = 10000;
const CATEGORIES = [
  "Food",
  "Shopping",
  "Travel",
  "Bills",
  "Education",
  "Other",
];

const DEFAULT_CATEGORY_BUDGETS = CATEGORIES.reduce((result, category) => {
  const initial = initialSpending.find((item) => item.category === category);
  result[category] = initial?.budget || 5000;
  return result;
}, {});

const parseMoney = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) && amount >= 0 ? amount : null;
};

const parseTransactionAmount = (value) => {
  const amount = parseMoney(value);
  return amount > 0 && amount <= user.balance ? amount : null;
};

const normalizeTransactions = (transactions) =>
  transactions
    .filter((transaction) => transaction && typeof transaction === "object")
    .map((transaction) => {
      const amount = parseTransactionAmount(transaction.amount);
      return amount == null ? transaction : { ...transaction, amount };
    });

const getCompletedTransactions = (transactions) =>
  transactions.filter(
    (transaction) =>
      parseTransactionAmount(transaction.amount) != null &&
      transaction.status !== "pending" &&
      transaction.status !== "cancelled" &&
      transaction.status !== "failed" &&
      transaction.status !== "blocked",
  );

const calculateSpending = (transactions) =>
  getCompletedTransactions(transactions).reduce(
    (result, transaction) => {
      const category = CATEGORIES.includes(transaction.category)
        ? transaction.category
        : "Other";
      result[category] += parseMoney(transaction.amount) || 0;
      return result;
    },
    Object.fromEntries(CATEGORIES.map((category) => [category, 0])),
  );

const normalizeBudget = (value, fallback) => {
  const budget = Number(value);
  return Number.isFinite(budget) && budget > 0 ? budget : fallback;
};

const calculateBalance = (transactions) =>
  Math.max(
    0,
    user.balance -
      getCompletedTransactions(transactions).reduce(
        (total, transaction) => total + parseMoney(transaction.amount),
        0,
      ),
  );

const PaymentContext = createContext(null);

function readWalletState() {
  try {
    const version = Number(localStorage.getItem(STORAGE_VERSION_KEY) || 0);
    const savedV2 = localStorage.getItem(STORAGE_KEY);

    if (version >= CURRENT_WALLET_VERSION && savedV2) {
      const parsed = JSON.parse(savedV2);
      const transactions = normalizeTransactions(
        Array.isArray(parsed.transactions)
          ? parsed.transactions
          : initialTransactions,
      );
      const categoryBudgets = CATEGORIES.reduce((result, category) => {
        result[category] = normalizeBudget(
          parsed.categoryBudgets?.[category],
          DEFAULT_CATEGORY_BUDGETS[category],
        );
        return result;
      }, {});
      const storedBalance = Number(parsed.balance);
      const safeBalance =
        Number.isFinite(storedBalance) && storedBalance >= 0
          ? storedBalance
          : DEFAULT_WALLET_BALANCE;

      return {
        ...parsed,
        transactions,
        spending: calculateSpending(transactions),
        categoryBudgets,
        monthlyBudget: normalizeBudget(
          parsed.monthlyBudget,
          user.monthlyBudget,
        ),
        balance: Math.max(0, safeBalance),
      };
    }

    const legacySaved = localStorage.getItem(LEGACY_STORAGE_KEY);
    const parsedLegacy = legacySaved ? JSON.parse(legacySaved) : null;
    const transactions = normalizeTransactions(
      Array.isArray(parsedLegacy?.transactions)
        ? parsedLegacy.transactions
        : initialTransactions,
    );
    const categoryBudgets = CATEGORIES.reduce((result, category) => {
      result[category] = normalizeBudget(
        parsedLegacy?.categoryBudgets?.[category],
        DEFAULT_CATEGORY_BUDGETS[category],
      );
      return result;
    }, {});

    const legacyBalance = Number(parsedLegacy?.balance);
    const migratedBalance =
      Number.isFinite(legacyBalance) && legacyBalance > 0
        ? legacyBalance
        : DEFAULT_WALLET_BALANCE;

    const migratedState = {
      ...(parsedLegacy || {}),
      transactions,
      spending: calculateSpending(transactions),
      categoryBudgets,
      monthlyBudget: normalizeBudget(
        parsedLegacy?.monthlyBudget,
        user.monthlyBudget,
      ),
      balance: Math.max(0, migratedBalance),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedState));
    localStorage.setItem(STORAGE_VERSION_KEY, String(CURRENT_WALLET_VERSION));

    return migratedState;
  } catch {
    // Use the demo state if storage is unavailable or malformed.
  }

  return {
    transactions: normalizeTransactions(initialTransactions),
    spending: calculateSpending(initialTransactions),
    monthlyBudget: user.monthlyBudget,
    categoryBudgets: DEFAULT_CATEGORY_BUDGETS,
    balance: DEFAULT_WALLET_BALANCE,
  };
}

export function PaymentProvider({ children }) {
  const [state, setState] = useState(() => readWalletState());
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    localStorage.setItem(STORAGE_VERSION_KEY, String(CURRENT_WALLET_VERSION));
  }, [state]);

  const commitPayment = (payment) => {
    const current = stateRef.current;
    const amount = parseTransactionAmount(payment.amount);
    if (amount == null) {
      return {
        transaction: null,
        error: "Enter a valid amount greater than ₹0.",
      };
    }
    if (!payment.recipient || !payment.upiId?.includes("@")) {
      return {
        transaction: null,
        error: "Enter a valid recipient and UPI ID.",
      };
    }
    const availableBalance = parseMoney(current.balance) ?? 0;
    if (amount > availableBalance) {
      return {
        transaction: null,
        error: "Transaction failed due to insufficient bank balance",
        availableBalance,
        paymentAmount: amount,
      };
    }
    const transaction = {
      ...payment,
      amount,
      id: payment.id || `T${Date.now()}`,
      status: "success",
    };
    let committed = false;
    setState((latest) => {
      const latestBalance = parseMoney(latest.balance) ?? 0;
      if (
        latestBalance < amount ||
        latest.transactions.some((item) => item.id === transaction.id)
      ) {
        return latest;
      }
      const transactions = [transaction, ...latest.transactions];
      committed = true;
      return {
        ...latest,
        balance: Math.max(0, latestBalance - amount),
        transactions,
        spending: calculateSpending(transactions),
      };
    });
    return committed
      ? { transaction, error: null }
      : {
          transaction: null,
          error: "Transaction failed due to insufficient bank balance",
          availableBalance,
          paymentAmount: amount,
        };
  };

  const updateBudgets = ({ monthlyBudget, categoryBudgets }) => {
    setState((current) => ({
      ...current,
      monthlyBudget: normalizeBudget(monthlyBudget, current.monthlyBudget),
      categoryBudgets: CATEGORIES.reduce((result, category) => {
        result[category] = normalizeBudget(
          categoryBudgets?.[category],
          current.categoryBudgets[category],
        );
        return result;
      }, {}),
    }));
  };

  const [paymentPin, setPaymentPinState] = useState(() => {
    try {
      return localStorage.getItem(PIN_STORAGE_KEY) || "";
    } catch {
      return "";
    }
  });

  const setPaymentPin = (pin) => {
    setPaymentPinState(pin);
    try {
      localStorage.setItem(PIN_STORAGE_KEY, pin);
    } catch {
      // Demo authentication still works for the current session.
    }
  };

  const value = useMemo(() => {
    const spending = calculateSpending(state.transactions);
    const completedTransactions = getCompletedTransactions(state.transactions);
    const monthlySpent = Object.values(spending).reduce(
      (total, amount) => total + amount,
      0,
    );
    return {
      ...state,
      spending,
      completedTransactions,
      paymentPin,
      categories: CATEGORIES,
      monthlySpent,
      remainingBudget: state.monthlyBudget - monthlySpent,
      commitPayment,
      setPaymentPin,
      updateBudgets,
    };
  }, [paymentPin, state]);

  return (
    <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
  );
}

export function usePayments() {
  const context = useContext(PaymentContext);
  if (!context)
    throw new Error("usePayments must be used inside PaymentProvider");
  return context;
}
