const CONFIG = {
  low:    { emoji: '🟢', label: 'Safe',   color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.3)'   },
  medium: { emoji: '🟡', label: 'Review', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.3)'  },
  high:   { emoji: '🔴', label: 'Risk',   color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.3)'   },
};

export default function RiskBadge({ level }) {
  const { emoji, label, color, bg, border } = CONFIG[level] || CONFIG.medium;
  return (
    <span style={{
      display:     'inline-flex',
      alignItems:  'center',
      gap:         '3px',
      padding:     '3px 8px',
      borderRadius:'20px',
      background:  bg,
      color,
      fontSize:    '11px',
      fontWeight:  '700',
      border:      `1px solid ${border}`,
      whiteSpace:  'nowrap',
    }}>
      {emoji} {label}
    </span>
  );
}
