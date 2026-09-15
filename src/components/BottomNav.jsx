import { useLocation, useNavigate } from "react-router-dom";
const ITEMS = [
  { path: "/", label: "Home", icon: "⌂" },
  { path: "/scan", label: "Scan", icon: "▣" },
  { path: "/spending", label: "Spending", icon: "▥" },
  { path: "/profile", label: "You", icon: "●" },
];
export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <nav className="bottom-nav">
      {ITEMS.map((item) => (
        <button
          key={item.path}
          className={location.pathname === item.path ? "active" : ""}
          onClick={() => navigate(item.path)}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
