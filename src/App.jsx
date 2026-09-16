import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import QRScanner from "./pages/QRScanner.jsx";
import VerificationScreen from "./pages/VerificationScreen.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import SpendingDashboard from "./pages/SpendingDashboard.jsx";
import TrustedRecipients from "./pages/TrustedRecipients.jsx";
import SendMoney from "./pages/SendMoney.jsx";
import Profile from "./pages/Profile.jsx";
import TransactionHistory from "./pages/TransactionHistory.jsx";
import { PaymentProvider } from "./context/PaymentContext.jsx";

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <PaymentProvider>
        <div className="wallet-shell">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scan" element={<QRScanner />} />
            <Route path="/send" element={<SendMoney />} />
            <Route path="/verify" element={<VerificationScreen />} />
            <Route path="/success" element={<PaymentSuccess />} />
            <Route path="/spending" element={<SpendingDashboard />} />
            <Route path="/trusted" element={<TrustedRecipients />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/transactions" element={<TransactionHistory />} />
          </Routes>
        </div>
      </PaymentProvider>
    </Router>
  );
}
