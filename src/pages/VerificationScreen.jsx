import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { calculateRisk } from "../data/riskEngine.js";
import { usePayments } from "../context/PaymentContext.jsx";

const CATEGORIES = [
  "Food",
  "Shopping",
  "Travel",
  "Bills",
  "Education",
  "Other",
];
const DEFAULT_PAYMENT = {
  recipient: "Rahul Stores",
  upiId: "rahulstores@upi",
  amount: 8500,
  trusted: false,
  payCount: 0,
  verified: true,
  isVerifiedMerchant: true,
  category: "Shopping",
};
const PAYMENT_DRAFT_KEY = "upi-safe-payment-draft";

function readPaymentDraft() {
  try {
    const saved = sessionStorage.getItem(PAYMENT_DRAFT_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function parseAmount(value) {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

export default function VerificationScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { commitPayment, transactions } = usePayments();
  const paymentCommittedRef = useRef(false);
  const incomingPayment = location.state?.payment;
  const storedPayment = readPaymentDraft();
  const payment = incomingPayment || storedPayment || DEFAULT_PAYMENT;
  const from = location.state?.from || storedPayment?.from || "/";
  const isQrPayment = from === "/scan";
  const [isPaying, setIsPaying] = useState(false);
  const [amountInput, setAmountInput] = useState(
    payment.amount == null ? "" : String(payment.amount),
  );
  const [amountConfirmed, setAmountConfirmed] = useState(!isQrPayment);
  const [amountError, setAmountError] = useState("");
  const [category, setCategory] = useState(payment.category || "Other");
  const amount = parseAmount(amountInput);
  const paymentForReview = { ...payment, amount };
  const risk = calculateRisk({
    ...paymentForReview,
    category,
    transactionHistory: transactions,
  });
  const unusual = risk.flags.some((flag) => /amount|usual/i.test(flag));
  useEffect(() => {
    try {
      sessionStorage.setItem(
        PAYMENT_DRAFT_KEY,
        JSON.stringify({ ...payment, amount: amountInput, from }),
      );
    } catch {}
  }, [amountInput, from, payment]);

  const continueToReview = () => {
    if (!amount) {
      setAmountError("Enter an amount greater than ₹0.");
      return;
    }
    setAmountError("");
    setAmountConfirmed(true);
  };

  const pay = () => {
    if (paymentCommittedRef.current || !amount) {
      setAmountError("Enter an amount greater than ₹0 before paying.");
      return;
    }
    paymentCommittedRef.current = true;
    setIsPaying(true);
    const now = new Date();
    const txn = commitPayment({
      ...paymentForReview,
      category,
      riskResult: risk,
      riskLevel: risk.level,
      riskScore: risk.score,
      txnId: `UPISAFE-${Date.now().toString(36).toUpperCase()}`,
      date: now.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
    sessionStorage.removeItem(PAYMENT_DRAFT_KEY);
    navigate("/success", { state: { txn } });
  };
  if (isQrPayment && !amountConfirmed) {
    return (
      <div className="app-page verify-page">
        <header className="page-header">
          <button
            className="icon-button"
            onClick={() => {
              sessionStorage.removeItem(PAYMENT_DRAFT_KEY);
              navigate(from);
            }}
          >
            ←
          </button>
          <div>
            <p className="eyebrow">RECIPIENT DETAILS</p>
            <h1>Enter amount</h1>
            <p className="page-subtitle">Choose how much you want to pay</p>
          </div>
        </header>
        <main className="verify-content">
          <section className="verify-card">
            <div className="verify-recipient">
              <span className="verify-avatar">
                {payment.recipient?.[0] || "?"}
              </span>
              <div>
                <strong>{payment.recipient}</strong>
                <span>{payment.upiId}</span>
              </div>
            </div>
            <label className="field-label" htmlFor="payment-amount">
              Amount
            </label>
            <input
              id="payment-amount"
              className="field-input"
              type="number"
              min="0.01"
              step="0.01"
              inputMode="decimal"
              value={amountInput}
              onChange={(event) => {
                setAmountInput(event.target.value);
                setAmountError("");
              }}
              placeholder="₹ 0"
              autoFocus
            />
            {amountError && <p className="error-text">{amountError}</p>}
            <button
              className="button button-primary"
              onClick={continueToReview}
              style={{ marginTop: 20 }}
            >
              Continue
            </button>
          </section>
        </main>
      </div>
    );
  }
  return (
    <div className="app-page verify-page">
      <header className="page-header">
        <button className="icon-button" onClick={() => navigate(from)}>
          ←
        </button>
        <div>
          <p className="eyebrow">SMART PAYMENT VERIFICATION</p>
          <h1>Review payment</h1>
          <p className="page-subtitle">Check the details before you pay</p>
        </div>
      </header>
      <main className="verify-content">
        <section className="verify-card">
          <p className="summary-label">Paying</p>
          <h2 className="verify-amount">₹{amount.toLocaleString("en-IN")}</h2>
          <div className="verify-recipient">
            <span className="verify-avatar">
              {payment.recipient?.[0] || "?"}
            </span>
            <div>
              <strong>{payment.recipient}</strong>
              <span>{payment.upiId}</span>
            </div>
            <span className="verified-label">
              {payment.verified || payment.isVerifiedMerchant
                ? "✓ Verified"
                : "Unverified"}
            </span>
          </div>
        </section>
        {unusual && (
          <section
            className="info-card"
            style={{
              padding: 17,
              marginBottom: 13,
              background: "#fff8e8",
              borderColor: "#f3dfad",
            }}
          >
            <strong style={{ color: "#ad7311", fontSize: 14 }}>
              ⚠ Unusual payment
            </strong>
            <p
              style={{
                color: "#806a3e",
                fontSize: 12,
                lineHeight: 1.5,
                marginTop: 6,
              }}
            >
              This payment is significantly higher than your usual amount.
              Please verify the recipient and amount.
            </p>
          </section>
        )}
        <section className="verify-card">
          <p className="summary-label" style={{ marginBottom: 12 }}>
            Payment purpose
          </p>
          <div className="purpose-grid">
            {CATEGORIES.map((item) => (
              <button
                key={item}
                className={`purpose-chip ${category === item ? "selected" : ""}`}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </section>
        <section className={`risk-card ${risk.level}`}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
            }}
          >
            <div>
              <p style={{ fontWeight: 800, fontSize: 17 }}>
                {risk.emoji} {risk.label}
              </p>
              <p style={{ color: "#6b7180", fontSize: 12, marginTop: 4 }}>
                {risk.level[0].toUpperCase() + risk.level.slice(1)} risk ·
                explainable rule check
              </p>
            </div>
            <strong style={{ fontSize: 20 }}>
              {risk.score}
              <small style={{ fontSize: 11 }}> / 100</small>
            </strong>
          </div>
          <div className="risk-score">
            <div
              className="risk-score-fill"
              style={{ width: `${risk.score}%`, background: risk.color }}
            />
          </div>
          <p style={{ color: "#606879", fontSize: 12, lineHeight: 1.5 }}>
            {risk.description}
          </p>
          {risk.flags.slice(0, 2).map((flag) => (
            <p
              key={flag}
              style={{ color: "#6b7180", fontSize: 11, marginTop: 9 }}
            >
              • {flag}
            </p>
          ))}
        </section>
        <div className="verify-actions">
          <button
            className="button button-primary"
            onClick={pay}
            disabled={isPaying || !amount}
          >
            {isPaying
              ? "Processing…"
              : amount
                ? `Pay ₹${amount.toLocaleString("en-IN")}`
                : "Enter amount"}
          </button>
          <button
            className="button button-secondary"
            onClick={() => {
              sessionStorage.removeItem(PAYMENT_DRAFT_KEY);
              navigate("/");
            }}
          >
            Cancel
          </button>
        </div>
      </main>
    </div>
  );
}
