const CAT_ICONS = {
  Food: "🍜",
  Shopping: "◈",
  Travel: "✈",
  Bills: "▣",
  Education: "▤",
  Other: "•",
  Personal: "♥",
};
const RISK = {
  low: ["Low risk", "#eaf8f1", "#16875b"],
  medium: ["Review", "#fff5df", "#ad7311"],
  high: ["High risk", "#ffedf0", "#c64050"],
};
export default function TransactionItem({ transaction }) {
  const [label, background, color] = RISK[transaction.riskLevel] || RISK.low;
  return (
    <article className="transaction-card">
      <div className="transaction-main">
        <div className="transaction-icon">
          {CAT_ICONS[transaction.category] || "•"}
        </div>
        <div>
          <p className="transaction-name">{transaction.recipient}</p>
          <p className="transaction-meta">
            {transaction.category} · {transaction.date}
          </p>
        </div>
      </div>
      <div className="transaction-right">
        <p className="transaction-amount">
          -₹{Number(transaction.amount).toLocaleString("en-IN")}
        </p>
        <span className="risk-pill" style={{ background, color }}>
          {label}
        </span>
      </div>
    </article>
  );
}
