export default function SpendingBar({ category, spent, budget, icon }) {
  const pct   = Math.min(100, Math.round((spent / budget) * 100));
  const color = pct > 80 ? '#ef4444' : pct > 60 ? '#f59e0b' : '#22c55e';

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>{icon}</span>
          <span style={{ color: '#e6edf3', fontSize: '14px', fontWeight: '500' }}>{category}</span>
          {pct > 80 && <span style={{ fontSize: '12px' }}>⚠️</span>}
        </div>
        <span style={{ color: '#8b949e', fontSize: '13px' }}>
          ₹{spent.toLocaleString('en-IN')} / ₹{budget.toLocaleString('en-IN')}
        </span>
      </div>

      <div style={{
        background: '#21262d', borderRadius: '5px',
        height: '8px', overflow: 'hidden',
      }}>
        <div style={{
          width:      `${pct}%`,
          height:     '100%',
          background: color,
          borderRadius: '5px',
          transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>

      <div style={{ textAlign: 'right', marginTop: '4px' }}>
        <span style={{ fontSize: '11px', color, fontWeight: '600' }}>{pct}%</span>
      </div>
    </div>
  );
}
