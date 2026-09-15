import { useNavigate } from 'react-router-dom';
import RecipientCard from '../components/RecipientCard.jsx';
import BottomNav from '../components/BottomNav.jsx';
import { trustedRecipients, newRecipients } from '../data/mockData.js';

export default function TrustedRecipients() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', paddingBottom: '90px' }}>
      <div style={{ padding: '52px 20px 20px' }}>

        <h1 style={{ color: '#e6edf3', fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>
          Trusted Recipients
        </h1>
        <p style={{ color: '#6e7681', fontSize: '13px', marginBottom: '24px' }}>
          Your verified payment contacts
        </p>

        {/* Shield info banner */}
        <div style={{
          background:   'linear-gradient(135deg, rgba(0,200,255,0.07), rgba(0,102,255,0.05))',
          border:       '1px solid rgba(0,200,255,0.2)',
          borderRadius: '18px',
          padding:      '16px',
          marginBottom: '24px',
          display:      'flex',
          alignItems:   'center',
          gap:          '14px',
        }}>
          <div style={{
            width:          '48px',
            height:         '48px',
            borderRadius:   '14px',
            background:     'rgba(0,200,255,0.1)',
            border:         '1px solid rgba(0,200,255,0.2)',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            fontSize:       '22px',
            flexShrink:     0,
          }}>
            🛡️
          </div>
          <div>
            <p style={{ color: '#00c8ff', fontSize: '13px', fontWeight: '700', marginBottom: '3px' }}>
              Safe Payment Shield
            </p>
            <p style={{ color: '#6e7681', fontSize: '12px', lineHeight: 1.4 }}>
              Payments to trusted contacts receive lower risk scores. New contacts are flagged for review.
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          <div style={{
            background:   'rgba(34,197,94,0.07)',
            border:       '1px solid rgba(34,197,94,0.2)',
            borderRadius: '16px',
            padding:      '16px',
            textAlign:    'center',
          }}>
            <p style={{ color: '#22c55e', fontSize: '28px', fontWeight: '800', lineHeight: 1 }}>
              {trustedRecipients.length}
            </p>
            <p style={{ color: '#8b949e', fontSize: '12px', marginTop: '4px' }}>Trusted</p>
          </div>
          <div style={{
            background:   'rgba(245,158,11,0.07)',
            border:       '1px solid rgba(245,158,11,0.2)',
            borderRadius: '16px',
            padding:      '16px',
            textAlign:    'center',
          }}>
            <p style={{ color: '#f59e0b', fontSize: '28px', fontWeight: '800', lineHeight: 1 }}>
              {newRecipients.length}
            </p>
            <p style={{ color: '#8b949e', fontSize: '12px', marginTop: '4px' }}>New / Recent</p>
          </div>
        </div>

        {/* Trusted list */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span style={{ fontSize: '16px' }}>✅</span>
          <h3 style={{ color: '#e6edf3', fontSize: '15px', fontWeight: '700' }}>
            Trusted ({trustedRecipients.length})
          </h3>
        </div>

        {trustedRecipients.map(r => (
          <RecipientCard
            key={r.id}
            recipient={r.name}
            upiId={r.upiId}
            trusted={true}
            payCount={r.payCount}
            verified={r.verified}
            lastPaid={r.lastPaid}
          />
        ))}

        {/* New / recent list */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', marginTop: '24px' }}>
          <span style={{ fontSize: '16px' }}>🆕</span>
          <h3 style={{ color: '#e6edf3', fontSize: '15px', fontWeight: '700' }}>
            New / Recent ({newRecipients.length})
          </h3>
        </div>

        {newRecipients.map(r => (
          <RecipientCard
            key={r.id}
            recipient={r.name}
            upiId={r.upiId}
            trusted={false}
            payCount={r.payCount}
            verified={r.verified}
            lastPaid={r.lastPaid}
          />
        ))}

        {/* Footer tip */}
        <div style={{
          marginTop:    '20px',
          background:   '#161b22',
          borderRadius: '14px',
          padding:      '14px 16px',
          border:       '1px solid #21262d',
          display:      'flex',
          gap:          '10px',
          alignItems:   'flex-start',
        }}>
          <span style={{ fontSize: '16px', flexShrink: 0 }}>💡</span>
          <p style={{ color: '#6e7681', fontSize: '12px', lineHeight: 1.6 }}>
            After 5 successful payments, a recipient is automatically promoted to trusted status, reducing future risk scores.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
