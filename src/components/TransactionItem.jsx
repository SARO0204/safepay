import RiskBadge from './RiskBadge.jsx';

const CAT_ICONS = {
  Food: '🍔', Shopping: '🛍️', Travel: '✈️',
  Bills: '📄', Personal: '👤', Other: '💳',
};

export default function TransactionItem({ transaction }) {
  const { recipient, amount, category, date, riskLevel, trusted } = transaction;

  return (
    <div style={{
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'space-between',
      padding:        '14px 16px',
      background:     '#161b22',
      borderRadius:   '16px',
      marginBottom:   '10px',
      border:         '1px solid #21262d',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width:          '42px',
          height:         '42px',
          borderRadius:   '12px',
          background:     '#21262d',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          fontSize:       '18px',
          flexShrink:     0,
        }}>
          {CAT_ICONS[category] || '💳'}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ color: '#e6edf3', fontWeight: '500', fontSize: '14px' }}>
              {recipient}
            </span>
            {trusted && (
              <span style={{ fontSize: '11px', color: '#22c55e', fontWeight: '700' }}>✓</span>
            )}
          </div>
          <span style={{ color: '#6e7681', fontSize: '12px' }}>{date}</span>
        </div>
      </div>

      <div style={{ textAlign: 'right' }}>
        <div style={{ color: '#ef4444', fontWeight: '600', fontSize: '15px', marginBottom: '4px' }}>
          -₹{amount.toLocaleString('en-IN')}
        </div>
        <RiskBadge level={riskLevel} />
      </div>
    </div>
  );
}
