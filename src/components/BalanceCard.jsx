export default function BalanceCard({ balance, monthlySpent, monthlyBudget }) {
  const pct = Math.min(100, Math.round((monthlySpent / monthlyBudget) * 100));
  return (
    <section className="balance-card">
      <p className="label">Available Balance</p>
      <h2 className="balance-amount">₹{balance.toLocaleString("en-IN")}</h2>
      <div className="balance-meta">
        <span className="spent-label">Monthly spending</span>
        <strong>{pct}% used</strong>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="balance-meta">
        <strong>₹{monthlySpent.toLocaleString("en-IN")}</strong>
        <span>of ₹{monthlyBudget.toLocaleString("en-IN")}</span>
      </div>
    </section>
  );
}
