import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import ModalNuevaCita from '../components/ModalNuevaCita';
import { supabase, formatCLP, formatFecha, formatHora } from '../lib/supabase';
import { 
  CalendarDays, 
  PlusCircle, 
  Search, 
  Trash2, 
  FileText, 
  Filter, 
  Calendar,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

export default function CitasPage() {
  const [citas, setCitas] = useState([]);
  const [filterFecha, setFilterFecha] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    cargarCitas();
  }, [filterFecha, filterEstado]);

  const cargarCitas = async () => {
    setLoading(true);
    let query = supabase
      .from('citas')
      .select('*, pacientes(id, nombre, apellido, rut)')
      .order('fecha', { ascending: false })
      .order('hora', { ascending: true });

    if (filterFecha) query = query.eq('fecha', filterFecha);
    if (filterEstado) query = query.eq('estado', filterEstado);

    const { data, error } = await query;
    if (!error) {
      setCitas(data || []);
    }
    setLoading(false);
  };

  const handleActualizarEstado = async (citaId, nuevoEstado) => {
    try {
      const { error } = await supabase.from('citas').update({ estado: nuevoEstado }).eq('id', citaId);
      if (error) throw error;
      cargarCitas();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleEliminarCita = async (citaId) => {
    if (!confirm('¿Deseas eliminar permanentemente esta cita?')) return;
    try {
      const { error } = await supabase.from('citas').delete().eq('id', citaId);
      if (error) throw error;
      cargarCitas();
    } catch (err) {
      alert('Error al eliminar: ' + err.message);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline text-2xl md:text-3xl font-bold text-on-surface">Agenda & Citas</h1>
          <p className="text-xs text-on-surface-variant mt-1">Revisa, confirma o agenda nuevas sesiones clínicas.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Agendar Nueva Cita</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/70 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Filtrar por Fecha</label>
            <input
              type="date"
              value={filterFecha}
              onChange={(e) => setFilterFecha(e.target.value)}
              className="text-xs p-2 rounded-xl border border-gray-200 focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Filtrar por Estado</label>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="text-xs p-2 rounded-xl border border-gray-200 focus:border-primary outline-none"
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="confirmada">Confirmada</option>
              <option value="completada">Completada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>

          {(filterFecha || filterEstado) && (
            <button
              onClick={() => { setFilterFecha(''); setFilterEstado(''); }}
              className="self-end text-xs text-primary font-semibold hover:underline p-2"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        <div className="text-xs text-gray-500 font-medium">
          Total de citas: <span className="font-bold text-primary">{citas.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-200/70 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fafaf4] text-[11px] text-gray-500 uppercase font-bold border-b border-gray-200/60">
              <tr>
                <th className="p-4">Fecha & Hora</th>
                <th className="p-4">Paciente</th>
                <th className="p-4">Servicio</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Monto / Pago</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-400">Cargando agenda...</td>
                </tr>
              ) : citas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-400">No se encontraron citas registradas.</td>
                </tr>
              ) : (
                citas.map((c) => {
                  const pacienteNombre = c.pacientes ? `${c.pacientes.nombre} ${c.pacientes.apellido}` : c.nombre;
                  const pacienteId = c.pacientes ? c.pacientes.id : c.paciente_id;

                  return (
                    <tr key={c.id} className="hover:bg-gray-50/80 transition">
                      <td className="p-4">
                        <div className="font-bold text-on-surface">{formatFecha(c.fecha)}</div>
                        <div className="text-[11px] text-primary font-bold">{formatHora(c.hora)}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-on-surface">{pacienteNombre}</div>
                        <div className="text-[11px] text-gray-400">{c.telefono || c.email || 'Sin contacto'}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-gray-700">{c.servicio}</div>
                        {c.notas && <div className="text-[10px] text-gray-400 italic truncate max-w-xs">{c.notas}</div>}
                      </td>
                      <td className="p-4">
                        {badgeEstado(c.estado)}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-gray-800">{formatCLP(c.monto)}</div>
                        <span className={`text-[10px] uppercase font-bold ${c.pago_estado === 'pagado' ? 'text-green-600' : 'text-yellow-600'}`}>
                          {c.pago_estado || 'pendiente'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {pacienteId && (
                            <Link
                              to={`/admin/pacientes/${pacienteId}?cita=${c.id}`}
                              className="p-2 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-white transition"
                              title="Ver Ficha Clínica"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </Link>
                          )}

                          <select
                            value=""
                            onChange={(e) => handleActualizarEstado(c.id, e.target.value)}
                            className="text-xs p-1.5 rounded-lg border border-gray-200 bg-white outline-none"
                          >
                            <option value="" disabled>Cambiar estado</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="confirmada">Confirmada</option>
                            <option value="completada">Completada</option>
                            <option value="cancelada">Cancelada</option>
                          </select>

                          <button
                            onClick={() => handleEliminarCita(c.id)}
                            className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition"
                            title="Eliminar Cita"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ModalNuevaCita
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCitaCreada={cargarCitas}
      />
    </AdminLayout>
  );
}
