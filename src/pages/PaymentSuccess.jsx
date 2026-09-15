import { useNavigate, useLocation } from 'react-router-dom';

const RISK_COLORS = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444' };

const DEFAULT_TXN = {
  recipient:  'Rahul Stores',
  upiId:      'rahulstores@upi',
  amount:     8500,
  category:   'Shopping',
  txnId:      'UPI20260915XX',
  date:       '15 Sep 2026',
  time:       '2:34 PM',
  riskResult: { level: 'medium', label: 'Review Payment', emoji: '🟡' },
};

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const txn      = location.state?.txn || DEFAULT_TXN;
  const rc       = RISK_COLORS[txn.riskResult?.level || 'medium'];

  const DETAILS = [
    { label: 'Recipient',       value: txn.recipient, bold: true  },
    { label: 'UPI ID',          value: txn.upiId                   },
    { label: 'Purpose',         value: txn.category                },
    { label: 'Date',            value: txn.date                    },
    { label: 'Time',            value: txn.time                    },
    { label: 'Transaction ID',  value: txn.txnId,     mono: true   },
  ];

  return (
    <div style={{
      minHeight:      '100vh',
      background:     '#0d1117',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        '24px 20px',
    }}>

      {/* Success icon */}
      <div style={{
        width:          '96px',
        height:         '96px',
        borderRadius:   '50%',
        background:     'rgba(34, 197, 94, 0.1)',
        border:         '2px solid rgba(34, 197, 94, 0.35)',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        fontSize:       '44px',
        marginBottom:   '20px',
        animation:      'popIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        ✅
      </div>

      <h1 style={{
        color:        '#22c55e',
        fontSize:     '28px',
        fontWeight:   '800',
        marginBottom: '6px',
        textAlign:    'center',
      }}>
        Payment Successful!
      </h1>
      <p style={{
        color:        '#6e7681',
        fontSize:     '14px',
        marginBottom: '32px',
        textAlign:    'center',
      }}>
        Transaction completed securely
      </p>

      {/* Receipt card */}
      <div style={{
        background:   '#161b22',
        borderRadius: '24px',
        padding:      '24px',
        width:        '100%',
        maxWidth:     '380px',
        border:       '1px solid #21262d',
        marginBottom: '24px',
        animation:    'slideUp 0.4s ease 0.1s both',
      }}>
        {/* Amount */}
        <div style={{
          textAlign:    'center',
          paddingBottom:'20px',
          borderBottom: '1px dashed #21262d',
          marginBottom: '20px',
        }}>
          <p style={{ color: '#6e7681', fontSize: '12px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Amount Paid
          </p>
          <h2 style={{
            color:         '#e6edf3',
            fontSize:      '40px',
            fontWeight:    '900',
            letterSpacing: '-1px',
          }}>
            ₹{txn.amount.toLocaleString('en-IN')}
          </h2>
        </div>

        {/* Detail rows */}
        {DETAILS.map(({ label, value, bold, mono }) => (
          <div key={label} style={{
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'center',
            marginBottom:   '13px',
          }}>
            <span style={{ color: '#6e7681', fontSize: '13px' }}>{label}</span>
            <span style={{
              color:       '#e6edf3',
              fontSize:    '13px',
              fontWeight:  bold ? '700' : '400',
              fontFamily:  mono ? '"SF Mono", "Fira Code", monospace' : 'inherit',
              textAlign:   'right',
              maxWidth:    '58%',
              overflow:    'hidden',
              textOverflow:'ellipsis',
              whiteSpace:  'nowrap',
            }}>
              {value}
            </span>
          </div>
        ))}

        {/* Risk level */}
        <div style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'center',
          paddingTop:     '14px',
          borderTop:      '1px solid #21262d',
        }}>
          <span style={{ color: '#6e7681', fontSize: '13px' }}>Risk Level</span>
          <span style={{
            color:      rc,
            fontSize:   '13px',
            fontWeight: '700',
          }}>
            {txn.riskResult?.emoji} {txn.riskResult?.label || 'Review Payment'}
          </span>
        </div>
      </div>

      {/* Verified by UPI SAFE stamp */}
      <div style={{
        display:      'flex',
        alignItems:   'center',
        gap:          '6px',
        marginBottom: '28px',
        opacity:      0.6,
      }}>
        <span style={{ fontSize: '14px' }}>🛡️</span>
        <span style={{ color: '#6e7681', fontSize: '12px' }}>Verified by UPI SAFE</span>
      </div>

      {/* Buttons */}
      <div style={{ width: '100%', maxWidth: '380px', display: 'flex', gap: '12px' }}>
        <button
          onClick={() => alert('Receipt sharing coming soon!')}
          style={{
            flex:         1,
            background:   '#161b22',
            border:       '1px solid #30363d',
            borderRadius: '16px',
            padding:      '17px',
            color:        '#e6edf3',
            fontSize:     '14px',
            fontWeight:   '600',
            cursor:       'pointer',
            fontFamily:   'inherit',
          }}
        >
          📤 Share
        </button>
        <button
          onClick={() => navigate('/')}
          style={{
            flex:         2,
            background:   'linear-gradient(135deg, #00c8ff, #0066ff)',
            border:       'none',
            borderRadius: '16px',
            padding:      '17px',
            color:        '#fff',
            fontSize:     '15px',
            fontWeight:   '700',
            cursor:       'pointer',
            fontFamily:   'inherit',
            boxShadow:    '0 4px 20px rgba(0,200,255,0.3)',
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
}
