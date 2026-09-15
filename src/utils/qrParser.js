export function parseUpiPayload(payload) {
  if (
    typeof payload !== "string" ||
    !payload.toLowerCase().startsWith("upi://pay")
  )
    return null;

  try {
    const url = new URL(payload);
    const upiId = url.searchParams.get("pa");
    if (url.protocol !== "upi:" || url.hostname !== "pay") return null;
    if (!upiId || !upiId.includes("@")) return null;
    const amountValue = url.searchParams.get("am");
    const amount = amountValue ? Number(amountValue) : null;
    if (amountValue && (!Number.isFinite(amount) || amount <= 0)) return null;

    return {
      recipient: url.searchParams.get("pn") || upiId.split("@")[0],
      upiId,
      amount,
      currency: url.searchParams.get("cu") || "INR",
      reference:
        url.searchParams.get("tr") || url.searchParams.get("tid") || "",
      trusted: false,
      payCount: 0,
      verified: false,
      isVerifiedMerchant: false,
      category: "Other",
    };
  } catch {
    return null;
  }
}
