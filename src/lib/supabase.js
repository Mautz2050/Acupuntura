import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('⚠️ Variables de entorno de Supabase no configuradas. Crea un archivo .env con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: window.sessionStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});


// Servicios clínicos con precios en pesos chilenos (CLP)
// Precios reales de la lista de precios de MedPuntos (Santo Domingo 1160, Of. 304)
export const SERVICIOS = [
  { id: 'rejuvenecimiento-facial', nombre: 'Rejuvenecimiento Facial Coreano', duracion: 60, precio: 35000, desc: 'Evaluación MTC completa + puntos de rostro y cuerpo para un rejuvenecimiento facial estilo coreano.' },
  { id: 'acupuntura-general', nombre: 'Acupuntura General', duracion: 60, precio: 30000, desc: 'Sesión individual $30.000. Primera consulta con diagnóstico completo y tratamiento de acupuntura.' },
  { id: 'ventosaterapia', nombre: 'Ventosaterapia', duracion: 45, precio: 15000, desc: 'Succión terapéutica para aliviar tensiones profundas y activar la circulación. Sesión individual $15.000.' },
  { id: 'ciclos', nombre: 'Tratamiento por Ciclos', duracion: 60, precio: 30000, desc: 'Sesión individual $30.000 · 1/2 ciclo (4 sesiones) $105.000 · 1 ciclo completo (8 sesiones) $180.000. Consulta por el tratamiento más adecuado para tu caso.' },
];

// Paquetes y ciclos de sesiones con precio preferencial
export const PAQUETES = [
  { nombre: 'Rejuvenecimiento Facial Coreano', detalle: 'Ciclo recomendado × 8 sesiones', precio: 280000 },
  { nombre: 'Acupuntura General', detalle: 'Paquete × 4 sesiones', precio: 105000 },
  { nombre: 'Acupuntura General', detalle: 'Paquete × 8 sesiones', precio: 185000 },
  { nombre: 'Tratamiento de Edemas', detalle: 'Ciclo × 8 sesiones', precio: 215000 },
  { nombre: 'Problemas Digestivos y Alergias', detalle: 'Ciclo × 6 sesiones', precio: 160000 },
];

export const CONTACTO = {
  direccion: 'Santo Domingo 1160, Oficina 304 — Metro Plaza de Armas, Santiago',
  horario: 'Lunes a Viernes: 9:30 - 13:00 hrs',
  telefono: '+56 9 5399 4471',
  telefonoWhatsapp: '56953994471',
};

export function formatCLP(amount) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(amount || 0);
}

export function formatFecha(fecha) {
  if (!fecha) return '--';
  return new Date(fecha + 'T00:00:00').toLocaleDateString('es-CL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatHora(hora) {
  if (!hora) return '--';
  return hora.slice(0, 5) + ' hrs';
}

export function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return '--';
  const hoy = new Date();
  const nac = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
  return edad;
}
