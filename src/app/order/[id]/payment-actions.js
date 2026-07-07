"use server";

import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { determinePaymentIntent, getSnapClient, isMidtransConfigured } from "@/lib/midtrans";

const initialError = { error: null, token: null };

export async function createPaymentAction(orderId, _prevState, _formData) {
  if (!isMidtransConfigured()) {
    return { ...initialError, error: "Pembayaran online belum dikonfigurasi. Hubungi admin." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ...initialError, error: "Sesi kamu berakhir, silakan masuk lagi." };
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, order_number, customer_id, total_amount, amount_paid, payment_scheme, dp_percent")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    return { ...initialError, error: "Order tidak ditemukan." };
  }

  if (order.customer_id !== user.id) {
    return { ...initialError, error: "Kamu tidak punya akses ke order ini." };
  }

  const intent = determinePaymentIntent(order);
  if (!intent) {
    return { ...initialError, error: "Order ini sudah lunas." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone")
    .eq("id", user.id)
    .single();

  const midtransOrderId = `${order.order_number}-${intent.purpose.toUpperCase()}-${Date.now()}`;
  const grossAmount = Math.round(intent.amount);

  const serviceClient = createServiceRoleClient();
  const { data: payment, error: insertError } = await serviceClient
    .from("payments")
    .insert({
      order_id: order.id,
      purpose: intent.purpose,
      amount: grossAmount,
      midtrans_order_id: midtransOrderId,
      status: "pending",
    })
    .select("id")
    .single();

  if (insertError || !payment) {
    return { ...initialError, error: "Gagal membuat transaksi pembayaran." };
  }

  try {
    const snap = getSnapClient();
    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: midtransOrderId,
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: profile?.full_name || user.email,
        email: user.email,
        phone: profile?.phone || undefined,
      },
    });

    await serviceClient
      .from("payments")
      .update({ snap_token: transaction.token })
      .eq("id", payment.id);

    return { error: null, token: transaction.token };
  } catch {
    await serviceClient.from("payments").update({ status: "failure" }).eq("id", payment.id);
    return { ...initialError, error: "Gagal menghubungi Midtrans, coba lagi." };
  }
}
