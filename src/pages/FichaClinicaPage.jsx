import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import ModalNuevaConsulta from '../components/ModalNuevaConsulta';
import ModalNuevoPaciente from '../components/ModalNuevoPaciente';
import { supabase, formatFecha, calcularEdad } from '../lib/supabase';
import { 
  ArrowLeft, 
  Printer, 
  PlusCircle, 
  AlertTriangle, 
  Phone, 
  Mail, 
  Calendar, 
  Stethoscope, 
  Sparkles, 
  FileText, 
  Paperclip, 
  Pill, 
  User, 
  Activity,
  Upload,
  Clock,
  CheckCircle2,
  Pencil
} from 'lucide-react';

export default function FichaClinicaPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [paciente, setPaciente] = useState(null);
  const [consultas, setConsultas] = useState([]);
  const [recetas, setRecetas] = useState([]);
  const [archivos, setArchivos] = useState([]);
  const [activeTab, setActiveTab] = useState('consultas');
  const [loading, setLoading] = useState(true);
  const [isModalConsultaOpen, setIsModalConsultaOpen] = useState(false);

  // Nueva receta modal state
  const [showRecetaModal, setShowRecetaModal] = useState(false);
  const [recetaDesc, setRecetaDesc] = useState('');
  const [recetaDosis, setRecetaDosis] = useState('');
  const [recetaDuracion, setRecetaDuracion] = useState('');
  const [recetaInstrucciones, setRecetaInstrucciones] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isEditPacienteOpen, setIsEditPacienteOpen] = useState(false);

  useEffect(() => {
    cargarFichaCompleta();
    if (searchParams.get('cita')) {
      setIsModalConsultaOpen(true);
    }
  }, [id]);

  const cargarFichaCompleta = async () => {
    setLoading(true);
    try {
      // 1. Paciente
      const { data: pData } = await supabase.from('pacientes').select('*').eq('id', id).single();
      if (pData) setPaciente(pData);

      // 2. Consultas
      const { data: cData } = await supabase.from('consultas').select('*').eq('paciente_id', id).order('fecha', { ascending: false });
      if (cData) setConsultas(cData);

      // 3. Recetas
      const { data: rData } = await supabase.from('recetas').select('*').eq('paciente_id', id).order('created_at', { ascending: false });
      if (rData) setRecetas(rData);

      // 4. Archivos
      const { data: aData } = await supabase.from('archivos').select('*').eq('paciente_id', id).order('created_at', { ascending: false });
      if (aData) setArchivos(aData);
    } catch (err) {
      console.error('Error cargando ficha:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarReceta = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('recetas').insert([{
        paciente_id: id,
        descripcion: recetaDesc.trim(),
        dosis: recetaDosis.trim(),
        duracion: recetaDuracion.trim(),
        instrucciones: recetaInstrucciones.trim()
      }]);
      if (error) throw error;
      setRecetaDesc('');
      setRecetaDosis('');
      setRecetaDuracion('');
      setRecetaInstrucciones('');
      setShowRecetaModal(false);
      cargarFichaCompleta();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('clinica-archivos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('clinica-archivos')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase.from('archivos').insert([{
        paciente_id: id,
        nombre: file.name,
        url: publicUrlData.publicUrl,
        tipo: file.type,
        tamano: file.size
      }]);

      if (dbError) throw dbError;

      cargarFichaCompleta();
    } catch (err) {
      alert('Error al subir el archivo: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading || !paciente) {
    return (
      <AdminLayout>
        <div className="p-20 text-center text-gray-400">Cargando ficha clínica...</div>
      </AdminLayout>
    );
  }

  const edad = calcularEdad(paciente.fecha_nacimiento);

  return (
    <AdminLayout>
      {/* Top Actions */}
      <div className="flex items-center justify-between gap-4 mb-6 print:hidden">
        <Link 
          to="/admin/pacientes" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Pacientes</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-xs font-semibold shadow-sm transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Ficha</span>
          </button>
          <button
            onClick={() => setIsEditPacienteOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-xs font-semibold shadow-sm transition"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Editar Datos</span>
          </button>
          <button
            onClick={() => setIsModalConsultaOpen(true)}
            className="inline-flex items-center gap-2 bg-secondary hover:opacity-90 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nueva Sesión / Consulta</span>
          </button>
        </div>
      </div>

      {/* Patient Card Header */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center font-headline text-2xl font-bold shrink-0 shadow-md">
              {(paciente.nombre || '?')[0]}{paciente.apellido ? paciente.apellido[0] : ''}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-headline text-2xl md:text-3xl font-bold text-on-surface">
                  {paciente.nombre} {paciente.apellido}
                </h1>
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                  {paciente.prevision || 'Particular'}
                </span>
              </div>

              <div className="text-xs text-on-surface-variant mt-2 flex flex-wrap items-center gap-4">
                <span className="font-medium">RUT: {paciente.rut || '--'}</span>
                <span>Edad: {edad !== '--' ? `${edad} años` : '--'}</span>
                <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-gray-400" /> {paciente.telefono || '--'}</span>
                <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-gray-400" /> {paciente.email || '--'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Antecedentes & Alergias Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 text-xs">
          <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200/70 text-red-900">
            <span className="font-bold text-red-700 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Alergias Conocidas</span>
            </span>
            <p className="font-semibold">{paciente.alergias || 'Ninguna registrada'}</p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/70">
            <span className="font-bold text-gray-600 uppercase tracking-wider block mb-1.5">Antecedentes Clínicos</span>
            <p className="text-gray-700 leading-relaxed">{paciente.antecedentes || 'Sin antecedentes registrados'}</p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/70">
            <span className="font-bold text-gray-600 uppercase tracking-wider block mb-1.5">Contacto de Emergencia</span>
            <p className="text-gray-700">
              {paciente.contacto_emergencia ? `${paciente.contacto_emergencia} (${paciente.telefono_emergencia || ''})` : 'No especificado'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-3 border-b border-gray-200 mb-6 print:hidden">
        <button
          onClick={() => setActiveTab('consultas')}
          className={`pb-3 px-3 font-bold text-xs flex items-center gap-2 transition border-b-2 ${
            activeTab === 'consultas'
              ? 'text-primary border-primary'
              : 'text-gray-400 border-transparent hover:text-gray-600'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>Historial de Sesiones ({consultas.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('recetas')}
          className={`pb-3 px-3 font-bold text-xs flex items-center gap-2 transition border-b-2 ${
            activeTab === 'recetas'
              ? 'text-primary border-primary'
              : 'text-gray-400 border-transparent hover:text-gray-600'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span>Recetas & Fitoterapia ({recetas.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('archivos')}
          className={`pb-3 px-3 font-bold text-xs flex items-center gap-2 transition border-b-2 ${
            activeTab === 'archivos'
              ? 'text-primary border-primary'
              : 'text-gray-400 border-transparent hover:text-gray-600'
          }`}
        >
          <Paperclip className="w-4 h-4" />
          <span>Imágenes & Exámenes ({archivos.length})</span>
        </button>
      </div>

      {/* TAB 1: CONSULTAS / HISTORIAL DE SESIONES */}
      {activeTab === 'consultas' && (
        <div className="space-y-6">
          {consultas.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center text-gray-400">
              <Stethoscope className="w-12 h-12 mx-auto text-gray-300 mb-2" />
              <p className="font-bold text-sm text-gray-600">Aún no hay sesiones registradas para este paciente.</p>
              <p className="text-xs text-gray-400 mt-1">Haz clic en "Nueva Sesión / Consulta" para registrar la primera atención.</p>
            </div>
          ) : (
            consultas.map((c, idx) => (
              <div key={c.id} className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden">
                <div className="bg-[#fcfcf7] px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                      #{consultas.length - idx}
                    </span>
                    <div>
                      <h3 className="font-bold text-sm text-on-surface">{formatFecha(c.fecha)}</h3>
                      <p className="text-xs text-primary font-semibold">{c.motivo || 'Consulta General'}</p>
                    </div>
                  </div>

                  {c.proxima_cita && (
                    <span className="text-[11px] bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-bold">
                      Próxima: {c.proxima_cita}
                    </span>
                  )}
                </div>

                <div className="p-6 md:p-8 space-y-5 text-xs">
                  {c.anamnesis && (
                    <div>
                      <h4 className="font-bold uppercase tracking-wider text-gray-500 mb-1.5 text-[11px]">
                        Anamnesis & Examen Clínico (Lengua / Pulso)
                      </h4>
                      <p className="text-gray-700 bg-gray-50 p-3.5 rounded-2xl leading-relaxed">{c.anamnesis}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {c.diagnostico_tcm && (
                      <div className="p-3.5 rounded-2xl bg-surface-container/50 border border-outline-subtle/30">
                        <span className="font-bold text-primary block mb-1">Diagnóstico Síndrome TCM</span>
                        <p className="text-gray-800 font-semibold">{c.diagnostico_tcm}</p>
                      </div>
                    )}
                    {c.diagnostico_occidental && (
                      <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
                        <span className="font-bold text-gray-600 block mb-1">Diagnóstico Occidental</span>
                        <p className="text-gray-800">{c.diagnostico_occidental}</p>
                      </div>
                    )}
                  </div>

                  {(c.puntos_acupuntura || c.tecnicas_utilizadas) && (
                    <div className="p-4 rounded-2xl bg-[#fafaf2] border border-primary-container/40">
                      <h4 className="font-bold text-primary uppercase text-[11px] mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Tratamiento de Acupuntura Aplicado</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <span className="text-gray-500 font-medium">Puntos Seleccionados:</span>
                          <p className="font-bold text-gray-800 text-xs mt-0.5">{c.puntos_acupuntura || '--'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 font-medium">Técnicas Complementarias:</span>
                          <p className="text-gray-800 text-xs mt-0.5">{c.tecnicas_utilizadas || '--'}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {c.tratamiento && (
                    <div>
                      <h4 className="font-bold uppercase tracking-wider text-gray-500 mb-1.5 text-[11px]">
                        Indicaciones al Paciente (Fitoterapia / Dieta)
                      </h4>
                      <p className="text-gray-700 bg-gray-50 p-3.5 rounded-2xl">{c.tratamiento}</p>
                    </div>
                  )}

                  {c.evoluciones && (
                    <div>
                      <h4 className="font-bold uppercase tracking-wider text-green-700 mb-1.5 text-[11px]">
                        Evolución & Respuesta al Tratamiento
                      </h4>
                      <p className="text-green-900 bg-green-50/70 p-3.5 rounded-2xl border border-green-200/50">{c.evoluciones}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: RECETAS */}
      {activeTab === 'recetas' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-headline font-bold text-base text-on-surface">Recetas y Recomendaciones Terapéuticas</h3>
            <button
              onClick={() => setShowRecetaModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold shadow flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Agregar Receta</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recetas.length === 0 ? (
              <p className="text-gray-400 text-xs col-span-full">No hay recetas registradas para este paciente.</p>
            ) : (
              recetas.map((r) => (
                <div key={r.id} className="p-4 bg-white rounded-2xl border border-gray-200 text-xs shadow-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-primary uppercase text-[10px] tracking-wider">Receta / Pauta</span>
                    <span className="text-gray-400 text-[10px]">{formatFecha(r.created_at.split('T')[0])}</span>
                  </div>
                  <p className="font-bold text-sm text-gray-800">{r.descripcion}</p>
                  <p className="text-gray-600">
                    {r.dosis && `Dosis: ${r.dosis} • `}
                    {r.duracion && `Duración: ${r.duracion}`}
                  </p>
                  {r.instrucciones && (
                    <p className="italic text-gray-500 bg-gray-50 p-2.5 rounded-xl">"{r.instrucciones}"</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ARCHIVOS */}
      {activeTab === 'archivos' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-headline font-bold text-base text-on-surface">Galería de Imágenes & Exámenes</h3>
            <div>
              <label className="cursor-pointer bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition inline-flex items-center gap-2 disabled:opacity-50">
                <Upload className="w-4 h-4" />
                <span>{uploading ? 'Subiendo...' : 'Subir Archivo'}</span>
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileUpload} 
                  disabled={uploading}
                  accept="image/*,.pdf" 
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {archivos.length === 0 ? (
              <p className="text-gray-400 text-xs col-span-full">No hay archivos ni fotografías adjuntas.</p>
            ) : (
              archivos.map((a) => (
                <div key={a.id} className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm text-xs flex flex-col justify-between">
                  <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-2 flex items-center justify-center">
                    {a.tipo && a.tipo.includes('image') ? (
                      <img src={a.url} alt={a.nombre} className="w-full h-full object-cover" />
                    ) : (
                      <Paperclip className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <p className="font-medium text-gray-800 truncate" title={a.nombre}>{a.nombre}</p>
                  <a href={a.url} target="_blank" rel="noreferrer" className="text-primary hover:underline font-semibold text-[11px] mt-1">
                    Ver Archivo
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL NUEVA CONSULTA */}
      <ModalNuevaConsulta
        isOpen={isModalConsultaOpen}
        onClose={() => setIsModalConsultaOpen(false)}
        pacienteId={id}
        onConsultaCreada={cargarFichaCompleta}
      />

      {/* MODAL EDITAR DATOS PACIENTE */}
      <ModalNuevoPaciente
        isOpen={isEditPacienteOpen}
        onClose={() => setIsEditPacienteOpen(false)}
        onPacienteCreado={() => { setIsEditPacienteOpen(false); cargarFichaCompleta(); }}
        initialData={paciente ? { ...paciente, id: paciente.id } : null}
      />

      {/* MODAL NUEVA RECETA */}
      {showRecetaModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-gray-200">
            <h3 className="font-headline font-bold text-lg text-on-surface">Agregar Receta / Fitoterapia</h3>
            <form onSubmit={handleGuardarReceta} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Descripción / Fármaco / Hierba *</label>
                <input
                  type="text"
                  required
                  value={recetaDesc}
                  onChange={(e) => setRecetaDesc(e.target.value)}
                  placeholder="Ej: Fórmula Xiao Yao San / Tintura de Valeriana"
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Dosis</label>
                  <input
                    type="text"
                    value={recetaDosis}
                    onChange={(e) => setRecetaDosis(e.target.value)}
                    placeholder="Ej: 2 cápsulas / día"
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Duración</label>
                  <input
                    type="text"
                    value={recetaDuracion}
                    onChange={(e) => setRecetaDuracion(e.target.value)}
                    placeholder="Ej: 14 días"
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Instrucciones al Paciente</label>
                <textarea
                  rows={2}
                  value={recetaInstrucciones}
                  onChange={(e) => setRecetaInstrucciones(e.target.value)}
                  placeholder="Tomar después de las comidas con agua tibia..."
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRecetaModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-500 hover:bg-gray-100 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold shadow"
                >
                  Guardar Receta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
