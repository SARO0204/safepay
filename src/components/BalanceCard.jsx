export default function BalanceCard({ balance, monthlySpent, monthlyBudget }) {
  const pct   = Math.round((monthlySpent / monthlyBudget) * 100);
  const barColor = pct > 80 ? '#ef4444' : pct > 60 ? '#f59e0b' : '#00c8ff';

  return (
    <div style={{
      background:    'linear-gradient(135deg, #1a2d5a 0%, #0f1f3d 55%, #0a1628 100%)',
      borderRadius:  '24px',
      padding:       '24px',
      marginBottom:  '20px',
      border:        '1px solid rgba(0, 200, 255, 0.15)',
      position:      'relative',
      overflow:      'hidden',
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: 'absolute', top: '-40px', right: '-40px',
        width: '140px', height: '140px', borderRadius: '50%',
        background: 'rgba(0, 200, 255, 0.06)',
      }} />
      <div style={{
        position: 'absolute', bottom: '-50px', right: '50px',
        width: '90px', height: '90px', borderRadius: '50%',
        background: 'rgba(59, 130, 246, 0.07)',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <p style={{
          color: '#8b949e', fontSize: '11px', fontWeight: '600',
          textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px',
        }}>
          Available Balance
        </p>

        <h2 style={{
          color: '#e6edf3', fontSize: '34px', fontWeight: '800',
          letterSpacing: '-0.5px', marginBottom: '20px',
        }}>
          ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </h2>

        <div style={{
          background: 'rgba(255,255,255,0.06)',
          borderRadius: '14px',
          padding: '14px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#8b949e', fontSize: '12px' }}>Monthly Spending</span>
            <span style={{ color: barColor, fontSize: '12px', fontWeight: '700' }}>
              {pct}% used
            </span>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.1)', borderRadius: '6px',
            height: '7px', overflow: 'hidden',
          }}>
            <div style={{
              width:      `${pct}%`,
              height:     '100%',
              background: `linear-gradient(90deg, #00c8ff, ${barColor})`,
              borderRadius: '6px',
              transition:  'width 0.8s ease',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <span style={{ color: '#e6edf3', fontSize: '13px', fontWeight: '600' }}>
              ₹{monthlySpent.toLocaleString('en-IN')}
            </span>
            <span style={{ color: '#6e7681', fontSize: '12px' }}>
              of ₹{monthlyBudget.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
