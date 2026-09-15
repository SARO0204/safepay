export default function RecipientCard({ recipient, upiId, trusted, payCount, verified, lastPaid }) {
  const isNew       = payCount === 0;
  const avatarEmoji = isNew ? '🆕' : trusted ? '✅' : '🕐';
  const accentColor = isNew ? '#f59e0b' : trusted ? '#22c55e' : '#8b949e';

  return (
    <div style={{
      background:   '#161b22',
      borderRadius: '16px',
      padding:      '16px',
      border:       `1px solid ${isNew ? 'rgba(245,158,11,0.2)' : '#21262d'}`,
      marginBottom: '10px',
      display:      'flex',
      alignItems:   'center',
      gap:          '12px',
    }}>
      <div style={{
        width:          '50px',
        height:         '50px',
        borderRadius:   '14px',
        background:     `${accentColor}15`,
        border:         `1.5px solid ${accentColor}40`,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        fontSize:       '22px',
        flexShrink:     0,
      }}>
        {avatarEmoji}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: '#e6edf3', fontWeight: '600', fontSize: '15px', marginBottom: '2px' }}>
          {recipient}
        </p>
        <p style={{ color: '#6e7681', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {upiId}
        </p>
      </div>

      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        {verified && (
          <p style={{ color: '#22c55e', fontSize: '11px', fontWeight: '700', marginBottom: '3px' }}>
            ✓ Verified
          </p>
        )}
        <p style={{ color: '#6e7681', fontSize: '11px' }}>
          {isNew ? 'New' : `${payCount} payments`}
        </p>
        {lastPaid && (
          <p style={{ color: '#6e7681', fontSize: '10px', marginTop: '2px' }}>
            Last: {lastPaid}
          </p>
        )}
      </div>
    </div>
  );
}
