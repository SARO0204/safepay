import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import QRScanner from './pages/QRScanner.jsx';
import VerificationScreen from './pages/VerificationScreen.jsx';
import PaymentSuccess from './pages/PaymentSuccess.jsx';
import SpendingDashboard from './pages/SpendingDashboard.jsx';
import TrustedRecipients from './pages/TrustedRecipients.jsx';

export default function App() {
  return (
    <Router>
      <div style={{
        maxWidth: '430px',
        margin: '0 auto',
        minHeight: '100vh',
        background: '#0d1117',
        position: 'relative',
      }}>
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/scan"     element={<QRScanner />} />
          <Route path="/verify"   element={<VerificationScreen />} />
          <Route path="/success"  element={<PaymentSuccess />} />
          <Route path="/spending" element={<SpendingDashboard />} />
          <Route path="/trusted"  element={<TrustedRecipients />} />
        </Routes>
      </div>
    </Router>
  );
}
