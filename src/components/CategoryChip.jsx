export default function CategoryChip({ category, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(category)}
      style={{
        padding:      '8px 16px',
        borderRadius: '20px',
        border:       selected ? '1.5px solid #00c8ff' : '1px solid #30363d',
        background:   selected ? 'rgba(0, 200, 255, 0.12)' : 'rgba(255,255,255,0.03)',
        color:        selected ? '#00c8ff' : '#8b949e',
        fontSize:     '13px',
        fontWeight:   selected ? '600' : '400',
        cursor:       'pointer',
        transition:   'all 0.15s ease',
        outline:      'none',
        fontFamily:   'inherit',
        whiteSpace:   'nowrap',
      }}
    >
      {category}
    </button>
  );
}
