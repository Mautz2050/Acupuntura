import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const { type, data } = req.body || {};

    if (type !== "payment" || !data?.id) {
      return res.status(200).json({ ok: true, skipped: true });
    }

    const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
    if (!MP_ACCESS_TOKEN) throw new Error("MP_ACCESS_TOKEN no configurado");

    const pagoRes = await fetch("https://api.mercadopago.com/v1/payments/" + data.id, {
      headers: { Authorization: "Bearer " + MP_ACCESS_TOKEN },
    });

    if (!pagoRes.ok) throw new Error("No se pudo obtener el pago: " + pagoRes.status);

    const pago = await pagoRes.json();
    const citaId = pago.external_reference;
    const mpStatus = pago.status;

    if (!citaId) return res.status(200).json({ ok: true, msg: "Sin external_reference" });

    let pagoEstado = "pendiente";
    let estado = "pendiente";
    if (mpStatus === "approved") {
      pagoEstado = "pagado";
      estado = "confirmada";
    } else if (mpStatus === "rejected" || mpStatus === "cancelled") {
      pagoEstado = "rechazado";
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { error } = await supabase
      .from("citas")
      .update({ pago_estado: pagoEstado, estado: estado })
      .eq("id", citaId);

    if (error) throw error;

    return res.status(200).json({ ok: true, citaId, pagoEstado });
  } catch (err) {
    console.error("mp-webhook error:", err);
    return res.status(500).json({ error: err.message });
  }
}
