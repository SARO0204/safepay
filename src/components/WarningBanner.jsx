export default function WarningBanner({ flags, categoryAvg, amount }) {
  if (!flags || flags.length === 0) return null;

  const ratio = categoryAvg ? Math.round(amount / categoryAvg) : null;

  return (
    <div style={{
      background:   'rgba(245, 158, 11, 0.07)',
      border:       '1.5px solid rgba(245, 158, 11, 0.3)',
      borderRadius: '18px',
      padding:      '18px',
      marginBottom: '14px',
      animation:    'slideUp 0.3s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <span style={{ fontSize: '20px' }}>⚠️</span>
        <span style={{
          color: '#f59e0b', fontWeight: '800', fontSize: '13px',
          textTransform: 'uppercase', letterSpacing: '0.8px',
        }}>
          Unusual Payment
        </span>
      </div>

      {categoryAvg && (
        <p style={{
          color: '#e6edf3', fontSize: '14px', lineHeight: '1.6', marginBottom: '10px',
        }}>
          You usually pay around{' '}
          <strong style={{ color: '#f59e0b' }}>
            ₹{categoryAvg.toLocaleString('en-IN')}
          </strong>{' '}
          for this type of transaction.
          {ratio && ratio > 1 && (
            <> This payment is <strong style={{ color: '#f59e0b' }}>{ratio}×</strong> your usual amount.</>
          )}
        </p>
      )}

      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {flags.map((flag, i) => (
          <li key={i} style={{
            display:    'flex',
            alignItems: 'flex-start',
            gap:        '6px',
            fontSize:   '12px',
            color:      '#8b949e',
            marginBottom: i < flags.length - 1 ? '5px' : 0,
            lineHeight: '1.5',
          }}>
            <span style={{ color: '#f59e0b', marginTop: '1px', flexShrink: 0 }}>›</span>
            {flag}
          </li>
        ))}
      </ul>
    </div>
  );
}
