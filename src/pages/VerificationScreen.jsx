import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { calculateRisk } from '../data/riskEngine.js';
import { userHistory } from '../data/mockData.js';
import RiskMeter from '../components/RiskMeter.jsx';
import WarningBanner from '../components/WarningBanner.jsx';
import CategoryChip from '../components/CategoryChip.jsx';

const CATEGORIES = ['Food', 'Shopping', 'Travel', 'Bills', 'Other'];

function getRiskReasons(payment, catAvg) {
  const reasons = [];
  const avgLow  = Math.round(520 * 0.2);   // ~₹100
  const avgHigh = Math.round(520 * 0.96);  // ~₹500

  // Amount
  if (payment.amount > catAvg * 3 || payment.amount > 520 * 3) {
    reasons.push({
      emoji: '🔴',
      title: 'Unusual amount',
      description: `You usually pay around ₹${avgLow.toLocaleString('en-IN')}–₹${avgHigh.toLocaleString('en-IN')}.`,
    });
  } else if (payment.amount > 520 * 1.5) {
    reasons.push({
      emoji: '🟡',
      title: 'Higher than usual amount',
      description: 'This is above your typical payment amount.',
    });
  }

  // Recipient trust
  if (payment.payCount === 0) {
    reasons.push({
      emoji: '🟡',
      title: 'New recipient',
      description: "You haven't paid this recipient before.",
    });
  } else if (payment.payCount < 5) {
    reasons.push({
      emoji: '🟡',
      title: 'Infrequent recipient',
      description: `Only ${payment.payCount} previous payment(s) to this recipient.`,
    });
  }

  // Verification — always shown as a signal (positive or negative)
  if (payment.verified || payment.isVerifiedMerchant) {
    reasons.push({
      emoji: '🟢',
      title: 'UPI ID verified',
      description: 'Recipient UPI information is available.',
    });
  } else {
    reasons.push({
      emoji: '🔴',
      title: 'UPI ID not verified',
      description: 'Recipient UPI information could not be confirmed.',
    });
  }

  return reasons;
}

const DEFAULT_PAYMENT = {
  recipient:          'Rahul Stores',
  upiId:              'rahulstores@upi',
  amount:             8500,
  trusted:            false,
  payCount:           0,
  verified:           true,
  isVerifiedMerchant: true,
  category:           'Shopping',
};

