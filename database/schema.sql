-- =============================================
-- SISTEMA CLÍNICO MEDPUNTOS - SUPABASE SCHEMA
-- Ejecutar este script completo en:
-- Supabase Dashboard > SQL Editor > New Query
-- Este script es seguro de ejecutar más de una vez.
-- =============================================

-- 1. TABLA PACIENTES
CREATE TABLE IF NOT EXISTS pacientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  rut TEXT,
  email TEXT,
  telefono TEXT,
  fecha_nacimiento DATE,
  sexo TEXT,
  direccion TEXT,
  ciudad TEXT,
  prevision TEXT,
  contacto_emergencia TEXT,
  telefono_emergencia TEXT,
  alergias TEXT,
  antecedentes TEXT,
  notas_generales TEXT,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABLA CITAS
CREATE TABLE IF NOT EXISTS citas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id UUID REFERENCES pacientes(id) ON DELETE SET NULL,
  nombre TEXT NOT NULL,
  email TEXT,
  telefono TEXT,
  servicio TEXT NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  duracion INTEGER DEFAULT 60,
  estado TEXT DEFAULT 'pendiente',
  notas TEXT,
  monto INTEGER DEFAULT 0,
  pago_estado TEXT DEFAULT 'pendiente',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLA CONSULTAS (Fichas de cada sesión)
CREATE TABLE IF NOT EXISTS consultas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  cita_id UUID REFERENCES citas(id) ON DELETE SET NULL,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  motivo TEXT,
  anamnesis TEXT,
  diagnostico_tcm TEXT,
  diagnostico_occidental TEXT,
  puntos_acupuntura TEXT,
  tecnicas_utilizadas TEXT,
  tratamiento TEXT,
  evoluciones TEXT,
  notas TEXT,
  proxima_cita TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLA ARCHIVOS (Imágenes/documentos adjuntos)
CREATE TABLE IF NOT EXISTS archivos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  consulta_id UUID REFERENCES consultas(id) ON DELETE CASCADE,
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  url TEXT NOT NULL,
  tipo TEXT DEFAULT 'imagen',
  tamano INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLA RECETAS Y TRATAMIENTOS
CREATE TABLE IF NOT EXISTS recetas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  consulta_id UUID NOT NULL REFERENCES consultas(id) ON DELETE CASCADE,
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  tipo TEXT DEFAULT 'receta',
  descripcion TEXT NOT NULL,
  duracion TEXT,
  dosis TEXT,
  instrucciones TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABLA DISPONIBILIDAD (Horario semanal)
CREATE TABLE IF NOT EXISTS disponibilidad (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dia_semana INTEGER NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  duracion_sesion INTEGER DEFAULT 60,
  activo BOOLEAN DEFAULT TRUE
);

-- 7. TABLA FECHAS BLOQUEADAS
CREATE TABLE IF NOT EXISTS fechas_bloqueadas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fecha DATE NOT NULL UNIQUE,
  motivo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE citas ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultas ENABLE ROW LEVEL SECURITY;
ALTER TABLE archivos ENABLE ROW LEVEL SECURITY;
ALTER TABLE recetas ENABLE ROW LEVEL SECURITY;
ALTER TABLE disponibilidad ENABLE ROW LEVEL SECURITY;
ALTER TABLE fechas_bloqueadas ENABLE ROW LEVEL SECURITY;

-- Pacientes: solo admin autenticado
DROP POLICY IF EXISTS "admin_pacientes" ON pacientes;
CREATE POLICY "admin_pacientes" ON pacientes FOR ALL USING (auth.role() = 'authenticated');

-- Citas: cualquiera puede insertar (para reservas online), solo admin puede leer/modificar
DROP POLICY IF EXISTS "public_insert_citas" ON citas;
CREATE POLICY "public_insert_citas" ON citas FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "admin_select_citas" ON citas;
CREATE POLICY "admin_select_citas" ON citas FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "admin_update_citas" ON citas;
CREATE POLICY "admin_update_citas" ON citas FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "admin_delete_citas" ON citas;
CREATE POLICY "admin_delete_citas" ON citas FOR DELETE USING (auth.role() = 'authenticated');

