import { useNavigate } from "react-router-dom";
import BalanceCard from "../components/BalanceCard.jsx";
import TransactionItem from "../components/TransactionItem.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { currentUser } from "../data/mockData.js";
import { usePayments } from "../context/PaymentContext.jsx";

export default function Home() {
  const navigate = useNavigate();
  const { transactions, monthlySpent, monthlyBudget, balance } = usePayments();
  const actions = [
    ["▣", "Scan QR", "/scan"],
    ["→", "Send Money", "/send"],
    ["▥", "Spending", "/spending"],
    ["♡", "Trusted", "/trusted"],
  ];
  return (
    <div className="app-page home-page">
      <section className="home-hero">
        <div className="brand-row">
          <div className="brand">
            <span className="brand-mark">
              <img
                src={currentUser.profileImage}
                alt="UPI SAFE profile"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
              <span>{currentUser.name[0]}</span>
            </span>
            <div>
              <p className="brand-name">UPI SAFE</p>
              <p className="brand-tagline">Pay Fast. Verify First.</p>
            </div>
          </div>
          <button
            className="profile-avatar-button"
            onClick={() => navigate("/profile")}
            aria-label="Open Prabu profile"
          >
            <span className="profile-avatar">
              <img
                src={currentUser.profileImage}
                alt={`${currentUser.name} profile`}
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
              <span>{currentUser.name[0]}</span>
            </span>
          </button>
        </div>
        <div className="greeting">
          <p>Good morning</p>
          <h1>{currentUser.name} 👋</h1>
        </div>
        <BalanceCard
          balance={balance}
          monthlySpent={monthlySpent}
          monthlyBudget={monthlyBudget}
        />
        <div className="quick-actions">
          {actions.map(([icon, label, path]) => (
            <button
              className="quick-action"
              key={path}
              onClick={() => navigate(path)}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </section>
      <section className="home-section">
        <div className="section-row">
          <h2 className="section-title">Recent transactions</h2>
          <span
            className="section-link"
            onClick={() => navigate("/transactions")}
          >
            See all
          </span>
        </div>
        {transactions.slice(0, 5).map((transaction) => (
          <TransactionItem
            key={transaction.id || transaction.txnId}
            transaction={transaction}
          />
        ))}
      </section>
      <BottomNav />
    </div>
  );
}