export default function VerificationScreen() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const payment = location.state?.payment || DEFAULT_PAYMENT;

  const [selectedCategory, setSelectedCategory] = useState(payment.category || 'Shopping');

  const riskResult = calculateRisk({ ...payment, category: selectedCategory });
  const catAvg     = userHistory.categoryAverages[selectedCategory] || 500;
  const isUnusual  = payment.amount > catAvg * 3;
  const reasons    = getRiskReasons(payment, catAvg);

  const handlePay = () => {
    const txn = {
      ...payment,
      category:   selectedCategory,
      riskResult,
      txnId:      'UPI' + Date.now().toString().slice(-8).toUpperCase(),
      date:       new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time:       new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
    navigate('/success', { state: { txn } });
  };

  const rc = riskResult.color;
  const rb = riskResult.bgColor;
  const rd = riskResult.borderColor;

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', paddingBottom: '40px' }}>

      {/* Sticky header */}
      <div style={{
        position:     'sticky',
        top:          0,
        zIndex:       50,
        background:   'rgba(13, 17, 23, 0.96)',
        backdropFilter:'blur(20px)',
        borderBottom: '1px solid #21262d',
        padding:      '48px 20px 14px',
        display:      'flex',
        alignItems:   'center',
        gap:          '12px',
      }}>
        <button
          onClick={() => navigate('/scan')}
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
        <div style={{ flex: 1 }}>
          <h1 style={{ color: '#e6edf3', fontSize: '18px', fontWeight: '700' }}>Review Payment</h1>
          <p style={{ color: '#6e7681', fontSize: '11px', marginTop: '1px' }}>
            Smart verification in progress
          </p>
        </div>
        {/* Risk chip in header */}
        <span style={{
          background:    rb,
          border:        `1px solid ${rd}`,
          color:         rc,
          fontSize:      '11px',
          fontWeight:    '800',
          padding:       '5px 10px',
          borderRadius:  '20px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          whiteSpace:    'nowrap',
        }}>
          {riskResult.emoji} {riskResult.level}
        </span>
      </div>

      <div style={{ padding: '20px' }}>

        {/* ── Amount + Recipient card ───────────────────────── */}
        <div style={{
          background:    '#161b22',
          borderRadius:  '22px',
          padding:       '24px',
          marginBottom:  '14px',
          border:        '1px solid #21262d',
          textAlign:     'center',
          animation:     'fadeIn 0.3s ease',
        }}>
          <p style={{ color: '#6e7681', fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            Paying
          </p>
          <h2 style={{
            color:         '#e6edf3',
            fontSize:      '44px',
            fontWeight:    '900',
            letterSpacing: '-1.5px',
            marginBottom:  '20px',
            lineHeight:    1,
          }}>
            ₹{payment.amount.toLocaleString('en-IN')}
          </h2>

          <div style={{
            background:    '#0d1117',
            borderRadius:  '14px',
            padding:       '14px 16px',
            display:       'flex',
            alignItems:    'center',
            gap:           '12px',
            textAlign:     'left',
          }}>
            <div style={{
              width:          '46px',
              height:         '46px',
              borderRadius:   '13px',
              background:     payment.trusted ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)',
              border:         `1.5px solid ${payment.trusted ? 'rgba(34,197,94,0.25)' : 'rgba(245,158,11,0.25)'}`,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              fontSize:       '22px',
              flexShrink:     0,
            }}>
              {payment.payCount === 0 ? '🆕' : payment.trusted ? '✅' : '🏪'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: '#e6edf3', fontWeight: '700', fontSize: '16px' }}>
                {payment.recipient}
              </p>
              <p style={{ color: '#6e7681', fontSize: '12px', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {payment.upiId}
              </p>
            </div>
            <div style={{ flexShrink: 0, textAlign: 'right' }}>
              {(payment.verified || payment.isVerifiedMerchant) ? (
                <span style={{ color: '#22c55e', fontSize: '12px', fontWeight: '700' }}>✓ UPI ID Verified</span>
              ) : (
                <span style={{ color: '#ef4444', fontSize: '12px', fontWeight: '700' }}>✗ UPI ID Unverified</span>
              )}
            </div>
          </div>
        </div>

        {/* ── Identity + Trust (combined, clearly separated) ── */}
        <div style={{
          background:   '#161b22',
          borderRadius: '16px',
          padding:      '16px',
          marginBottom: '14px',
          border:       `1px solid ${payment.payCount === 0 ? 'rgba(245,158,11,0.2)' : '#21262d'}`,
        }}>
          {/* Row 1 — UPI ID identity check */}
          <div style={{ marginBottom: '12px' }}>
            <p style={{ color: '#6e7681', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
              UPI Identity
            </p>
            {(payment.verified || payment.isVerifiedMerchant) ? (
              <p style={{ color: '#22c55e', fontWeight: '700', fontSize: '14px' }}>✓ UPI ID Verified</p>
            ) : (
              <p style={{ color: '#ef4444', fontWeight: '700', fontSize: '14px' }}>✗ UPI ID Not Verified</p>
            )}
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: '#21262d', marginBottom: '12px' }} />

          {/* Row 2 — Recipient trust history */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div>
              <p style={{ color: '#6e7681', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                Recipient Trust
              </p>
              <p style={{
                color:      payment.trusted ? '#22c55e' : payment.payCount > 0 ? '#8b949e' : '#f59e0b',
                fontWeight: '600',
                fontSize:   '14px',
              }}>
                {payment.payCount === 0
                  ? '🆕 New Recipient — First payment'
                  : payment.trusted
                  ? `✅ Trusted · ${payment.payCount} prior payments`
                  : `🕐 ${payment.payCount} previous payments`}
              </p>
            </div>
            {payment.payCount === 0 && (
              <span style={{
                background:   'rgba(245,158,11,0.1)',
                border:       '1px solid rgba(245,158,11,0.3)',
                color:        '#f59e0b',
                fontSize:     '11px',
                fontWeight:   '700',
                padding:      '4px 10px',
                borderRadius: '20px',
                flexShrink:   0,
              }}>
                First Time
              </span>
            )}
          </div>

          {/* Explanation note */}
          <div style={{
            background:   'rgba(255,255,255,0.03)',
            border:       '1px solid rgba(255,255,255,0.06)',
            borderRadius: '8px',
            padding:      '8px 10px',
          }}>
            <p style={{ color: '#6e7681', fontSize: '11px', lineHeight: '1.5', fontStyle: 'italic' }}>
              ⓘ Verified identity does not mean a trusted recipient.
            </p>
          </div>
        </div>

        {/* ── Unusual amount warning ───────────────────────── */}
        {isUnusual && (
          <WarningBanner
            flags={riskResult.flags}
            categoryAvg={catAvg}
            amount={payment.amount}
          />
        )}

        {/* ── Payment Purpose ──────────────────────────────── */}
        <div style={{
          background:   '#161b22',
          borderRadius: '16px',
          padding:      '16px',
          marginBottom: '14px',
          border:       '1px solid #21262d',
        }}>
          <p style={{ color: '#6e7681', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
            Payment Purpose
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {CATEGORIES.map(cat => (
              <CategoryChip
                key={cat}
                category={cat}
                selected={selectedCategory === cat}
                onSelect={setSelectedCategory}
              />
            ))}
          </div>
        </div>

        {/* ── Risk Card ─────────────────────────────────────── */}
        <div style={{
          background:   rb,
          borderRadius: '22px',
          padding:      '22px',
          marginBottom: '24px',
          border:       `1.5px solid ${rd}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <span style={{ fontSize: '28px', lineHeight: 1 }}>{riskResult.emoji}</span>
            <div>
              <p style={{
                color:         rc,
                fontWeight:    '900',
                fontSize:      '17px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                lineHeight:    1.1,
              }}>
                {riskResult.label}
              </p>
              <p style={{ color: '#8b949e', fontSize: '12px', marginTop: '3px' }}>
                {riskResult.level.charAt(0).toUpperCase() + riskResult.level.slice(1)} Risk Level
              </p>
            </div>
          </div>

          <p style={{
            color:        '#c9d1d9',
            fontSize:     '13px',
            lineHeight:   '1.6',
            marginBottom: '18px',
          }}>
            {riskResult.description}
          </p>

          <RiskMeter score={riskResult.score} />

          {/* ── Why was this flagged? ─────────────────────── */}
          {reasons.length > 0 && (
            <div style={{
              marginTop:  '18px',
              paddingTop: '16px',
              borderTop:  '1px solid rgba(255,255,255,0.08)',
            }}>
              <p style={{
                color:         '#8b949e',
                fontSize:      '11px',
                fontWeight:    '700',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                marginBottom:  '12px',
              }}>
                Why was this flagged?
              </p>
              {reasons.map((reason, i) => (
                <div key={i} style={{
                  display:      'flex',
                  gap:          '10px',
                  marginBottom: i < reasons.length - 1 ? '12px' : 0,
                  alignItems:   'flex-start',
                }}>
                  <span style={{ fontSize: '16px', lineHeight: 1, flexShrink: 0, marginTop: '1px' }}>
                    {reason.emoji}
                  </span>
                  <div>
                    <p style={{ color: '#e6edf3', fontSize: '13px', fontWeight: '600', marginBottom: '2px' }}>
                      {reason.title}
                    </p>
                    <p style={{ color: '#8b949e', fontSize: '12px', lineHeight: '1.5' }}>
                      {reason.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Action Buttons ────────────────────────────────── */}
        <button
          onClick={handlePay}
          style={{
            width:        '100%',
            background:   riskResult.level === 'low'
              ? 'linear-gradient(135deg, #22c55e, #16a34a)'
              : riskResult.level === 'medium'
              ? 'linear-gradient(135deg, #f59e0b, #d97706)'
              : 'linear-gradient(135deg, #ef4444, #dc2626)',
            border:       'none',
            borderRadius: '18px',
            padding:      '19px',
            color:        '#fff',
            fontSize:     '16px',
            fontWeight:   '800',
            cursor:       'pointer',
            marginBottom: '12px',
            boxShadow:    riskResult.level === 'low'
              ? '0 6px 24px rgba(34,197,94,0.35)'
              : riskResult.level === 'medium'
              ? '0 6px 24px rgba(245,158,11,0.35)'
              : '0 6px 24px rgba(239,68,68,0.35)',
            fontFamily:   'inherit',
            letterSpacing:'0.3px',
          }}
        >
          {riskResult.level === 'high' ? '⚠️ ' : ''}
          Pay ₹{payment.amount.toLocaleString('en-IN')}
        </button>

        <button
          onClick={() => navigate('/')}
          style={{
            width:        '100%',
            background:   'transparent',
            border:       '1px solid #30363d',
            borderRadius: '18px',
            padding:      '17px',
            color:        '#8b949e',
            fontSize:     '15px',
            fontWeight:   '600',
            cursor:       'pointer',
            fontFamily:   'inherit',
            transition:   'border-color 0.2s',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
