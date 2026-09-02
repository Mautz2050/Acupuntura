// Supabase Edge Function: flow-create
//
// Recibe los datos de una cita YA creada en la tabla "citas" y genera la orden de
// pago correspondiente en Flow, devolviendo la URL a la que hay que redirigir al
// paciente para que pague.
//
// Se ejecuta en el servidor (Deno) para no exponer el secretKey de Flow en el navegador.
//
// Variables de entorno requeridas (configurar con `supabase secrets set`):
//   FLOW_API_KEY       -> API Key de tu cuenta de comercio en Flow
//   FLOW_SECRET_KEY    -> Secret Key de tu cuenta de comercio en Flow
//   FLOW_BASE_URL      -> https://sandbox.flow.cl/api  (pruebas) o https://www.flow.cl/api (producción)
//   SITE_URL           -> URL pública de tu sitio, ej: https://www.medpuntos.cl
//   SUPABASE_URL        -> (ya viene seteada automáticamente por Supabase)

import { flowRequest } from '../_shared/flow.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { citaId, monto, email, servicio, nombre } = await req.json();

    if (!citaId || !monto || !email) {
      return new Response(JSON.stringify({ error: 'Faltan datos: citaId, monto y email son obligatorios.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const FLOW_API_KEY = Deno.env.get('FLOW_API_KEY');
    const FLOW_SECRET_KEY = Deno.env.get('FLOW_SECRET_KEY');
    const FLOW_BASE_URL = Deno.env.get('FLOW_BASE_URL') ?? 'https://sandbox.flow.cl/api';
    const SITE_URL = Deno.env.get('SITE_URL');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');

    if (!FLOW_API_KEY || !FLOW_SECRET_KEY || !SITE_URL || !SUPABASE_URL) {
      throw new Error('Faltan variables de entorno de Flow/Supabase por configurar (ver comentarios del archivo).');
    }

    const params = {
      apiKey: FLOW_API_KEY,
      commerceOrder: citaId,
      subject: `Reserva ${servicio || 'Sesión'} - MedPuntos${nombre ? ' - ' + nombre : ''}`.slice(0, 100),
      currency: 'CLP',
      amount: Math.round(Number(monto)),
      email,
      urlConfirmation: `${SUPABASE_URL}/functions/v1/flow-confirm`,
      urlReturn: `${SITE_URL}/pago/retorno?order=${citaId}`,
    };

    const flowResponse = await flowRequest(FLOW_BASE_URL, '/payment/create', params, FLOW_SECRET_KEY, 'POST');

    // Guardamos el token/orden de Flow en la cita para poder conciliar después.
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabaseAdmin = createClient(SUPABASE_URL, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    await supabaseAdmin
      .from('citas')
      .update({ flow_token: flowResponse.token, flow_order: flowResponse.flowOrder })
      .eq('id', citaId);

    return new Response(
      JSON.stringify({ redirectUrl: `${flowResponse.url}?token=${flowResponse.token}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
