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
    const { citaId, monto, email, servicio, nombre } = await req.json();

    if (!citaId || !monto || !email) {
      return new Response(
        JSON.stringify({ error: "Faltan datos obligatorios: citaId, monto, email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const MP_ACCESS_TOKEN = Deno.env.get("MP_ACCESS_TOKEN");
    const SITE_URL = Deno.env.get("SITE_URL") ?? "http://localhost:5173";

    if (!MP_ACCESS_TOKEN) {
      return new Response(
        JSON.stringify({ error: "MP_ACCESS_TOKEN no configurado en secrets de Supabase" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const preferencia = {
      items: [
        {
          id: citaId,
          title: servicio ?? "Sesion de Acupuntura - MedPuntos",
          quantity: 1,
          unit_price: Number(monto),
          currency_id: "CLP",
        },
      ],
      payer: {
        name: nombre ?? "",
        email: email,
      },
      external_reference: citaId,
      back_urls: {
        success: SITE_URL + "/pago/retorno?order=" + citaId + "&status=success",
        failure: SITE_URL + "/pago/retorno?order=" + citaId + "&status=failure",
        pending: SITE_URL + "/pago/retorno?order=" + citaId + "&status=pending",
      },
      auto_return: "approved",
      notification_url: Deno.env.get("SUPABASE_URL") + "/functions/v1/mp-webhook",
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
      const err = await mpRes.text();
      throw new Error("MercadoPago error " + mpRes.status + ": " + err);
    }

    const mpData = await mpRes.json();

    return new Response(
      JSON.stringify({
        redirectUrl: mpData.init_point,
        sandboxUrl: mpData.sandbox_init_point,
        preferenceId: mpData.id,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("mp-create error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
