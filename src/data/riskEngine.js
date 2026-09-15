import { userHistory } from './mockData.js';

/**
 * Rule-based risk scoring.
 * NOT real fraud detection — prototype demonstration only.
 *
 * Scoring rules:
 *   New recipient (0 prior payments)   +20
 *   Unverified UPI ID                  +15
 *   Amount > 10x user average          +30
 *   Amount > 5x user average           +20
 *   Amount > 3x user average           +10
 *   Amount > ₹10,000                   +20
 *   Amount > ₹5,000                    +10
 *   Category amount > 8x cat. average  +20
 *   Category amount > 3x cat. average  +10
 *   Verified merchant                  -10
 *   Frequent recipient (≥5 payments)   -10
 *
 * Bands:
 *   0–30  → Low    (safe to pay)
 *   31–60 → Medium (review payment)
 *   61+   → High   (extra verification)
 */
export function calculateRisk(payment) {
  let score = 0;
  const flags = [];

  // ── Recipient trust ──────────────────────────────────────
  if (!payment.trusted && payment.payCount === 0) {
    score += 20;
    flags.push('New recipient — first time paying this person');
  } else if (payment.payCount >= 5) {
    score -= 10;
  }

  // ── Identity verification ─────────────────────────────────
  if (payment.isVerifiedMerchant || payment.verified) {
    score -= 10;
  } else {
    score += 15;
    flags.push('UPI ID is not verified');
  }

  // ── Amount vs. user average ───────────────────────────────
  const avg   = userHistory.avgTransactionAmount;
  const ratio = payment.amount / avg;

  if (ratio > 10) {
    score += 30;
    flags.push(
      `₹${payment.amount.toLocaleString('en-IN')} is ${Math.round(ratio)}x your average payment`
    );
  } else if (ratio > 5) {
    score += 20;
    flags.push('Amount is much higher than your usual transactions');
  } else if (ratio > 3) {
    score += 10;
    flags.push('Amount is higher than your usual transactions');
  }

  if (payment.amount > 10000) {
    score += 20;
    flags.push('High-value transaction (above ₹10,000)');
  } else if (payment.amount > 5000) {
    score += 10;
    flags.push('Above-average transaction amount');
  }

  // ── Category anomaly ──────────────────────────────────────
  const cat    = payment.category || 'Other';
  const catAvg = userHistory.categoryAverages[cat] || 500;

  if (payment.amount > catAvg * 8) {
    score += 20;
    flags.push(`Unusually high for ${cat} payments (avg ₹${catAvg})`);
  } else if (payment.amount > catAvg * 3) {
    score += 10;
  }

  // ── Clamp ─────────────────────────────────────────────────
  score = Math.max(0, Math.min(100, score));

  // ── Classify ──────────────────────────────────────────────
  let level, label, color, bgColor, borderColor, description, emoji;

  if (score <= 30) {
    level       = 'low';
    label       = 'Safe to Pay';
    color       = '#22c55e';
    bgColor     = 'rgba(34, 197, 94, 0.08)';
    borderColor = 'rgba(34, 197, 94, 0.25)';
    description = 'This transaction looks normal based on your payment history. Safe to proceed.';
    emoji       = '🟢';
  } else if (score <= 60) {
    level       = 'medium';
    label       = 'Review Payment';
    color       = '#f59e0b';
    bgColor     = 'rgba(245, 158, 11, 0.08)';
    borderColor = 'rgba(245, 158, 11, 0.25)';
    description = 'Please verify the recipient details and amount before proceeding.';
    emoji       = '🟡';
  } else {
    level       = 'high';
    label       = 'Extra Verification';
    color       = '#ef4444';
    bgColor     = 'rgba(239, 68, 68, 0.08)';
    borderColor = 'rgba(239, 68, 68, 0.25)';
    description = 'Multiple risk signals detected. Carefully verify before paying.';
    emoji       = '🔴';
  }

  return { score, level, label, color, bgColor, borderColor, description, flags, emoji };
}
