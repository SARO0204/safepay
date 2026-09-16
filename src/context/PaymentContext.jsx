import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  spendingByCategory as initialSpending,
  transactions as initialTransactions,
  user,
} from "../data/mockData.js";

const STORAGE_KEY = "upi-safe-payment-state";
const PIN_STORAGE_KEY = "upi-safe-payment-pin";
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

const getCompletedTransactions = (transactions) =>
  transactions.filter(
    (transaction) =>
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
      result[category] += Number(transaction.amount) || 0;
      return result;
    },
    Object.fromEntries(CATEGORIES.map((category) => [category, 0])),
  );

const normalizeBudget = (value, fallback) => {
  const budget = Number(value);
  return Number.isFinite(budget) && budget > 0 ? budget : fallback;
};

const PaymentContext = createContext(null);

export function PaymentProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const transactions = Array.isArray(parsed.transactions)
          ? parsed.transactions
          : initialTransactions;
        const categoryBudgets = CATEGORIES.reduce((result, category) => {
          result[category] = normalizeBudget(
            parsed.categoryBudgets?.[category],
            DEFAULT_CATEGORY_BUDGETS[category],
          );
          return result;
        }, {});
        return {
          ...parsed,
          transactions,
          spending: calculateSpending(transactions),
          categoryBudgets,
          monthlyBudget: normalizeBudget(
            parsed.monthlyBudget,
            user.monthlyBudget,
          ),
          balance: parsed.balance ?? user.balance,
        };
      }
    } catch {
      // Use the demo state if storage is unavailable or malformed.
    }

    return {
      transactions: initialTransactions,
      spending: calculateSpending(initialTransactions),
      monthlyBudget: user.monthlyBudget,
      categoryBudgets: DEFAULT_CATEGORY_BUDGETS,
      balance: user.balance,
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const commitPayment = (payment) => {
    const transaction = {
      ...payment,
      id: payment.id || `T${Date.now()}`,
      status: "success",
    };
    setState((current) => ({
      ...current,
      balance: Math.max(0, current.balance - transaction.amount),
      transactions: [transaction, ...current.transactions],
      spending: calculateSpending([transaction, ...current.transactions]),
    }));
    return transaction;
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
    const monthlySpent = Object.values(spending).reduce(
      (total, amount) => total + amount,
      0,
    );
    return {
      ...state,
      spending,
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
