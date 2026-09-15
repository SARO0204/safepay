import { useLocation, useNavigate } from "react-router-dom";
export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const txn = state?.txn || {
    recipient: "Rahul Stores",
    upiId: "rahulstores@upi",
    amount: 0,
    category: "Other",
    txnId: "UPISAFE-DEMO",
    date: "Today",
    time: "Now",
    riskResult: { label: "Low Risk", emoji: "🟢" },
  };
  const details = [
    ["Recipient", txn.recipient],
    ["UPI ID", txn.upiId],
    ["Purpose", txn.category],
    ["Date", txn.date],
    ["Time", txn.time],
    ["Transaction ID", txn.txnId],
  ];
  return (
    <div className="app-page success-page">
      <div className="success-mark">✓</div>
      <h1>Payment Successful</h1>
      <p>Your payment was completed securely.</p>
      <section className="receipt-card">
        <h2 className="receipt-amount">
          ₹{Number(txn.amount).toLocaleString("en-IN")}
        </h2>
        {details.map(([label, value]) => (
          <div className="receipt-row" key={label}>
            <span>{label}</span>
            <span>{value}</span>
          </div>
        ))}
        <div className="receipt-row">
          <span>Risk</span>
          <span style={{ color: "#1da56d" }}>
            {txn.riskResult?.emoji} {txn.riskResult?.label || "Low Risk"}
          </span>
        </div>
      </section>
      <div className="success-actions">
        <button
          className="button button-secondary"
          onClick={() => window.print()}
        >
          Share Receipt
        </button>
        <button className="button" onClick={() => navigate("/")}>
          Done
        </button>
      </div>
    </div>
  );
}
