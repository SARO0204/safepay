import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav.jsx";
import { currentUser } from "../data/mockData.js";

const methods = [
  ["▣", "Bank account", "1 account"],
  ["◇", "RuPay Card", "Pay with UPI"],
  ["ϟ", "UPI Lite", "PIN-free payments"],
];
const menuItems = [
  ["▣", "Pay with credit or debit cards", "Pay bills with your card", "cards"],
  ["⌗", "Your QR code", "Use to receive money from any UPI app", "qr"],
  ["↻", "Autopay", "No pending requests", "autopay"],
  ["♡", "Set up pocket money", "Let your loved ones pay using UPI", "pocket"],
  ["⚙", "Settings", "", "settings"],
  ["◉", "Manage account", "", "account"],
  ["?", "Get help", "", "help"],
  ["◎", "Language", "English", "language"],
];

function Avatar({ large = false }) {
  return (
    <span
      className={`profile-photo ${large ? "profile-photo-large" : "profile-avatar"}`}
    >
      <img
        src={currentUser.profileImage}
        alt={`${currentUser.name} profile`}
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
      <span>{currentUser.name[0]}</span>
    </span>
  );
}

function Modal({ title, children, onClose }) {
  useEffect(() => {
    const close = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [onClose]);
  return (
    <div
      className="profile-modal-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="profile-demo-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="profile-modal-close"
          onClick={() => onClose()}
          aria-label="Close"
        >
          ×
        </button>
        <p className="eyebrow">UPI SAFE</p>
        <h2 id="profile-modal-title">{title}</h2>
        {children}
        <button className="button button-primary" onClick={() => onClose()}>
          Close
        </button>
      </section>
    </div>
  );
}

function ReceivingQr({ onClose }) {
  return (
    <Modal title="Your UPI QR" onClose={onClose}>
      <Avatar />
      <div
        className="profile-qr-code"
        aria-label="UPI SAFE receiving QR placeholder"
      >
        <span className="qr-pattern qr-a" />
        <span className="qr-pattern qr-b" />
        <span className="qr-pattern qr-c" />
        <span className="qr-center">✓</span>
      </div>
      <strong>{currentUser.name}</strong>
      <p className="profile-qr-upi">{currentUser.upiId}</p>
      <p className="profile-qr-caption">Scan to pay me</p>
    </Modal>
  );
}

function ModalContent({ type, onClose }) {
  const [settings, setSettings] = useState({
    confirmation: true,
    alerts: true,
    biometric: true,
    notifications: true,
  });
  const [language, setLanguage] = useState("English");
  if (type === "qr") return <ReceivingQr onClose={onClose} />;
  if (type === "rewards")
    return (
      <Modal title="Rewards" onClose={onClose}>
        <div className="modal-highlight">
          🏆 <strong>Your Rewards</strong>
          <span>You have earned: {currentUser.rewards} rewards</span>
        </div>
        <p className="modal-subheading">Recent rewards</p>
        <p className="modal-list">
          • Welcome reward
          <br />• Payment reward
          <br />• Referral reward
        </p>
      </Modal>
    );
  if (type === "refer")
    return (
      <Modal title="Refer & Earn" onClose={onClose}>
        <p className="modal-copy">
          Get ₹{currentUser.referralReward} for every eligible referral.
        </p>
        <button
          className="button button-secondary"
          onClick={() => window.alert("Referral link copied")}
        >
          Copy Referral Code
        </button>
        <button
          className="button button-secondary"
          onClick={() => window.alert("Invite ready to share")}
        >
          Share Invite
        </button>
      </Modal>
    );
  if (type === "methods")
    return (
      <Modal title="Payment Methods" onClose={onClose}>
        <div className="modal-list">
          <strong>✓ Bank Account</strong>
          <span>ICICI Bank · •••• 2045 · Primary</span>
          <strong>＋ RuPay Credit Card</strong>
          <span>Not added</span>
          <strong>⚡ UPI Lite</strong>
          <span>Available</span>
        </div>
      </Modal>
    );
  if (type === "cards")
    return (
      <Modal title="Cards" onClose={onClose}>
        <p className="modal-copy">No card added yet.</p>
        <button
          className="button button-secondary"
          onClick={() => onClose("addCard")}
        >
          ＋ Add Card
        </button>
      </Modal>
    );
  if (type === "addCard")
    return (
      <Modal title="Add Card" onClose={onClose}>
        <label className="modal-field">
          Card Number
          <input
            className="field-input"
            placeholder="•••• •••• •••• ••••"
            inputMode="numeric"
          />
        </label>
        <div className="modal-field-row">
          <label className="modal-field">
            Expiry
            <input className="field-input" placeholder="MM / YY" />
          </label>
          <label className="modal-field">
            CVV
            <input
              className="field-input"
              placeholder="•••"
              inputMode="numeric"
            />
          </label>
        </div>
        <button
          type="button"
          className="button button-primary"
          onClick={() => onClose()}
        >
          Add Card
        </button>
      </Modal>
    );
  if (type === "autopay")
    return (
      <Modal title="Autopay" onClose={onClose}>
        <p className="modal-copy">No pending requests</p>
        <p className="modal-copy">Upcoming: No scheduled payments</p>
      </Modal>
    );
  if (type === "pocket")
    return (
      <Modal title="Pocket Money" onClose={onClose}>
        <p className="modal-copy">
          Let trusted family members make payments for you.
        </p>
        <p className="modal-copy">
          <strong>Status:</strong> Not configured
        </p>
        <button
          className="button button-secondary"
          onClick={() => window.alert("Pocket Money setup started")}
        >
          Set Up
        </button>
      </Modal>
    );
  if (type === "account")
    return (
      <Modal title="Manage Account" onClose={onClose}>
        <div className="modal-list">
          <strong>{currentUser.name}</strong>
          <span>{currentUser.upiId}</span>
          <span>{currentUser.phone}</span>
          <strong>✓ Account verified</strong>
          <span>Security: Protected by UPI SAFE</span>
        </div>
      </Modal>
    );
  if (type === "help")
    return (
      <Modal title="Help & Support" onClose={onClose}>
        <p className="modal-copy">
          <strong>How can we help?</strong>
        </p>
        {[
          "Payment issue",
          "QR scanning issue",
          "Transaction safety",
          "Account issue",
        ].map((item) => (
          <button
            className="profile-faq"
            key={item}
            onClick={() =>
              window.alert(
                "UPI payment safety: Never share your UPI PIN with anyone.",
              )
            }
          >
            {item}
            <span>›</span>
          </button>
        ))}
      </Modal>
    );
  if (type === "language")
    return (
      <Modal title="Language" onClose={onClose}>
        {["English", "தமிழ்", "हिन्दी"].map((item) => (
          <button
            className={`profile-language ${language === item ? "selected" : ""}`}
            key={item}
            onClick={() => setLanguage(item)}
          >
            {item}
            <span>{language === item ? "✓" : ""}</span>
          </button>
        ))}
      </Modal>
    );
  return (
    <Modal title="Settings" onClose={onClose}>
      {[
        ["confirmation", "Payment confirmation"],
        ["alerts", "Security alerts"],
        ["biometric", "Biometric verification"],
        ["notifications", "Transaction notifications"],
      ].map(([key, label]) => (
        <label className="profile-toggle" key={key}>
          <span>
            {label}
            <small>{settings[key] ? "ON" : "OFF"}</small>
          </span>
          <input
            type="checkbox"
            checked={settings[key]}
            onChange={() =>
              setSettings((value) => ({ ...value, [key]: !value[key] }))
            }
          />
        </label>
      ))}
    </Modal>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const [modal, setModal] = useState(null);
  const open = (type) => setModal(type);
  return (
    <div className="app-page profile-page">
      <header className="page-header profile-page-header">
        <button
          className="icon-button"
          onClick={() => navigate("/")}
          aria-label="Back to home"
        >
          ←
        </button>
        <div>
          <p className="eyebrow">UPI SAFE</p>
          <h1>Your Profile</h1>
        </div>
      </header>
      <main className="profile-content">
        <section className="profile-identity">
          <Avatar large />
          <h2>{currentUser.name}</h2>
          <p>{currentUser.upiId}</p>
          <p>{currentUser.phone}</p>
          <span className="profile-verified">✓ UPI ID Verified</span>
        </section>
        <div className="profile-rewards">
          <button
            className="profile-reward-card"
            onClick={() => open("rewards")}
          >
            <span className="profile-card-icon">🎁</span>
            <span>
              <strong>Rewards</strong>
              <span>{currentUser.rewards} rewards</span>
            </span>
          </button>
          <button className="profile-reward-card" onClick={() => open("refer")}>
            <span className="profile-card-icon">↗</span>
            <span>
              <strong>Refer &amp; Earn</strong>
              <span>Get ₹{currentUser.referralReward}</span>
            </span>
          </button>
        </div>
        <section className="profile-section">
          <button
            className="profile-section-heading profile-section-button"
            onClick={() => open("methods")}
          >
            <h2>Payment methods</h2>
            <span>›</span>
          </button>
          <div className="payment-methods">
            {methods.map(([icon, title, subtitle]) => (
              <button
                type="button"
                className="payment-method"
                key={title}
                onClick={() =>
                  open(title === "Bank account" ? "methods" : "cards")
                }
              >
                <span className="payment-method-icon">{icon}</span>
                <strong className="payment-method-title">{title}</strong>
                <span className="payment-method-subtitle">{subtitle}</span>
              </button>
            ))}
          </div>
        </section>
        <section className="profile-protection">
          <span className="profile-protection-icon">🛡</span>
          <div>
            <strong>UPI SAFE Protection</strong>
            <p>Smart Verification is active for your payments.</p>
          </div>
          <span className="protected-badge">Protected</span>
        </section>
        <section className="profile-section profile-menu-section">
          <h2 className="profile-section-title">More for you</h2>
          <div className="profile-menu">
            {menuItems.map(([icon, title, subtitle, type]) => (
              <button
                className="profile-menu-row"
                key={title}
                onClick={() => open(type)}
              >
                <span className="profile-menu-icon">{icon}</span>
                <span className="profile-menu-copy">
                  <strong>{title}</strong>
                  {subtitle && <small>{subtitle}</small>}
                </span>
                <span className="profile-menu-arrow">›</span>
              </button>
            ))}
          </div>
        </section>
      </main>
      <BottomNav />
      {modal && (
        <ModalContent type={modal} onClose={(next) => setModal(next || null)} />
      )}
    </div>
  );
}
