import { useNavigate } from 'react-router-dom';
import BalanceCard from '../components/BalanceCard.jsx';
import TransactionItem from '../components/TransactionItem.jsx';
import BottomNav from '../components/BottomNav.jsx';
import { user, transactions, mockQRScans } from '../data/mockData.js';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', paddingBottom: '90px' }}>

      {/* Header */}
      <div style={{
        padding:    '52px 20px 20px',
        background: 'linear-gradient(180deg, #080e1a 0%, #0d1117 100%)',
      }}>
        <div style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          marginBottom:   '24px',
        }}>
          <div>
            <p style={{ color: '#6e7681', fontSize: '13px', marginBottom: '3px' }}>Good morning</p>
            <h1 style={{ color: '#e6edf3', fontSize: '24px', fontWeight: '800' }}>
              {user.name} 👋
            </h1>
          </div>

          {/* Logo chip */}
          <div style={{
            background:   'rgba(0, 200, 255, 0.08)',
            border:       '1px solid rgba(0, 200, 255, 0.2)',
            borderRadius: '14px',
            padding:      '8px 14px',
            display:      'flex',
            alignItems:   'center',
            gap:          '6px',
          }}>
            <span style={{ fontSize: '16px' }}>🛡️</span>
            <div>
              <p style={{ color: '#00c8ff', fontWeight: '800', fontSize: '13px', lineHeight: 1.1 }}>
                UPI SAFE
              </p>
              <p style={{ color: '#6e7681', fontSize: '9px', lineHeight: 1 }}>
                Pay Fast. Verify First.
              </p>
            </div>
          </div>
        </div>

        <BalanceCard
          balance={user.balance}
          monthlySpent={user.monthlySpent}
          monthlyBudget={user.monthlyBudget}
        />

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button
            onClick={() => navigate('/scan')}
            style={{
              background:   'linear-gradient(135deg, #00c8ff, #0066ff)',
              border:       'none',
              borderRadius: '20px',
              padding:      '20px 16px',
              cursor:       'pointer',
              display:      'flex',
              flexDirection:'column',
              alignItems:   'center',
              gap:          '8px',
              boxShadow:    '0 6px 24px rgba(0, 200, 255, 0.3)',
              transition:   'transform 0.15s ease',
            }}
          >
            <span style={{ fontSize: '26px' }}>📷</span>
            <span style={{ color: '#fff', fontWeight: '700', fontSize: '14px' }}>Scan QR</span>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>Pay instantly</span>
          </button>

          <button
            onClick={() => navigate('/scan')}
            style={{
              background:   '#161b22',
              border:       '1px solid #30363d',
              borderRadius: '20px',
              padding:      '20px 16px',
              cursor:       'pointer',
              display:      'flex',
              flexDirection:'column',
              alignItems:   'center',
              gap:          '8px',
              transition:   'transform 0.15s ease',
            }}
          >
            <span style={{ fontSize: '26px' }}>💸</span>
            <span style={{ color: '#e6edf3', fontWeight: '700', fontSize: '14px' }}>Send Money</span>
            <span style={{ color: '#6e7681', fontSize: '11px' }}>Enter UPI ID</span>
          </button>
        </div>
      </div>

      {/* Safety Tip */}
      <div style={{ padding: '16px 20px 0' }}>
        <div style={{
          background:   'rgba(0, 200, 255, 0.05)',
          border:       '1px solid rgba(0, 200, 255, 0.15)',
          borderRadius: '14px',
          padding:      '12px 14px',
          display:      'flex',
          alignItems:   'center',
          gap:          '10px',
        }}>
          <span style={{ fontSize: '18px' }}>🛡️</span>
          <div>
            <p style={{ color: '#00c8ff', fontSize: '12px', fontWeight: '600' }}>
              Smart Verification Active
            </p>
            <p style={{ color: '#6e7681', fontSize: '11px', marginTop: '1px' }}>
              Every payment is risk-checked before you pay
            </p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'center',
          marginBottom:   '14px',
        }}>
          <h2 style={{ color: '#e6edf3', fontSize: '17px', fontWeight: '700' }}>
            Recent Transactions
          </h2>
          <span
            onClick={() => navigate('/spending')}
            style={{ color: '#00c8ff', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}
          >
            See all →
          </span>
        </div>

        {transactions.slice(0, 4).map(t => (
          <TransactionItem key={t.id} transaction={t} />
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
