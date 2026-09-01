import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('⚠️ Variables de entorno de Supabase no configuradas. Crea un archivo .env con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Servicios clínicos con precios en pesos chilenos (CLP)
// Precios reales de la lista de precios de MedPuntos (Santo Domingo 1160, Of. 304)
export const SERVICIOS = [
  { id: 'rejuvenecimiento-facial', nombre: 'Rejuvenecimiento Facial Coreano', duracion: 60, precio: 35000, desc: 'Evaluación MTC completa + puntos de rostro y cuerpo para un rejuvenecimiento facial estilo coreano.' },
  { id: 'acupuntura-general', nombre: 'Acupuntura General', duracion: 60, precio: 32000, desc: 'Primera consulta con diagnóstico y tratamiento de acupuntura. Sesiones sucesivas o controles: $29.000.' },
  { id: 'moxibustion', nombre: 'Moxibustión', duracion: 45, precio: 16000, desc: 'Moxibustión / moxa con sal en el ombligo para tonificar y dispersar frío.' },
  { id: 'ventosa-tuina', nombre: 'Ventosa / Masaje Tui Na', duracion: 45, precio: 22000, desc: 'Succión terapéutica y masaje Tui Na para aliviar tensiones profundas y activar la circulación.' },
  { id: 'auriculoterapia', nombre: 'Auriculoterapia', duracion: 30, precio: 11000, desc: 'Auriculoterapia con semillas o parches para tratamientos puntuales y de apoyo.' },
  { id: 'edemas', nombre: 'Tratamiento de Edemas', duracion: 60, precio: 32000, desc: 'Tratamiento de edemas y retención de líquidos. Disponible en ciclo de 8 sesiones.' },
  { id: 'digestivo', nombre: 'Problemas Digestivos y Alergias', duracion: 60, precio: 30000, desc: 'Tratamiento de problemas digestivos, estomacales y alergias. Disponible en ciclo de 6 sesiones.' },
];

// Paquetes y ciclos de sesiones con precio preferencial
export const PAQUETES = [
  { nombre: 'Rejuvenecimiento Facial Coreano', detalle: 'Ciclo recomendado × 8 sesiones', precio: 250000, ahorro: 30000 },
  { nombre: 'Acupuntura General', detalle: 'Paquete × 4 sesiones', precio: 105000 },
  { nombre: 'Acupuntura General', detalle: 'Paquete × 8 sesiones', precio: 185000 },
  { nombre: 'Tratamiento de Edemas', detalle: 'Ciclo × 8 sesiones', precio: 230000 },
  { nombre: 'Problemas Digestivos y Alergias', detalle: 'Ciclo × 6 sesiones', precio: 160000 },
];

export const CONTACTO = {
  direccion: 'Santo Domingo 1160, Oficina 304 — Metro Plaza de Armas, Santiago',
  horario: 'Lunes a Viernes: 9:30 - 13:00 hrs',
  telefono: '+56 9 8465 9786',
  telefonoWhatsapp: '56984659786',
  acupunctora: 'Acupuntora Soledad Menares',
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
