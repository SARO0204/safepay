import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav.jsx";
import { usePayments } from "../context/PaymentContext.jsx";

const RISK_LABELS = {
  low: "Low risk",
  medium: "Review",
  high: "High risk",
};

function formatAmount(amount) {
  const value = Number(amount);
  return Number.isFinite(value) ? value.toLocaleString("en-IN") : "0";
}

export default function TransactionHistory() {
  const navigate = useNavigate();
  const { completedTransactions } = usePayments();
  const totalSent = completedTransactions.reduce(
    (total, transaction) => total + Number(transaction.amount),
    0,
  );

  return (
    <div className="app-page history-page">
      <header className="page-header">
        <button
          onClick={() => navigate("/")}
          className="icon-button"
          aria-label="Back to home"
        >
          ←
        </button>
        <div>
          <p className="eyebrow">YOUR MONEY</p>
          <h1>Transaction history</h1>
          <p className="page-subtitle">Completed outgoing payments</p>
        </div>
      </header>
      <main className="history-content">
        <section className="summary-card history-summary">
          <p className="summary-label">Total sent</p>
          <h2 className="summary-amount">₹{formatAmount(totalSent)}</h2>
          <p className="summary-sub">
            {completedTransactions.length} completed payment
            {completedTransactions.length === 1 ? "" : "s"}
          </p>
        </section>
        <section className="history-list" aria-label="Completed transactions">
          {completedTransactions.length === 0 ? (
            <div className="info-card history-empty">
              <strong>No completed payments yet</strong>
              <p>Your successful payments will appear here.</p>
            </div>
          ) : (
            completedTransactions.map((transaction) => (
              <article
                className="history-card"
                key={transaction.id || transaction.txnId}
              >
                <div className="history-card-header">
                  <div>
                    <h2>{transaction.recipient}</h2>
                    {transaction.upiId && <p>{transaction.upiId}</p>}
                  </div>
                  <strong>-₹{formatAmount(transaction.amount)}</strong>
                </div>
                <dl className="history-details">
                  <div>
                    <dt>Purpose</dt>
                    <dd>{transaction.category || "Other"}</dd>
                  </div>
                  <div>
                    <dt>Date / time</dt>
                    <dd>
                      {transaction.date || "Date unavailable"}
                      {transaction.time ? ` · ${transaction.time}` : ""}
                    </dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>Completed</dd>
                  </div>
                  {transaction.riskLevel && (
                    <div>
                      <dt>Risk</dt>
                      <dd>
                        {RISK_LABELS[transaction.riskLevel] ||
                          transaction.riskLevel}
                      </dd>
                    </div>
                  )}
                </dl>
              </article>
            ))
          )}
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