-- Consultas: solo admin
DROP POLICY IF EXISTS "admin_consultas" ON consultas;
CREATE POLICY "admin_consultas" ON consultas FOR ALL USING (auth.role() = 'authenticated');

-- Archivos: solo admin
DROP POLICY IF EXISTS "admin_archivos" ON archivos;
CREATE POLICY "admin_archivos" ON archivos FOR ALL USING (auth.role() = 'authenticated');

-- Recetas: solo admin
DROP POLICY IF EXISTS "admin_recetas" ON recetas;
CREATE POLICY "admin_recetas" ON recetas FOR ALL USING (auth.role() = 'authenticated');

-- Disponibilidad: cualquiera puede leer (para el formulario de reservas)
DROP POLICY IF EXISTS "public_read_disponibilidad" ON disponibilidad;
CREATE POLICY "public_read_disponibilidad" ON disponibilidad FOR SELECT USING (true);

DROP POLICY IF EXISTS "admin_manage_disponibilidad" ON disponibilidad;
CREATE POLICY "admin_manage_disponibilidad" ON disponibilidad FOR ALL USING (auth.role() = 'authenticated');

-- Fechas bloqueadas: cualquiera puede leer
DROP POLICY IF EXISTS "public_read_fechas_bloqueadas" ON fechas_bloqueadas;
CREATE POLICY "public_read_fechas_bloqueadas" ON fechas_bloqueadas FOR SELECT USING (true);

DROP POLICY IF EXISTS "admin_manage_fechas_bloqueadas" ON fechas_bloqueadas;
CREATE POLICY "admin_manage_fechas_bloqueadas" ON fechas_bloqueadas FOR ALL USING (auth.role() = 'authenticated');

-- =============================================
-- DATOS INICIALES
-- =============================================

-- Horario default: Lunes a Viernes 09:00-18:00 (sesiones de 60 min)
-- Solo se inserta si la tabla está vacía, para no duplicar filas al re-ejecutar el script.
INSERT INTO disponibilidad (dia_semana, hora_inicio, hora_fin, duracion_sesion, activo)
SELECT * FROM (VALUES
  (1, '09:00'::TIME, '18:00'::TIME, 60, TRUE),
  (2, '09:00'::TIME, '18:00'::TIME, 60, TRUE),
  (3, '09:00'::TIME, '18:00'::TIME, 60, TRUE),
  (4, '09:00'::TIME, '18:00'::TIME, 60, TRUE),
  (5, '09:00'::TIME, '18:00'::TIME, 60, TRUE)
) AS v(dia_semana, hora_inicio, hora_fin, duracion_sesion, activo)
WHERE NOT EXISTS (SELECT 1 FROM disponibilidad);

-- =============================================
-- PAGOS ONLINE CON FLOW
-- =============================================

-- Guarda el número de orden / token entregado por Flow para poder conciliar el pago.
ALTER TABLE citas ADD COLUMN IF NOT EXISTS flow_token TEXT;
ALTER TABLE citas ADD COLUMN IF NOT EXISTS flow_order INTEGER;

-- La tabla "citas" solo puede ser leída por administradores autenticados (ver política
-- admin_select_citas más arriba), por lo que el cliente anónimo que reserva online no puede
-- consultar el estado de su propio pago directamente. Esta función expone, de forma segura,
-- únicamente los campos no sensibles de UNA cita puntual (identificada por su UUID, que no es
-- adivinable), sin abrir la tabla completa a lectura pública.
CREATE OR REPLACE FUNCTION public.get_estado_pago_cita(p_id UUID)
RETURNS TABLE(id UUID, servicio TEXT, fecha DATE, hora TIME, monto INTEGER, pago_estado TEXT, estado TEXT)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, servicio, fecha, hora, monto, pago_estado, estado
  FROM citas
  WHERE id = p_id;
$$;

GRANT EXECUTE ON FUNCTION public.get_estado_pago_cita(UUID) TO anon, authenticated;

-- =============================================
-- STORAGE BUCKET para imágenes clínicas
-- =============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('clinica-archivos', 'clinica-archivos', false)
ON CONFLICT DO NOTHING;

DROP POLICY IF EXISTS "admin_storage" ON storage.objects;
CREATE POLICY "admin_storage" ON storage.objects FOR ALL USING (
  auth.role() = 'authenticated' AND bucket_id = 'clinica-archivos'
);
