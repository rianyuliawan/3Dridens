import crypto from "node:crypto";
import midtransClient from "midtrans-client";

const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";

export function isMidtransConfigured() {
  return Boolean(process.env.MIDTRANS_SERVER_KEY && process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY);
}

export function getSnapClient() {
  return new midtransClient.Snap({
    isProduction,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
  });
}

export function verifyNotificationSignature({ orderId, statusCode, grossAmount, signatureKey }) {
  const expected = crypto
    .createHash("sha512")
    .update(`${orderId}${statusCode}${grossAmount}${process.env.MIDTRANS_SERVER_KEY}`)
    .digest("hex");
  return expected === signatureKey;
}

// One order can be paid in up to two transactions (DP then pelunasan). Given
// the order's current state, this decides what the next payment should be
// for, or null if it's already fully paid.
export function determinePaymentIntent(order) {
  const total = Number(order.total_amount);
  const paid = Number(order.amount_paid);
  const remaining = Math.round((total - paid) * 100) / 100;

  if (remaining <= 0) return null;

  if (order.payment_scheme === "full") {
    return { purpose: "full", amount: total };
  }

  const dpAmount = Math.round((total * order.dp_percent) / 100);
  if (paid <= 0) {
    return { purpose: "dp", amount: dpAmount };
  }

  return { purpose: "pelunasan", amount: remaining };
}
