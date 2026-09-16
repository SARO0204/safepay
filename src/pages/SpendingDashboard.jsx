import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav.jsx";
import { usePayments } from "../context/PaymentContext.jsx";

const CATEGORY_ICONS = {
  Food: "🍔",
  Shopping: "🛍️",
  Travel: "✈️",
  Bills: "📄",
  Education: "🎓",
  Other: "•",
};

export default function SpendingDashboard() {
  const navigate = useNavigate();
  const {
    spending,
    monthlySpent,
    monthlyBudget,
    remainingBudget,
    categoryBudgets,
    categories,
    updateBudgets,
  } = usePayments();
  const [isEditing, setIsEditing] = useState(false);
  const [budgetError, setBudgetError] = useState("");
  const [budgetForm, setBudgetForm] = useState({
    monthlyBudget: String(monthlyBudget),
    categoryBudgets: Object.fromEntries(
      categories.map((category) => [
        category,
        String(categoryBudgets[category]),
      ]),
    ),
  });
  const pct = Math.round((monthlySpent / monthlyBudget) * 100);

  const openEditor = () => {
    setBudgetForm({
      monthlyBudget: String(monthlyBudget),
      categoryBudgets: Object.fromEntries(
        categories.map((category) => [
          category,
          String(categoryBudgets[category]),
        ]),
      ),
    });
    setBudgetError("");
    setIsEditing(true);
  };

  const saveBudgets = () => {
    const values = [
      budgetForm.monthlyBudget,
      ...Object.values(budgetForm.categoryBudgets),
    ].map(Number);
    if (values.some((value) => !Number.isFinite(value) || value <= 0)) {
      setBudgetError("Enter a budget greater than ₹0 for every field.");
      return;
    }
    updateBudgets({
      monthlyBudget: values[0],
      categoryBudgets: Object.fromEntries(
        categories.map((category) => [
          category,
          Number(budgetForm.categoryBudgets[category]),
        ]),
      ),
    });
    setIsEditing(false);
  };

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
            <div
              className={`summary-fill ${pct > 100 ? "over-budget" : ""}`}
              style={{ width: `${Math.min(100, pct)}%` }}
            />
          </div>
          <div className="summary-foot">
            <span>
              {remainingBudget > 0
                ? `₹${remainingBudget.toLocaleString("en-IN")} remaining`
                : `₹${Math.abs(remainingBudget).toLocaleString("en-IN")} over budget`}
            </span>
            <strong>{pct}% used</strong>
          </div>
          {pct > 100 && (
            <p className="budget-warning">Monthly budget exceeded</p>
          )}
          <button
            className="button button-secondary budget-button"
            onClick={openEditor}
          >
            {isEditing ? "Edit Budget" : "Set Budget"}
          </button>
        </section>
        <h2 className="section-title" style={{ marginTop: 28 }}>
          By category
        </h2>
        <div className="category-list">
          {categories.map((category) => {
            const spent = spending[category] || 0;
            const budget = categoryBudgets[category];
            const categoryPct = Math.round((spent / budget) * 100);
            return (
              <div className="dashboard-item" key={category}>
                <div className="dashboard-item-top">
                  <span>
                    {CATEGORY_ICONS[category]} {category}
                  </span>
                  <span>
                    ₹{spent.toLocaleString("en-IN")} / ₹
                    {budget.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="category-track">
                  <div
                    className={`category-fill ${categoryPct > 100 ? "over-budget" : ""}`}
                    style={{
                      width: `${Math.min(100, categoryPct)}%`,
                    }}
                  />
                </div>
                <div className="dashboard-item-meta">
                  <span>{categoryPct}% used</span>
                  <span>
                    {spent > budget
                      ? `₹${(spent - budget).toLocaleString("en-IN")} over`
                      : `₹${(budget - spent).toLocaleString("en-IN")} remaining`}
                  </span>
                </div>
                {categoryPct > 100 && (
                  <p className="budget-warning">Budget exceeded</p>
                )}
              </div>
            );
          })}
        </div>
      </main>
      <BottomNav />
      {isEditing && (
        <div className="profile-modal-backdrop" role="presentation">
          <section
            className="profile-demo-modal budget-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="budget-title"
          >
            <button
              className="profile-modal-close"
              onClick={() => setIsEditing(false)}
              aria-label="Close budget editor"
            >
              ×
            </button>
            <p className="eyebrow">SPENDING CONTROLS</p>
            <h2 id="budget-title">Edit budgets</h2>
            <label className="modal-field" htmlFor="monthly-budget">
              Overall monthly budget
              <input
                id="monthly-budget"
                className="field-input"
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                value={budgetForm.monthlyBudget}
                onChange={(event) =>
                  setBudgetForm((current) => ({
                    ...current,
                    monthlyBudget: event.target.value,
                  }))
                }
              />
            </label>
            <div className="budget-category-fields">
              {categories.map((category) => (
                <label
                  className="modal-field"
                  htmlFor={`budget-${category}`}
                  key={category}
                >
                  {category} budget
                  <input
                    id={`budget-${category}`}
                    className="field-input"
                    type="number"
                    min="1"
                    step="1"
                    inputMode="numeric"
                    value={budgetForm.categoryBudgets[category]}
                    onChange={(event) =>
                      setBudgetForm((current) => ({
                        ...current,
                        categoryBudgets: {
                          ...current.categoryBudgets,
                          [category]: event.target.value,
                        },
                      }))
                    }
                  />
                </label>
              ))}
            </div>
            {budgetError && <p className="error-text">{budgetError}</p>}
            <button className="button button-primary" onClick={saveBudgets}>
              Save budgets
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
