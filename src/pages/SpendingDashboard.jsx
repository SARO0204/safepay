import { useNavigate } from 'react-router-dom';
import SpendingBar from '../components/SpendingBar.jsx';
import BottomNav from '../components/BottomNav.jsx';
import { user, spendingByCategory } from '../data/mockData.js';

export default function SpendingDashboard() {
  const navigate    = useNavigate();
  const totalPct    = Math.round((user.monthlySpent / user.monthlyBudget) * 100);
  const barColor    = totalPct > 80 ? '#ef4444' : totalPct > 60 ? '#f59e0b' : '#00c8ff';
  const alerts      = spendingByCategory.filter(c => c.spent / c.budget > 0.75);

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', paddingBottom: '90px' }}>
      <div style={{ padding: '52px 20px 20px' }}>

        <h1 style={{ color: '#e6edf3', fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>
          Spending Overview
        </h1>
        <p style={{ color: '#6e7681', fontSize: '13px', marginBottom: '24px' }}>
          September 2026
        </p>

        {/* Total budget card */}
        <div style={{
          background:   'linear-gradient(135deg, #1a2d5a, #0f1f3d)',
          borderRadius: '22px',
          padding:      '22px',
          marginBottom: '20px',
          border:       '1px solid rgba(0,200,255,0.15)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <p style={{ color: '#8b949e', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>
                Total Spent
              </p>
              <h2 style={{ color: '#e6edf3', fontSize: '30px', fontWeight: '800', letterSpacing: '-0.5px' }}>
                ₹{user.monthlySpent.toLocaleString('en-IN')}
              </h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: '#8b949e', fontSize: '11px', marginBottom: '4px' }}>Budget</p>
              <p style={{ color: '#00c8ff', fontSize: '22px', fontWeight: '700' }}>
                ₹{user.monthlyBudget.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div style={{
            background:   'rgba(255,255,255,0.1)',
            borderRadius: '6px',
            height:       '10px',
            overflow:     'hidden',
          }}>
            <div style={{
              width:      `${totalPct}%`,
              height:     '100%',
              background: `linear-gradient(90deg, #00c8ff, ${barColor})`,
              borderRadius:'6px',
              transition: 'width 1s ease',
            }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', alignItems: 'center' }}>
            <span style={{ color: '#6e7681', fontSize: '12px' }}>
              ₹{(user.monthlyBudget - user.monthlySpent).toLocaleString('en-IN')} remaining
            </span>
            <span style={{ color: barColor, fontSize: '14px', fontWeight: '700' }}>
              {totalPct}% used
            </span>
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div style={{
            background:   'rgba(239,68,68,0.07)',
            border:       '1px solid rgba(239,68,68,0.25)',
            borderRadius: '16px',
            padding:      '16px',
            marginBottom: '20px',
          }}>
            <p style={{ color: '#ef4444', fontWeight: '700', fontSize: '14px', marginBottom: '8px' }}>
              ⚠️ Spending Alerts
            </p>
            {alerts.map(c => {
              const pct = Math.round((c.spent / c.budget) * 100);
              return (
                <p key={c.category} style={{ color: '#8b949e', fontSize: '13px', marginBottom: '4px' }}>
                  {c.icon} <strong style={{ color: '#e6edf3' }}>{c.category}</strong> is at {pct}% of budget
                </p>
              );
            })}
          </div>
        )}

        {/* Category breakdown */}
        <h3 style={{ color: '#e6edf3', fontSize: '16px', fontWeight: '700', marginBottom: '18px' }}>
          By Category
        </h3>

        {spendingByCategory.map(item => (
          <SpendingBar
            key={item.category}
            category={item.category}
            spent={item.spent}
            budget={item.budget}
            icon={item.icon}
          />
        ))}

        {/* Footer note */}
        <div style={{
          background:   '#161b22',
          borderRadius: '14px',
          padding:      '14px 16px',
          border:       '1px solid #21262d',
          display:      'flex',
          alignItems:   'center',
          gap:          '10px',
          marginTop:    '8px',
        }}>
          <span style={{ fontSize: '18px' }}>💡</span>
          <p style={{ color: '#6e7681', fontSize: '12px', lineHeight: '1.5' }}>
            UPI SAFE tracks unusual spending patterns and adjusts payment risk scores accordingly.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
