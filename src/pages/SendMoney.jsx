import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
const RECIPIENTS = [
  { name: "Mom", upiId: "mom@upi", trusted: true, payCount: 8 },
  {
    name: "Swiggy",
    upiId: "swiggy@upi",
    trusted: true,
    verified: true,
    isVerifiedMerchant: true,
    payCount: 12,
  },
  { name: "College Canteen", upiId: "canteen@upi", payCount: 3 },
  {
    name: "Rahul Stores",
    upiId: "rahulstores@upi",
    verified: true,
    payCount: 0,
  },
];
export default function SendMoney() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const list = useMemo(
    () =>
      RECIPIENTS.filter((item) =>
        `${item.name} ${item.upiId}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [search],
  );
  const choose = (item) => {
    setSelected(item);
    setUpiId(item.upiId);
    setError("");
  };
  const submit = () => {
    const value = Number(amount);
    if (!upiId.includes("@")) return setError("Enter a valid UPI ID.");
    if (!value || value < 1)
      return setError("Enter an amount greater than ₹0.");
    navigate("/verify", {
      state: {
        from: "/send",
        payment: {
          recipient: selected?.name || upiId.split("@")[0],
          upiId,
          amount: value,
          trusted: selected?.trusted || false,
          payCount: selected?.payCount || 0,
          verified: selected?.verified || false,
          isVerifiedMerchant: selected?.isVerifiedMerchant || false,
          category: "Other",
        },
      },
    });
  };
  return (
    <div className="app-page form-page">
      <header className="page-header">
        <button onClick={() => navigate("/")} className="icon-button">
          ←
        </button>
        <div>
          <p className="eyebrow">PAY SOMEONE</p>
          <h1>Send Money</h1>
          <p className="page-subtitle">
            Choose a contact, then verify every detail
          </p>
        </div>
      </header>
      <main>
        <label className="field-label">Search name or UPI ID</label>
        <input
          className="field-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or UPI ID"
        />
        <p className="field-label">Trusted contacts</p>
        <div className="recipient-list">
          {list.map((item) => (
            <button
              key={item.upiId}
              className={`recipient-row ${selected?.upiId === item.upiId ? "selected" : ""}`}
              onClick={() => choose(item)}
            >
              <span className="recipient-avatar">{item.name[0]}</span>
              <span>
                <strong>{item.name}</strong>
                <small>{item.upiId}</small>
              </span>
              <span className="recipient-status">
                {item.trusted ? "Trusted" : "Review"}
              </span>
            </button>
          ))}
        </div>
        <label className="field-label">UPI ID</label>
        <input
          className="field-input"
          value={upiId}
          onChange={(e) => {
            setUpiId(e.target.value);
            setSelected(null);
          }}
          placeholder="name@upi"
        />
        <label className="field-label">Amount</label>
        <input
          className="field-input"
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
          inputMode="decimal"
          placeholder="₹ 0"
        />
        {error && <p className="error-text">{error}</p>}
        <button
          className="button button-primary"
          onClick={submit}
          style={{ marginTop: 20 }}
        >
          Continue to Verification
        </button>
      </main>
    </div>
  );
}
