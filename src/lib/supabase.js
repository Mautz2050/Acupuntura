import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('⚠️ Variables de entorno de Supabase no configuradas. Crea un archivo .env con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Servicios clínicos con precios en pesos chilenos (CLP)
export const SERVICIOS = [
  { id: 'acupuntura-general', nombre: 'Acupuntura General', duracion: 60, precio: 45000, desc: 'Inserción indolora de agujas filiformes para regular el Qi y tratar patologías sistémicas.' },
  { id: 'moxibustion', nombre: 'Moxibustión', duracion: 60, precio: 38000, desc: 'Terapia de calor mediante la quema de Artemisa para tonificar y dispersar frío.' },
  { id: 'cupping', nombre: 'Cupping (Ventosas)', duracion: 60, precio: 42000, desc: 'Succión terapéutica para aliviar tensiones profundas y activar la circulación.' },
  { id: 'gestion-dolor', nombre: 'Gestión del Dolor', duracion: 60, precio: 50000, desc: 'Protocolos específicos para ciática, lumbago, migraña y dolores articulares.' },
  { id: 'fertilidad', nombre: 'Fertilidad & Salud Femenina', duracion: 90, precio: 60000, desc: 'Acompañamiento en fertilidad natural, regulación de ciclos y bienestar hormonal.' },
  { id: 'estres-sueno', nombre: 'Estrés, Ansiedad y Sueño', duracion: 60, precio: 42000, desc: 'Técnicas de relajación profunda para regular el sistema nervioso y tratar el insomnio.' },
  { id: 'consulta-inicial', nombre: 'Evaluación y Diagnóstico TCM', duracion: 90, precio: 55000, desc: 'Examen completo de lengua, pulso y diseño de plan terapéutico inicial.' },
];

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
