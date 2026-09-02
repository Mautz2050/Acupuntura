// Helper compartido para integrarse con la API de Flow (https://www.flow.cl/docs/api.html)
//
// Flow firma cada request concatenando "clave"+"valor" de TODOS los parámetros
// (menos la propia firma "s"), ordenados alfabéticamente por nombre de parámetro,
// y calculando un HMAC-SHA256 de ese string usando el secretKey de la cuenta de comercio.

export interface FlowParams {
  [key: string]: string | number;
}

async function hmacSha256Hex(secretKey: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(secretKey),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function signFlowParams(params: FlowParams, secretKey: string): Promise<string> {
  const orderedKeys = Object.keys(params).sort();
  const toSign = orderedKeys.map((k) => `${k}${params[k]}`).join('');
  return hmacSha256Hex(secretKey, toSign);
}

export async function flowRequest(
  baseUrl: string,
  path: string,
  params: FlowParams,
  secretKey: string,
  method: 'GET' | 'POST' = 'POST'
) {
  const s = await signFlowParams(params, secretKey);
  const fullParams = { ...params, s };

  let response: Response;
  if (method === 'GET') {
    const qs = new URLSearchParams(fullParams as Record<string, string>).toString();
    response = await fetch(`${baseUrl}${path}?${qs}`, { method: 'GET' });
  } else {
    const body = new URLSearchParams(fullParams as Record<string, string>);
    response = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
  }

  const json = await response.json();
  if (!response.ok || json.code) {
    // Flow responde errores como { code, message }
    throw new Error(json.message || `Error Flow (${response.status})`);
  }
  return json;
}

export const FLOW_STATUS = {
  PENDIENTE: 1,
  PAGADA: 2,
  RECHAZADA: 3,
  ANULADA: 4,
};
