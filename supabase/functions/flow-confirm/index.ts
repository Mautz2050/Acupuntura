// Supabase Edge Function: flow-confirm
//
// Esta es la urlConfirmation que Flow llama por su cuenta (servidor a servidor) cuando
// el estado de un pago cambia. Flow SOLO envía un "token" por POST; nunca hay que confiar
// en el estado que venga en el request, siempre hay que volver a preguntarle a Flow por
// getStatus con ese token para confirmar el resultado real.
//
// Debe responder 200 OK rápido o Flow reintentará la notificación.
//
// Configurar esta URL como "urlConfirmation" -> se arma automáticamente en flow-create como:
//   https://<tu-proyecto>.supabase.co/functions/v1/flow-confirm
//
// Desplegar SIN verificación de JWT (Flow no manda un JWT de Supabase):
//   supabase functions deploy flow-confirm --no-verify-jwt

import { flowRequest, FLOW_STATUS } from '../_shared/flow.ts';

Deno.serve(async (req: Request) => {
  try {
    const form = await req.formData();
    const token = form.get('token');

    if (!token || typeof token !== 'string') {
      return new Response('Falta token', { status: 400 });
    }

    const FLOW_API_KEY = Deno.env.get('FLOW_API_KEY')!;
    const FLOW_SECRET_KEY = Deno.env.get('FLOW_SECRET_KEY')!;
    const FLOW_BASE_URL = Deno.env.get('FLOW_BASE_URL') ?? 'https://sandbox.flow.cl/api';
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const status = await flowRequest(
      FLOW_BASE_URL,
      '/payment/getStatus',
      { apiKey: FLOW_API_KEY, token },
      FLOW_SECRET_KEY,
      'GET'
    );

    const citaId = status.commerceOrder;

    let pagoEstado = 'pendiente';
    let estado: string | null = null;
    if (status.status === FLOW_STATUS.PAGADA) {
      pagoEstado = 'pagado';
      estado = 'confirmada';
    } else if (status.status === FLOW_STATUS.RECHAZADA) {
      pagoEstado = 'rechazado';
    } else if (status.status === FLOW_STATUS.ANULADA) {
      pagoEstado = 'anulado';
    }

    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const updatePayload: Record<string, string> = { pago_estado: pagoEstado };
    if (estado) updatePayload.estado = estado;

    await supabaseAdmin.from('citas').update(updatePayload).eq('id', citaId);

    // Flow espera un 200 OK simple, sin cuerpo específico.
    return new Response('OK', { status: 200 });
  } catch (err) {
    console.error('Error en flow-confirm:', err);
    // Respondemos 500 a propósito: así Flow reintenta la notificación más tarde en vez de
    // darla por procesada. El detalle del error queda en los logs de la función.
    return new Response('Error interno', { status: 500 });
  }
});
