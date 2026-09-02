import React, { useState, useEffect } from 'react';
import { supabase, SERVICIOS, formatCLP } from '../lib/supabase';
import { X, CalendarPlus, Loader2 } from 'lucide-react';

export default function ModalNuevaCita({ isOpen, onClose, onCitaCreada }) {
  const PROFESIONALES = ['Soledad Menares', 'Lorena Olivares', 'Paola Soto'];

  const [pacientes, setPacientes] = useState([]);
  const [selectedPacienteId, setSelectedPacienteId] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [servicio, setServicio] = useState(SERVICIOS[0].nombre);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [hora, setHora] = useState('10:00');
  const [monto, setMonto] = useState(SERVICIOS[0].precio);
  const [pagoEstado, setPagoEstado] = useState('pendiente');
  const [notas, setNotas] = useState('');
  const [profesional, setProfesional] = useState('Soledad Menares');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      cargarPacientes();
    }
  }, [isOpen]);

  const cargarPacientes = async () => {
    const { data } = await supabase.from('pacientes').select('id, nombre, apellido, rut, email, telefono').order('nombre');
    if (data) setPacientes(data);
  };

  const handlePacienteChange = (pId) => {
    setSelectedPacienteId(pId);
    if (pId) {
      const p = pacientes.find(x => x.id === pId);
      if (p) {
        setNombre(`${p.nombre} ${p.apellido}`);
        setTelefono(p.telefono || '');
        setEmail(p.email || '');
      }
    } else {
      setNombre('');
      setTelefono('');
      setEmail('');
    }
  };

  const handleServicioChange = (sNombre) => {
    setServicio(sNombre);
    const s = SERVICIOS.find(x => x.nombre === sNombre);
    if (s) setMonto(s.precio);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('citas').insert([{
        paciente_id: selectedPacienteId || null,
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        email: email.trim(),
        servicio,
        fecha,
        hora,
        monto: parseInt(monto) || 0,
        pago_estado: pagoEstado,
        notas: notas.trim() ? `[${profesional}] ${notas.trim()}` : `[${profesional}]`,
        estado: 'confirmada'
      }]);

      if (error) throw error;
      onCitaCreada();
      onClose();
    } catch (err) {
      alert('Error al agendar cita: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-primary text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarPlus className="w-5 h-5 text-primary-container" />
            <h3 className="font-headline font-bold text-lg">Agendar Cita en Consultorio</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Paciente</label>
            <select
              value={selectedPacienteId}
              onChange={(e) => handlePacienteChange(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary outline-none text-xs"
            >
              <option value="">-- Registrar cita para nuevo paciente --</option>
              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} {p.apellido} ({p.rut || p.telefono || 'Sin datos'})
                </option>
              ))}
            </select>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${selectedPacienteId ? 'opacity-60 pointer-events-none' : ''}`}>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre Completo *</label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre del paciente"
                className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary outline-none text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Teléfono / WhatsApp *</label>
              <input
                type="tel"
                inputMode="numeric"
                required
                value={telefono}
                onChange={(e) => setTelefono(e.target.value.replace(/\D/g, '').slice(0, 12))}
                placeholder="56912345678"
                className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary outline-none text-xs"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="paciente@correo.cl"
                className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary outline-none text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Profesional *</label>
            <select
              value={profesional}
              onChange={(e) => setProfesional(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary outline-none text-xs"
            >
              {PROFESIONALES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Servicio *</label>
            <select
              value={servicio}
              onChange={(e) => handleServicioChange(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary outline-none text-xs"
            >
              {SERVICIOS.map((s) => (
                <option key={s.id} value={s.nombre}>
                  {s.nombre} ({formatCLP(s.precio)})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Fecha *</label>
              <input
                type="date"
                required
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary outline-none text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Hora *</label>
              <input
                type="time"
                required
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary outline-none text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Monto (CLP)</label>
              <input
                type="number"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary outline-none text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Estado del Pago</label>
              <select
                value={pagoEstado}
                onChange={(e) => setPagoEstado(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary outline-none text-xs"
              >
                <option value="pendiente">Pendiente</option>
                <option value="pagado">Pagado</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Notas Internas</label>
            <textarea
              rows={2}
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Detalles adicionales, motivo de consulta..."
              className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary outline-none text-xs resize-none"
            />
          </div>

          <div className="pt-3 flex justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-gray-500 hover:bg-gray-100 font-medium text-xs transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-xs shadow transition flex items-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Guardar Cita</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
