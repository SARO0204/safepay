import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  spendingByCategory as initialSpending,
  transactions as initialTransactions,
  user,
} from "../data/mockData.js";

const STORAGE_KEY = "upi-safe-payment-state";
const CATEGORIES = [
  "Food",
  "Shopping",
  "Travel",
  "Bills",
  "Education",
  "Other",
];

const makeInitialSpending = () =>
  CATEGORIES.reduce((result, category) => {
    const initial = initialSpending.find((item) => item.category === category);
    result[category] = initial?.spent || 0;
    return result;
  }, {});

const PaymentContext = createContext(null);

export function PaymentProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...parsed, balance: parsed.balance ?? user.balance };
      }
    } catch {
      // Use the demo state if storage is unavailable or malformed.
    }

    return {
      transactions: initialTransactions,
      spending: makeInitialSpending(),
      monthlyBudget: user.monthlyBudget,
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
      spending: {
        ...current.spending,
        [transaction.category]:
          (current.spending[transaction.category] || 0) + transaction.amount,
      },
    }));
    return transaction;
  };

  const value = useMemo(() => {
    const monthlySpent = Object.values(state.spending).reduce(
      (total, amount) => total + amount,
      0,
    );
    return {
      ...state,
      categories: CATEGORIES,
      monthlySpent,
      remainingBudget: Math.max(0, state.monthlyBudget - monthlySpent),
      commitPayment,
    };
  }, [state]);

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
