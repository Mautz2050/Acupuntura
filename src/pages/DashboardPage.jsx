import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import ModalNuevaCita from '../components/ModalNuevaCita';
import ModalNuevoPaciente from '../components/ModalNuevoPaciente';
import { supabase, formatCLP, formatHora } from '../lib/supabase';
import { 
  CalendarCheck, 
  Clock, 
  Users, 
  DollarSign, 
  PlusCircle, 
  UserPlus, 
  Check, 
  FileText, 
  ArrowRight,
  Sparkles,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function DashboardPage() {
  const [citasHoy, setCitasHoy] = useState([]);
  const [pacientesRecientes, setPacientesRecientes] = useState([]);
  const [stats, setStats] = useState({
    hoy: 0,
    pendientes: 0,
    pacientes: 0,
    ingresosMes: 0
  });
  const [loading, setLoading] = useState(true);
  const [isModalCitaOpen, setIsModalCitaOpen] = useState(false);
  const [isModalPacienteOpen, setIsModalPacienteOpen] = useState(false);
  const [vincularCita, setVincularCita] = useState(null);
  const [todosPacientes, setTodosPacientes] = useState([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    const hoyISO = new Date().toISOString().split('T')[0];

    try {
      // 1. Citas de hoy
      const { data: citasData } = await supabase
        .from('citas')
        .select('*, pacientes(id, nombre, apellido, rut, telefono)')
        .eq('fecha', hoyISO)
        .order('hora', { ascending: true });

      // 2. Conteo de pendientes
      const { count: pendingCount } = await supabase
        .from('citas')
        .select('*', { count: 'exact', head: true })
        .eq('estado', 'pendiente');

      // 3. Conteo de pacientes
      const { count: patientCount } = await supabase
        .from('pacientes')
        .select('*', { count: 'exact', head: true });

      // 4. Ingresos del mes
      const primerDiaMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
      const { data: citasMes } = await supabase
        .from('citas')
        .select('monto')
        .gte('fecha', primerDiaMes)
        .neq('estado', 'cancelada');

      const totalMes = (citasMes || []).reduce((acc, curr) => acc + (curr.monto || 0), 0);

      // 5. Últimos pacientes
      const { data: pacRecientes } = await supabase
        .from('pacientes')
        .select('id, nombre, apellido, rut, telefono, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      const { data: todosPac } = await supabase.from('pacientes').select('id, nombre, apellido').order('nombre');
      setTodosPacientes(todosPac || []);
      setCitasHoy(citasData || []);
      setPacientesRecientes(pacRecientes || []);
      setStats({
        hoy: (citasData || []).length,
        pendientes: pendingCount || 0,
        pacientes: patientCount || 0,
        ingresosMes: totalMes
      });
    } catch (err) {
      console.error('Error cargando dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVincular = async () => {
    if (!vincularCita || !pacienteSeleccionado) return;
    try {
      const { error } = await supabase.from('citas').update({ paciente_id: pacienteSeleccionado }).eq('id', vincularCita.id);
      if (error) throw error;
      setVincularCita(null);
      setPacienteSeleccionado('');
      cargarDatos();
    } catch (err) {
      alert('Error al vincular: ' + err.message);
    }
  };

  const handleConfirmarCita = async (citaId) => {
    try {
      const { error } = await supabase.from('citas').update({ estado: 'confirmada' }).eq('id', citaId);
      if (error) throw error;
      cargarDatos();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const badgeEstado = (estado) => {
    const styles = {
      pendiente: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      confirmada: 'bg-blue-100 text-blue-800 border border-blue-200',
      completada: 'bg-green-100 text-green-800 border border-green-200',
      cancelada: 'bg-red-100 text-red-800 border border-red-200',
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${styles[estado] || 'bg-gray-100'}`}>
        {estado}
      </span>
    );
  };

  return (
    <AdminLayout>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline text-2xl md:text-3xl font-bold text-on-surface">Panel de Control</h1>
          <p className="text-xs text-on-surface-variant mt-1">
            {new Date().toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalPacienteOpen(true)}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>Nuevo Paciente</span>
          </button>
          <button
            onClick={() => setIsModalCitaOpen(true)}
            className="inline-flex items-center gap-2 bg-tertiary hover:opacity-90 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Agendar Cita</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/70 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-gray-500 uppercase font-bold tracking-wider">Citas para Hoy</span>
            <h3 className="text-2xl font-bold text-on-surface">{stats.hoy}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/70 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 text-yellow-700 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-gray-500 uppercase font-bold tracking-wider">Citas Pendientes</span>
            <h3 className="text-2xl font-bold text-on-surface">{stats.pendientes}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/70 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-tertiary/10 text-tertiary flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-gray-500 uppercase font-bold tracking-wider">Total Pacientes</span>
            <h3 className="text-2xl font-bold text-on-surface">{stats.pacientes}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/70 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-700 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-gray-500 uppercase font-bold tracking-wider">Ingresos del Mes</span>
            <h3 className="text-2xl font-bold text-on-surface">{formatCLP(stats.ingresosMes)}</h3>
          </div>
        </div>
      </div>

      {/* Agenda del Día */}
      <div className="bg-white rounded-3xl border border-gray-200/70 shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="font-headline text-lg font-bold text-on-surface">Agenda del Día</h2>
          </div>
          <Link to="/admin/citas" className="text-xs text-primary font-semibold hover:underline">
            Ver todas las citas &rarr;
          </Link>
        </div>

        <div className="divide-y divide-gray-100">
          {citasHoy.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              <Calendar className="w-10 h-10 mx-auto text-gray-300 mb-2" />
              <p className="font-medium text-sm text-gray-600">No hay citas programadas para hoy.</p>
              <p className="text-xs text-gray-400 mt-1">Puedes agendar pacientes usando el botón superior.</p>
            </div>
          ) : (
            citasHoy.map((c) => {
              const pacienteNombre = c.pacientes ? `${c.pacientes.nombre} ${c.pacientes.apellido}` : c.nombre;
              const pacienteId = c.pacientes ? c.pacientes.id : null;

              return (
                <div key={c.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/70 transition">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-surface-container flex flex-col items-center justify-center font-bold text-primary shrink-0 border border-outline-subtle/30">
                      <span className="text-xs font-bold leading-none">{formatHora(c.hora)}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h4 className="font-bold text-sm text-on-surface">{pacienteNombre}</h4>
                        {badgeEstado(c.estado)}
                      </div>
                      <p className="text-xs text-on-surface-variant mt-0.5">{c.servicio} • {c.telefono || 'Sin teléfono'}</p>
                      {c.notas && (
                        <p className="text-xs italic text-gray-500 mt-1.5 bg-yellow-50/80 p-2 rounded-xl border border-yellow-100">
                          "{c.notas}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {pacienteId ? (
                      <Link
                        to={`/admin/pacientes/${pacienteId}?cita=${c.id}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-white text-xs font-semibold transition"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Ver Ficha / Atender</span>
                      </Link>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setVincularCita(c)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-semibold transition"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Vincular</span>
                        </button>
                        <Link
                          to={`/admin/pacientes?nuevo=true&nombre=${encodeURIComponent(c.nombre)}&email=${encodeURIComponent(c.email || '')}&telefono=${encodeURIComponent(c.telefono || '')}&cita=${c.id}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-tertiary/10 hover:bg-tertiary text-tertiary hover:text-white text-xs font-semibold transition"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Crear Ficha</span>
                        </Link>
                      </div>
                    )}

                    {c.estado === 'pendiente' && (
                      <button
                        onClick={() => handleConfirmarCita(c.id)}
                        className="p-2 rounded-xl bg-green-100 hover:bg-green-200 text-green-800 transition"
                        title="Confirmar Cita"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Accesos Rápidos & Últimos Pacientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-200/70 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline text-base font-bold text-on-surface">Pacientes Recientemente Registrados</h2>
            <Link to="/admin/pacientes" className="text-xs text-primary font-semibold hover:underline">
              Ver todos &rarr;
            </Link>
          </div>

          <div className="divide-y divide-gray-100 text-xs">
            {pacientesRecientes.length === 0 ? (
              <p className="py-6 text-center text-gray-400">Aún no hay pacientes registrados.</p>
            ) : (
              pacientesRecientes.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      {(p.nombre || '?')[0]}{p.apellido ? p.apellido[0] : ''}
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">{p.nombre} {p.apellido}</p>
                      <p className="text-gray-400 text-[11px]">{p.rut || p.telefono || 'Sin datos'}</p>
                    </div>
                  </div>
                  <Link
                    to={`/admin/pacientes/${p.id}`}
                    className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Ficha</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200/70 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="font-headline text-base font-bold text-on-surface mb-2">Acceso Rápido a Atención</h2>
            <p className="text-xs text-on-surface-variant mb-5">Inicia una consulta clínica o consulta la disponibilidad de horarios.</p>
            
            <div className="space-y-3">
              <Link
                to="/admin/pacientes"
                className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-gray-200 hover:border-primary hover:bg-surface-low transition text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="font-bold">Buscar Paciente y Abrir Ficha</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </Link>

              <Link
                to="/admin/citas"
                className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-gray-200 hover:border-tertiary hover:bg-surface-low transition text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="font-bold">Revisar Agenda Semanal</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </Link>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 text-[11px] text-gray-400 flex items-center justify-between">
            <span>MedPuntos App v1.0 • React & Supabase</span>
            <span className="inline-flex items-center gap-1.5 text-green-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              En línea
            </span>
          </div>
        </div>
      </div>

      {/* Modales */}
      <ModalNuevaCita
        isOpen={isModalCitaOpen}
        onClose={() => setIsModalCitaOpen(false)}
        onCitaCreada={cargarDatos}
      />
      <ModalNuevoPaciente
        isOpen={isModalPacienteOpen}
        onClose={() => setIsModalPacienteOpen(false)}
        onPacienteCreado={() => {
          cargarDatos();
        }}
      />
      {vincularCita && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md">
            <h3 className="font-headline font-bold text-lg mb-4">Vincular cita a paciente existente</h3>
            <p className="text-xs text-gray-500 mb-4">Selecciona el paciente al cual deseas vincular la cita de <strong>{vincularCita.nombre}</strong>.</p>
            <select
              value={pacienteSeleccionado}
              onChange={(e) => setPacienteSeleccionado(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary outline-none text-xs mb-6"
            >
              <option value="">-- Seleccionar Paciente --</option>
              {todosPacientes.map(p => (
                <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>
              ))}
            </select>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setVincularCita(null); setPacienteSeleccionado(''); }}
                className="px-4 py-2 rounded-xl text-gray-500 hover:bg-gray-100 font-medium text-xs transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleVincular}
                disabled={!pacienteSeleccionado}
                className="px-4 py-2 rounded-xl bg-primary text-white font-semibold text-xs transition disabled:opacity-50"
              >
                Vincular
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
