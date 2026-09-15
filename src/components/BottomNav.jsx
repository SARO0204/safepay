import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/',        label: 'Home',    icon: '🏠' },
  { path: '/scan',    label: 'Scan',    icon: '📷' },
  { path: '/spending',label: 'Spending',icon: '📊' },
  { path: '/trusted', label: 'Trusted', icon: '🛡️' },
];

export default function BottomNav() {
  const navigate  = useNavigate();
  const location  = useLocation();

  return (
    <nav style={{
      position:        'fixed',
      bottom:          0,
      left:            '50%',
      transform:       'translateX(-50%)',
      width:           '100%',
      maxWidth:        '430px',
      background:      'rgba(13, 17, 23, 0.95)',
      backdropFilter:  'blur(20px)',
      borderTop:       '1px solid #21262d',
      display:         'flex',
      justifyContent:  'space-around',
      padding:         '8px 0 20px',
      zIndex:          200,
    }}>
      {NAV_ITEMS.map(item => {
        const active = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              background:     'transparent',
              border:         'none',
              outline:        'none',
              cursor:         'pointer',
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              gap:            '4px',
              padding:        '8px 20px',
              borderRadius:   '14px',
              transition:     'background 0.2s',
              position:       'relative',
            }}
          >
            <span style={{ fontSize: '20px', lineHeight: 1 }}>{item.icon}</span>
            <span style={{
              fontSize:   '10px',
              fontWeight: active ? '700' : '400',
              color:      active ? '#00c8ff' : '#6e7681',
              letterSpacing: '0.3px',
            }}>
              {item.label}
            </span>
            {active && (
              <span style={{
                position:     'absolute',
                bottom:       '2px',
                left:         '50%',
                transform:    'translateX(-50%)',
                width:        '4px',
                height:       '4px',
                borderRadius: '50%',
                background:   '#00c8ff',
              }} />
            )}
          </button>
        );
      })}
    </nav>
  );
}
