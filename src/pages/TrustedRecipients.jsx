import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav.jsx";
import { trustedRecipients, newRecipients } from "../data/mockData.js";
export default function TrustedRecipients() {
  const navigate = useNavigate();
  const all = [...trustedRecipients, ...newRecipients];
  return (
    <div className="app-page dashboard-page">
      <header className="page-header">
        <button onClick={() => navigate("/")} className="icon-button">
          ←
        </button>
        <div>
          <p className="eyebrow">YOUR SAFETY NET</p>
          <h1>Trusted contacts</h1>
          <p className="page-subtitle">
            Familiar recipients make payments easier to review
          </p>
        </div>
      </header>
      <main>
        <section
          className="info-card"
          style={{ padding: 18, background: "#f0efff", borderColor: "#dcd8ff" }}
        >
          <strong style={{ color: "#5546d8", fontSize: 14 }}>
            UPI SAFE shield
          </strong>
          <p
            style={{
              color: "#6f6b9b",
              fontSize: 12,
              lineHeight: 1.5,
              marginTop: 6,
            }}
          >
            Trusted contacts receive lower risk scores while new recipients get
            an extra review.
          </p>
        </section>
        <h2 className="section-title" style={{ marginTop: 26 }}>
          All contacts
        </h2>
        <div className="category-list">
          {all.map((item) => (
            <article className="dashboard-item" key={item.id}>
              <div className="transaction-main">
                <span className="recipient-avatar">{item.name[0]}</span>
                <div>
                  <p className="transaction-name">{item.name}</p>
                  <p className="transaction-meta">
                    {item.upiId} · {item.payCount} payments
                  </p>
                </div>
                <span
                  className="recipient-status"
                  style={{ color: item.payCount >= 5 ? "#1da56d" : "#d28b18" }}
                >
                  {item.payCount >= 5 ? "Trusted" : "Review"}
                </span>
              </div>
            </article>
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
