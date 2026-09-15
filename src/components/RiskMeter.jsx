export default function RiskMeter({ score }) {
  const clamped = Math.min(100, Math.max(0, score));
  const color   = clamped <= 30 ? '#22c55e' : clamped <= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '11px', color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Risk Score
        </span>
        <span style={{ fontSize: '13px', fontWeight: '700', color }}>
          {score} / 100
        </span>
      </div>

      {/* Track */}
      <div style={{
        width: '100%', height: '10px',
        background: '#21262d', borderRadius: '5px', overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Zone markers */}
        <div style={{
          position: 'absolute', left: '30%', top: 0, bottom: 0,
          width: '1px', background: 'rgba(255,255,255,0.1)',
        }} />
        <div style={{
          position: 'absolute', left: '60%', top: 0, bottom: 0,
          width: '1px', background: 'rgba(255,255,255,0.1)',
        }} />
        {/* Fill */}
        <div style={{
          width:      `${clamped}%`,
          height:     '100%',
          background: `linear-gradient(90deg, #22c55e 0%, #f59e0b 50%, #ef4444 100%)`,
          borderRadius: '5px',
          transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          clipPath:   `inset(0 ${100 - clamped}% 0 0)`,
        }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
        <span style={{ fontSize: '10px', color: '#22c55e' }}>Low</span>
        <span style={{ fontSize: '10px', color: '#f59e0b' }}>Medium</span>
        <span style={{ fontSize: '10px', color: '#ef4444' }}>High</span>
      </div>
    </div>
  );
}
