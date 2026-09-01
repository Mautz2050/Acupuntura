import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { X, Stethoscope, Loader2, Sparkles } from 'lucide-react';

export default function ModalNuevaConsulta({ isOpen, onClose, pacienteId, onConsultaCreada }) {
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    motivo: '',
    anamnesis: '',
    diagnostico_tcm: '',
    diagnostico_occidental: '',
    puntos_acupuntura: '',
    tecnicas_utilizadas: '',
    tratamiento: '',
    evoluciones: '',
    proxima_cita: ''
  });
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    const hasData = formData.motivo || formData.diagnostico_tcm || formData.tratamiento;
    if (hasData) {
      if (!window.confirm('¿Seguro que deseas cerrar? Se perderán los datos no guardados.')) {
        return;
      }
    }
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('consultas').insert([{
        paciente_id: pacienteId,
        fecha: formData.fecha,
        motivo: formData.motivo.trim(),
        anamnesis: formData.anamnesis.trim(),
        diagnostico_tcm: formData.diagnostico_tcm.trim(),
        diagnostico_occidental: formData.diagnostico_occidental.trim(),
        puntos_acupuntura: formData.puntos_acupuntura.trim(),
        tecnicas_utilizadas: formData.tecnicas_utilizadas.trim(),
        tratamiento: formData.tratamiento.trim(),
        evoluciones: formData.evoluciones.trim(),
        proxima_cita: formData.proxima_cita.trim()
      }]);

      if (error) throw error;
      onConsultaCreada();
      onClose();
    } catch (err) {
      alert('Error al guardar la consulta: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-gray-200 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-primary text-white p-5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-primary-container" />
            <h3 className="font-headline font-bold text-lg">Nueva Sesión Clínica TCM</h3>
          </div>
          <button onClick={handleClose} className="p-1 rounded-lg hover:bg-white/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Fecha de la Sesión *</label>
              <input
                type="date"
                required
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary outline-none text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Motivo de Consulta / Queja Principal *</label>
              <input
                type="text"
                required
                value={formData.motivo}
                onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                placeholder="Ej: Dolor lumbar, insomnio, cefalea..."
                className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary outline-none text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Anamnesis & Examen Clínico (Lengua, Pulso, Palpación Ashi)</label>
            <textarea
              rows={2}
              value={formData.anamnesis}
              onChange={(e) => setFormData({ ...formData, anamnesis: e.target.value })}
              placeholder="Lengua: cuerpo rojo, saburra amarilla fina. Pulso: rápido y flotante (Fu-Shu). Sensibilidad en meridianos..."
              className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary outline-none text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-primary mb-1">Diagnóstico Síndrome TCM</label>
              <input
                type="text"
                value={formData.diagnostico_tcm}
                onChange={(e) => setFormData({ ...formData, diagnostico_tcm: e.target.value })}
                placeholder="Ej: Calor en Hígado y Estancamiento de Qi"
                className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary outline-none text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Diagnóstico Occidental / Concomitante</label>
              <input
                type="text"
                value={formData.diagnostico_occidental}
                onChange={(e) => setFormData({ ...formData, diagnostico_occidental: e.target.value })}
                placeholder="Ej: Lumbociática L5-S1"
                className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary outline-none text-xs"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-container/60 border border-outline-subtle/50 space-y-3">
            <h4 className="text-xs font-bold text-primary uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tratamiento de Acupuntura Aplicado</span>
            </h4>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Puntos de Acupuntura Empleados</label>
              <input
                type="text"
                value={formData.puntos_acupuntura}
                onChange={(e) => setFormData({ ...formData, puntos_acupuntura: e.target.value })}
                placeholder="Ej: IG4 (Hegu), H3 (Taichong), V23 (Shenshu), V40 (Weizhong), Ashi"
                className="w-full p-2.5 rounded-xl border border-gray-300 bg-white focus:border-primary outline-none text-xs"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Técnicas Complementarias</label>
                <input
                  type="text"
                  value={formData.tecnicas_utilizadas}
                  onChange={(e) => setFormData({ ...formData, tecnicas_utilizadas: e.target.value })}
                  placeholder="Moxibustión indirecta, Ventosas de vidrio, Auriculoterapia..."
                  className="w-full p-2.5 rounded-xl border border-gray-300 bg-white focus:border-primary outline-none text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Evolución / Sensación Posterior</label>
                <input
                  type="text"
                  value={formData.evoluciones}
                  onChange={(e) => setFormData({ ...formData, evoluciones: e.target.value })}
                  placeholder="Alivio del 60% del dolor, sensación de ligereza..."
                  className="w-full p-2.5 rounded-xl border border-gray-300 bg-white focus:border-primary outline-none text-xs"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Pauta Terapéutica / Fitoterapia / Dieta</label>
              <textarea
                rows={2}
                value={formData.tratamiento}
                onChange={(e) => setFormData({ ...formData, tratamiento: e.target.value })}
                placeholder="Infusiones de manzanilla/menta, ejercicios suaves de estiramiento..."
                className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary outline-none text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Próxima Sesión Sugerida</label>
              <input
                type="text"
                value={formData.proxima_cita}
                onChange={(e) => setFormData({ ...formData, proxima_cita: e.target.value })}
                placeholder="En 7 días (revisión de evolución)"
                className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary outline-none text-xs"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl text-gray-500 hover:bg-gray-100 font-medium text-xs transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-xs shadow transition flex items-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Guardar Sesión Clínica</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
