import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { verifyNotificationSignature } from "@/lib/midtrans";

function mapTransactionStatus(body) {
  const { transaction_status: status, fraud_status: fraudStatus } = body;

  if (status === "capture") {
    return fraudStatus === "accept" ? "capture" : "pending";
  }
  if (status === "settlement") return "settlement";
  if (["pending", "deny", "cancel", "expire", "failure"].includes(status)) return status;
  return "pending";
}

const SETTLED_STATUSES = new Set(["settlement", "capture"]);

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { order_id: midtransOrderId, status_code: statusCode, gross_amount: grossAmount, signature_key: signatureKey } = body;

  if (!midtransOrderId || !statusCode || !grossAmount || !signatureKey) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const validSignature = verifyNotificationSignature({
    orderId: midtransOrderId,
    statusCode,
    grossAmount,
    signatureKey,
  });

  if (!validSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const supabase = createServiceRoleClient();

  const { data: payment } = await supabase
    .from("payments")
    .select("id, order_id, amount, status")
    .eq("midtrans_order_id", midtransOrderId)
    .single();

  if (!payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  const newStatus = mapTransactionStatus(body);
  const wasAlreadySettled = SETTLED_STATUSES.has(payment.status);
  const isNowSettled = SETTLED_STATUSES.has(newStatus);

  await supabase
    .from("payments")
    .update({
      status: newStatus,
      payment_type: body.payment_type || null,
      raw_notification: body,
      paid_at: isNowSettled ? new Date().toISOString() : null,
    })
    .eq("id", payment.id);

  // Only move money/status once per payment — Midtrans may re-send the same
  // notification, and this guards against double-counting amount_paid.
  if (isNowSettled && !wasAlreadySettled) {
    const { data: order } = await supabase
      .from("orders")
      .select("id, status, amount_paid")
      .eq("id", payment.order_id)
      .single();

    if (order) {
      await supabase
        .from("orders")
        .update({
          amount_paid: Number(order.amount_paid) + Number(payment.amount),
          status: order.status === "awaiting_payment" ? "processing" : order.status,
        })
        .eq("id", order.id);
    }
  }

  return NextResponse.json({ received: true });
}
