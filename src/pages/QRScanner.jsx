import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockQRScans } from '../data/mockData.js';

export default function QRScanner() {
  const navigate = useNavigate();
  const [scanning, setScanning]     = useState(false);
  const [scanned, setScanned]       = useState(false);
  const [upiInput, setUpiInput]     = useState('');
  const [activeScenario, setActive] = useState(0);

  const SCENARIOS = [
    { index: 0, label: 'Medium Risk', color: '#f59e0b', emoji: '🟡' },
    { index: 1, label: 'Low Risk',    color: '#22c55e', emoji: '🟢' },
    { index: 2, label: 'High Risk',   color: '#ef4444', emoji: '🔴' },
  ];

  const handleSimulateScan = () => {
    if (scanning || scanned) return;
    setScanning(true);

    setTimeout(() => {
      setScanning(false);
      setScanned(true);

      setTimeout(() => {
        navigate('/verify', { state: { payment: mockQRScans[activeScenario] } });
      }, 700);
    }, 1600);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117' }}>

      {/* Header */}
      <div style={{
        display:    'flex',
        alignItems: 'center',
        gap:        '14px',
        padding:    '52px 20px 20px',
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background:     '#161b22',
            border:         '1px solid #30363d',
            borderRadius:   '12px',
            width:          '40px',
            height:         '40px',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            cursor:         'pointer',
            color:          '#e6edf3',
            fontSize:       '16px',
            flexShrink:     0,
          }}
        >
          ←
        </button>
        <div>
          <h1 style={{ color: '#e6edf3', fontSize: '20px', fontWeight: '700' }}>Scan QR Code</h1>
          <p style={{ color: '#6e7681', fontSize: '12px', marginTop: '1px' }}>
            UPI SAFE verifies before you pay
          </p>
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>

        {/* Demo scenario selector */}
        <div style={{ marginBottom: '16px' }}>
          <p style={{
            color: '#6e7681', fontSize: '11px', fontWeight: '600',
            textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px',
          }}>
            Demo Scenario
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {SCENARIOS.map(s => (
              <button
                key={s.index}
                onClick={() => { setActive(s.index); setScanned(false); setScanning(false); }}
                style={{
                  flex:         1,
                  padding:      '9px 6px',
                  borderRadius: '12px',
                  border:       activeScenario === s.index
                    ? `1.5px solid ${s.color}`
                    : '1px solid #21262d',
                  background:   activeScenario === s.index
                    ? `${s.color}15`
                    : '#161b22',
                  color:        activeScenario === s.index ? s.color : '#6e7681',
                  fontSize:     '11px',
                  fontWeight:   '600',
                  cursor:       'pointer',
                  fontFamily:   'inherit',
                  textAlign:    'center',
                }}
              >
                {s.emoji}<br />{s.label}
              </button>
            ))}
          </div>
        </div>

        {/* QR Frame */}
        <div style={{
          background:    '#000',
          borderRadius:  '24px',
          padding:       '20px',
          marginBottom:  '16px',
          position:      'relative',
          overflow:      'hidden',
          aspectRatio:   '1',
          display:       'flex',
          alignItems:    'center',
          justifyContent:'center',
          border:        '1px solid #21262d',
        }}>
          {/* Corner brackets */}
          {[
            { top: '18px',  left: '18px',  borderTop: '3px solid #00c8ff', borderLeft:  '3px solid #00c8ff' },
            { top: '18px',  right: '18px', borderTop: '3px solid #00c8ff', borderRight: '3px solid #00c8ff' },
            { bottom:'18px',left: '18px',  borderBottom:'3px solid #00c8ff',borderLeft: '3px solid #00c8ff' },
            { bottom:'18px',right: '18px', borderBottom:'3px solid #00c8ff',borderRight:'3px solid #00c8ff' },
          ].map((s, i) => (
            <div key={i} style={{ position: 'absolute', width: '28px', height: '28px', borderRadius: '4px', ...s }} />
          ))}

          {/* Camera area */}
          <div style={{ textAlign: 'center', zIndex: 1 }}>
            {scanning ? (
              <div>
                <div style={{
                  width:        '60px',
                  height:       '60px',
                  borderRadius: '50%',
                  border:       '3px solid #00c8ff',
                  borderTopColor:'transparent',
                  animation:    'spin 0.7s linear infinite',
                  margin:       '0 auto 14px',
                }} />
                <p style={{ color: '#00c8ff', fontSize: '13px', fontWeight: '600' }}>
                  Scanning QR...
                </p>
              </div>
            ) : scanned ? (
              <div style={{ animation: 'popIn 0.4s ease' }}>
                <div style={{ fontSize: '52px', marginBottom: '8px' }}>✅</div>
                <p style={{ color: '#22c55e', fontSize: '14px', fontWeight: '700' }}>
                  QR Code Detected!
                </p>
                <p style={{ color: '#8b949e', fontSize: '12px', marginTop: '4px' }}>
                  Analysing payment...
                </p>
              </div>
            ) : (
              <div>
                {/* Mock QR pattern */}
                <div style={{
                  display:             'grid',
                  gridTemplateColumns: 'repeat(7, 14px)',
                  gap:                 '3px',
                  margin:              '0 auto 16px',
                  opacity:             0.25,
                }}>
                  {Array(49).fill(null).map((_, i) => {
                    const corners = [0,1,2,7,8,14,6,13,20,42,43,48,49-7,49-8,49-14,49-1,49-2];
                    return (
                      <div key={i} style={{
                        width:        '14px',
                        height:       '14px',
                        borderRadius: '2px',
                        background:   corners.includes(i) || Math.random() > 0.5 ? '#fff' : 'transparent',
                      }} />
                    );
                  })}
                </div>
                <p style={{ color: '#6e7681', fontSize: '13px' }}>
                  Point camera at a QR code
                </p>
                <p style={{ color: '#6e7681', fontSize: '11px', marginTop: '4px' }}>
                  or use Simulate Scan below
                </p>
              </div>
            )}
          </div>

          {/* Scan line */}
          {scanning && (
            <div style={{
              position:   'absolute',
              left:       '18px',
              right:      '18px',
              height:     '2px',
              background: 'linear-gradient(90deg, transparent, #00c8ff, transparent)',
              animation:  'scanLine 1.4s ease-in-out infinite',
              boxShadow:  '0 0 12px #00c8ff',
            }} />
          )}
        </div>

        {/* Simulate Scan button */}
        {!scanned && (
          <button
            onClick={handleSimulateScan}
            disabled={scanning}
            style={{
              width:        '100%',
              background:   scanning
                ? '#21262d'
                : 'linear-gradient(135deg, #00c8ff, #0066ff)',
              border:       'none',
              borderRadius: '18px',
              padding:      '18px',
              color:        scanning ? '#6e7681' : '#fff',
              fontSize:     '16px',
              fontWeight:   '700',
              cursor:       scanning ? 'not-allowed' : 'pointer',
              marginBottom: '16px',
              boxShadow:    scanning ? 'none' : '0 6px 24px rgba(0, 200, 255, 0.3)',
              fontFamily:   'inherit',
              transition:   'all 0.2s',
              animation:    scanning ? 'pulse 1s ease infinite' : 'none',
            }}
          >
            {scanning ? '⏳ Scanning...' : '📷 Simulate Scan'}
          </button>
        )}

        {/* Divider + Manual UPI */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ flex: 1, height: '1px', background: '#21262d' }} />
            <span style={{ color: '#6e7681', fontSize: '12px', whiteSpace: 'nowrap' }}>
              or enter UPI ID manually
            </span>
            <div style={{ flex: 1, height: '1px', background: '#21262d' }} />
          </div>
          <input
            type="text"
            placeholder="name@upi"
            value={upiInput}
            onChange={e => setUpiInput(e.target.value)}
            style={{
              width:        '100%',
              background:   '#161b22',
              border:       '1px solid #30363d',
              borderRadius: '14px',
              padding:      '16px',
              color:        '#e6edf3',
              fontSize:     '15px',
              outline:      'none',
              fontFamily:   'inherit',
              boxSizing:    'border-box',
            }}
          />
        </div>
      </div>
    </div>
  );
}
