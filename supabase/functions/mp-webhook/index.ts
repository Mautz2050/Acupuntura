import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { type, data } = body;

    // MercadoPago envía type="payment" cuando se confirma un pago
    if (type !== "payment" || !data?.id) {
      return new Response(JSON.stringify({ ok: true, skipped: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const MP_ACCESS_TOKEN = Deno.env.get("MP_ACCESS_TOKEN");
    if (!MP_ACCESS_TOKEN) throw new Error("MP_ACCESS_TOKEN no configurado");

    // Consultar el pago a la API de MercadoPago
    const pagoRes = await fetch("https://api.mercadopago.com/v1/payments/" + data.id, {
      headers: { Authorization: "Bearer " + MP_ACCESS_TOKEN },
    });

    if (!pagoRes.ok) throw new Error("No se pudo obtener el pago de MP: " + pagoRes.status);

    const pago = await pagoRes.json();
    const citaId = pago.external_reference;
    const mpStatus = pago.status; // approved | pending | rejected | cancelled

    if (!citaId) {
      return new Response(JSON.stringify({ ok: true, msg: "Sin external_reference" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Mapear estado de MP a nuestro esquema
    let pagoEstado = "pendiente";
    let estado = "pendiente";

    if (mpStatus === "approved") {
      pagoEstado = "pagado";
      estado = "confirmada";
    } else if (mpStatus === "rejected" || mpStatus === "cancelled") {
      pagoEstado = "rechazado";
    }

    // Actualizar la cita en Supabase
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { error } = await supabase
      .from("citas")
      .update({
        pago_estado: pagoEstado,
        estado: estado,
      })
      .eq("id", citaId);

    if (error) throw error;

    return new Response(JSON.stringify({ ok: true, citaId, pagoEstado }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("mp-webhook error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
