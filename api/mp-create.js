export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { citaId, monto, email, servicio, nombre } = req.body;
    if (!citaId || !monto || !email) {
      return res.status(400).json({ error: "Faltan datos: citaId, monto, email" });
    }

    const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
    const SITE_URL = process.env.SITE_URL || "https://acupuntura-kz1mon9b8-mautz.vercel.app";

    if (!MP_ACCESS_TOKEN) {
      return res.status(500).json({ error: "MP_ACCESS_TOKEN no configurado en Vercel" });
    }

    const preferencia = {
      items: [
        {
          id: citaId,
          title: servicio || "Sesion de Acupuntura - MedPuntos",
          quantity: 1,
          unit_price: Number(monto),
          currency_id: "CLP",
        },
      ],
      payer: { name: nombre || "", email: email },
      external_reference: citaId,
      back_urls: {
        success: SITE_URL + "/pago/retorno?order=" + citaId + "&status=success",
        failure: SITE_URL + "/pago/retorno?order=" + citaId + "&status=failure",
        pending: SITE_URL + "/pago/retorno?order=" + citaId + "&status=pending",
      },
      auto_return: "approved",
      notification_url: SITE_URL + "/api/mp-webhook",
      statement_descriptor: "MEDPUNTOS",
    };

    const mpRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + MP_ACCESS_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preferencia),
    });

    if (!mpRes.ok) {
      const errText = await mpRes.text();
      throw new Error("MercadoPago error " + mpRes.status + ": " + errText);
    }

    const mpData = await mpRes.json();

    return res.status(200).json({
      redirectUrl: mpData.init_point,
      sandboxUrl: mpData.sandbox_init_point,
      preferenceId: mpData.id,
    });
  } catch (err) {
    console.error("mp-create error:", err);
    return res.status(500).json({ error: err.message });
  }
}
