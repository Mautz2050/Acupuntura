# Configurar el pago online con MercadoPago

El sitio tiene integrado el boton "Pagar con MercadoPago" en el formulario de reservas.
Para que funcione necesitas 3 cosas: una cuenta de vendedor en MP, configurar los secrets
en Supabase y desplegar dos Edge Functions.

## 1. Obtener tu Access Token de MercadoPago

1. Crea una cuenta en https://www.mercadopago.cl (si no tienes una).
2. Ve a https://www.mercadopago.cl/developers/panel
3. En "Mis credenciales" copia tu **Access Token** de PRUEBAS primero (empieza con TEST-)
4. Cuando quieras cobrar en produccion, usa el Access Token de PRODUCCION.

## 2. Configurar los secrets en Supabase

Instala Supabase CLI y linka tu proyecto:

```bash
supabase login
supabase link --project-ref TU_REF
```

Luego configura los secrets:

```bash
supabase secrets set MP_ACCESS_TOKEN=TEST-tu-access-token-aqui
supabase secrets set SITE_URL=https://www.medpuntos.cl
```

En produccion cambia MP_ACCESS_TOKEN por el token de produccion.

## 3. Desplegar las Edge Functions

```bash
supabase functions deploy mp-create --no-verify-jwt
supabase functions deploy mp-webhook --no-verify-jwt
```

La funcion mp-webhook quedara disponible en:
https://TU_PROYECTO.supabase.co/functions/v1/mp-webhook

MercadoPago llamara automaticamente a esa URL cuando se confirme un pago.

## 4. Probar el flujo completo

1. Corre el sitio (npm run dev), agenda una cita de prueba.
2. Haz clic en "Pagar con MercadoPago".
3. Seras redirigido al Checkout Pro de MP (con tarjeta de prueba de MP).
4. Tarjetas de prueba disponibles en: https://www.mercadopago.cl/developers/es/docs/your-integrations/test/cards
5. Despues del pago volveras a /pago/retorno con el estado del pago.
6. En el panel admin (/admin/citas) esa cita debe verse con pago_estado = pagado.

## Notas

- El monto cobrado es el definido en SERVICIOS (src/lib/supabase.js), no editable por el navegador.
- Si el paciente cierra la ventana sin pagar, su cita queda reservada con pago_estado = pendiente.
- Puede pagar en el lugar sin problema.
- MercadoPago soporta: tarjetas de credito, debito, transferencias y pagos en efectivo (cupon).
