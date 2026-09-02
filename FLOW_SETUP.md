# Configurar el pago online con Flow

El sitio ya tiene integrado el botón "Pagar seña ahora" en el formulario de reservas
(`BookingSection.jsx`). Para que funcione en tu Supabase real, hay que hacer 3 cosas:
crear una cuenta en Flow, aplicar el script SQL, y desplegar dos Edge Functions.

## 1. Crea tu cuenta de comercio en Flow

1. Regístrate en https://www.flow.cl (o primero en el ambiente de pruebas https://sandbox.flow.cl
   para probar sin dinero real).
2. En **Desarrolladores > Llaves API** copia tu `API Key` y `Secret Key`.
3. Guarda ambos valores, los vas a necesitar en el paso 3.

## 2. Aplica el script SQL actualizado

Vuelve a ejecutar `database/schema.sql` completo en **Supabase Dashboard > SQL Editor**
(es seguro correrlo de nuevo, no duplica nada). Esto agrega:
- Las columnas `flow_token` y `flow_order` a la tabla `citas`.
- La función `get_estado_pago_cita`, que le permite a la página de retorno del pago
  consultar el estado de una cita puntual sin abrir toda la tabla a lectura pública.

## 3. Despliega las Edge Functions

Necesitas tener instalado el [Supabase CLI](https://supabase.com/docs/guides/cli) y estar
logueado (`supabase login`) y enlazado a tu proyecto (`supabase link --project-ref TU_REF`).

```bash
# Configurar los secretos (nunca van en el .env del frontend, quedan solo en el servidor)
supabase secrets set FLOW_API_KEY=tu_api_key
supabase secrets set FLOW_SECRET_KEY=tu_secret_key
supabase secrets set FLOW_BASE_URL=https://sandbox.flow.cl/api   # cambia a https://www.flow.cl/api cuando pases a producción
supabase secrets set SITE_URL=https://www.medpuntos.cl           # la URL pública real de tu sitio

# Desplegar las dos funciones (sin verificación de JWT: Flow no manda un token de Supabase)
supabase functions deploy flow-create --no-verify-jwt
supabase functions deploy flow-confirm --no-verify-jwt
```

Con esto, `flow-confirm` queda disponible en:
`https://TU_PROYECTO.supabase.co/functions/v1/flow-confirm`

Flow llama automáticamente a esa URL para avisar cuando un pago se confirma —
`flow-create` se la pasa como `urlConfirmation` en cada orden que crea, así que no hay
que configurarla manualmente en el panel de Flow.

## 4. Prueba el flujo completo

1. Corre el sitio (`npm run dev`), agenda una cita de prueba.
2. Haz clic en "Pagar seña ahora" — te va a redirigir a Flow (sandbox si usaste esa URL).
3. Paga con una tarjeta de prueba (Flow las publica en su documentación de sandbox).
4. Deberías volver a `/pago/retorno` en tu sitio con el estado "¡Pago confirmado!".
5. En el panel admin (`/admin/citas`), esa cita debe verse con `pago_estado = pagado` y
   `estado = confirmada`.

## Notas

- El monto que se cobra es siempre el `precio` definido en `SERVICIOS`
  (`src/lib/supabase.js`), no algo que el navegador pueda modificar.
- Si el paciente cierra la ventana de pago sin terminar, su cita queda igual reservada
  con `pago_estado = pendiente`; puede pagar en el lugar sin problema.
- Cuando quieras cobrar en serio (no pruebas), cambia `FLOW_BASE_URL` a
  `https://www.flow.cl/api` y usa las llaves de tu cuenta de comercio en producción
  (no las de sandbox).
