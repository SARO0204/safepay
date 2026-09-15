import { useNavigate } from "react-router-dom";
import SpendingBar from "../components/SpendingBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { spendingByCategory as initialSpending } from "../data/mockData.js";
import { usePayments } from "../context/PaymentContext.jsx";
export default function SpendingDashboard() {
  const navigate = useNavigate();
  const { spending, monthlySpent, monthlyBudget, remainingBudget, categories } =
    usePayments();
  const pct = Math.min(100, Math.round((monthlySpent / monthlyBudget) * 100));
  return (
    <div className="app-page dashboard-page">
      <header className="page-header">
        <button onClick={() => navigate("/")} className="icon-button">
          ←
        </button>
        <div>
          <p className="eyebrow">YOUR MONEY</p>
          <h1>September spending</h1>
          <p className="page-subtitle">A clear view of where your money goes</p>
        </div>
      </header>
      <main>
        <section className="summary-card">
          <p className="summary-label">Total spent</p>
          <h2 className="summary-amount">
            ₹{monthlySpent.toLocaleString("en-IN")}
          </h2>
          <p className="summary-sub">
            of ₹{monthlyBudget.toLocaleString("en-IN")} budget
          </p>
          <div className="summary-track">
            <div className="summary-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="summary-foot">
            <span>₹{remainingBudget.toLocaleString("en-IN")} remaining</span>
            <strong>{pct}% used</strong>
          </div>
        </section>
        <h2 className="section-title" style={{ marginTop: 28 }}>
          By category
        </h2>
        <div className="category-list">
          {categories.map((category) => {
            const initial = initialSpending.find(
              (item) => item.category === category,
            );
            const spent = spending[category] || 0;
            return (
              <div className="dashboard-item" key={category}>
                <div className="dashboard-item-top">
                  <span>
                    {initial?.icon || "•"} {category}
                  </span>
                  <span>
                    ₹{spent.toLocaleString("en-IN")} / ₹
                    {(initial?.budget || 5000).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="category-track">
                  <div
                    className="category-fill"
                    style={{
                      width: `${Math.min(100, (spent / (initial?.budget || 5000)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
