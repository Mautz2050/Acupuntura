import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import ModalNuevoPaciente from '../components/ModalNuevoPaciente';
import { supabase, calcularEdad } from '../lib/supabase';
import { 
  Users, 
  UserPlus, 
  Search, 
  Phone, 
  Mail, 
  AlertTriangle, 
  FileText, 
  ChevronRight,
  ShieldAlert,
  Trash2
} from 'lucide-react';

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    cargarPacientes();
    if (searchParams.get('nuevo') === 'true') {
      setIsModalOpen(true);
    }
  }, [searchParams]);

  // Datos que llegan desde una cita sin ficha (link "Crear Ficha" del Dashboard)
  const nombreCompleto = (searchParams.get('nombre') || '').trim();
  const [primerNombre, ...resto] = nombreCompleto.split(' ');
  const prefillData = {
    nombre: primerNombre || '',
    apellido: resto.join(' '),
    email: searchParams.get('email') || '',
    telefono: (searchParams.get('telefono') || '').replace(/\D/g, ''),
  };
  const citaIdParaVincular = searchParams.get('cita') || null;

  const cargarPacientes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pacientes')
      .select('*, consultas(count)')
      .order('nombre', { ascending: true });

    if (!error) {
      setPacientes(data || []);
    }
    setLoading(false);
  };

  const handleEliminarPaciente = async (p) => {
    const nombreCompleto = `${p.nombre || ''} ${p.apellido || ''}`.trim();
    const confirmado = window.confirm(
      `¿Eliminar permanentemente la ficha de ${nombreCompleto || 'este paciente'}?\n\nSe borrarán también su historial de sesiones, recetas y archivos adjuntos. Esta acción no se puede deshacer.`
    );
    if (!confirmado) return;

    try {
      const { error } = await supabase.from('pacientes').delete().eq('id', p.id);
      if (error) throw error;
      setPacientes((prev) => prev.filter((x) => x.id !== p.id));
    } catch (err) {
      alert('Error al eliminar la ficha: ' + err.message);
    }
  };

  const pacientesFiltrados = pacientes.filter((p) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      (p.nombre && p.nombre.toLowerCase().includes(q)) ||
      (p.apellido && p.apellido.toLowerCase().includes(q)) ||
      (p.rut && p.rut.toLowerCase().includes(q)) ||
      (p.telefono && p.telefono.includes(q))
    );
  });

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline text-2xl md:text-3xl font-bold text-on-surface">Fichas de Pacientes</h1>
          <p className="text-xs text-on-surface-variant mt-1">Directorio médico, antecedentes, sesiones clínicas y recetas.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>Registrar Nuevo Paciente</span>
        </button>
      </div>

      {/* Search & Info Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/70 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, RUT o teléfono..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-xs"
          />
        </div>

        <div className="text-xs text-gray-500 font-medium self-end sm:self-center">
          Total de pacientes registrados: <span className="font-bold text-primary">{pacientes.length}</span>
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full p-16 text-center text-gray-400">Cargando directorio de pacientes...</div>
        ) : pacientesFiltrados.length === 0 ? (
          <div className="col-span-full p-16 text-center text-gray-400 bg-white rounded-3xl border border-gray-200">
            <Users className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p className="font-medium text-sm text-gray-600">No se encontraron pacientes.</p>
          </div>
        ) : (
          pacientesFiltrados.map((p) => {
            const totalConsultas = p.consultas ? (p.consultas[0] ? p.consultas[0].count : 0) : 0;
            const edad = calcularEdad(p.fecha_nacimiento);

            return (
              <div 
                key={p.id}
                className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-3.5 mb-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-base shrink-0 border border-primary/20">
                      {(p.nombre || '?')[0]}{p.apellido ? p.apellido[0] : ''}
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-bold text-sm text-on-surface leading-tight truncate">{p.nombre} {p.apellido}</h3>
                      <p className="text-[11px] text-gray-400 mt-0.5">{p.rut || 'Sin RUT'} {edad !== '--' ? `• ${edad} años` : ''}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-on-surface-variant mb-4 bg-gray-50/70 p-3 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{p.telefono || 'Sin teléfono'}</span>
                    </div>

                    {p.email && (
                      <div className="flex items-center gap-2 truncate">
                        <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">{p.email}</span>
                      </div>
                    )}

                    {p.alergias && (
                      <div className="flex items-center gap-1.5 text-red-600 font-bold truncate mt-1 pt-1 border-t border-gray-200/40">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">Alergia: {p.alergias}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-gray-400 font-medium">{totalConsultas} sesiones clínicas</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEliminarPaciente(p)}
                      title="Eliminar Ficha"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 transition active:scale-95"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <Link
                      to={`/admin/pacientes/${p.id}`}
                      className="inline-flex items-center gap-1 bg-primary hover:bg-primary-dark text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition active:scale-95"
                    >
                      <span>Abrir Ficha</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <ModalNuevoPaciente
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPacienteCreado={cargarPacientes}
        initialData={searchParams.get('nuevo') === 'true' ? prefillData : null}
        citaId={citaIdParaVincular}
      />
    </AdminLayout>
  );
}
