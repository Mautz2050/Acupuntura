import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { X, UserPlus, Loader2, AlertTriangle } from 'lucide-react';

const FORM_INICIAL = {
  nombre: '',
  apellido: '',
  rut: '',
  fecha_nacimiento: '',
  telefono: '',
  email: '',
  direccion: '',
  prevision: 'Particular',
  contacto_emergencia: '',
  telefono_emergencia: '',
  alergias: '',
  antecedentes: '',
  notas_generales: ''
};

export default function ModalNuevoPaciente({ isOpen, onClose, onPacienteCreado, initialData, citaId }) {
  const [formData, setFormData] = useState(FORM_INICIAL);
  const [loading, setLoading] = useState(false);

  // Precarga los datos (nombre, email, teléfono) cuando el modal se abre
  // proveniente de una cita sin ficha (ej: desde el Dashboard o Agenda).
  useEffect(() => {
    if (isOpen) {
      setFormData({ ...FORM_INICIAL, ...(initialData || {}) });
    }
  }, [isOpen, initialData]);

  const handleClose = () => {
    const hasData = formData.nombre || formData.apellido || formData.rut;
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
      const payload = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        rut: formData.rut?.trim() || '',
        fecha_nacimiento: formData.fecha_nacimiento || null,
        telefono: formData.telefono?.trim() || '',
        email: formData.email?.trim() || '',
        direccion: formData.direccion?.trim() || '',
        prevision: formData.prevision?.trim() || '',
        contacto_emergencia: formData.contacto_emergencia?.trim() || '',
        telefono_emergencia: formData.telefono_emergencia?.trim() || '',
        alergias: formData.alergias?.trim() || '',
        antecedentes: formData.antecedentes?.trim() || '',
        notas_generales: formData.notas_generales?.trim() || '',
      };

      let pacienteId = null;

      if (formData.id) {
        // Edit mode
        const { error } = await supabase.from('pacientes').update(payload).eq('id', formData.id);
        if (error) throw error;
        pacienteId = formData.id;
      } else {
        // Insert mode
        const { data, error } = await supabase.from('pacientes').insert([payload]).select('id').single();
        if (error) throw error;
        pacienteId = data.id;

        // Vincular cita si existe
        if (citaId) {
          const { error: citaError } = await supabase
            .from('citas')
            .update({ paciente_id: pacienteId })
            .eq('id', citaId);
          if (citaError) console.error('No se pudo vincular la cita al paciente:', citaError);
        }
      }

      onPacienteCreado(pacienteId);
      onClose();
    } catch (err) {
      alert('Error al guardar paciente: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-primary text-white p-5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary-container" />
            <h3 className="font-headline font-bold text-lg">Registrar Ficha de Paciente</h3>
          </div>
          <button onClick={handleClose} className="p-1 rounded-lg hover:bg-white/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-sm">
          {/* 1. Datos Personales */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">1. Datos Personales</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nombres *</label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: María Elena"
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary outline-none text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Apellidos *</label>
                <input
                  type="text"
                  required
                  value={formData.apellido}
                  onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  placeholder="Ej: González Pérez"
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary outline-none text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">RUT / Identificación</label>
                <input
                  type="text"
                  value={formData.rut}
                  onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                  placeholder="Ej: 12.345.678-9"
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary outline-none text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Fecha de Nacimiento</label>
                <input
                  type="date"
                  value={formData.fecha_nacimiento}
                  onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary outline-none text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Teléfono / WhatsApp *</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  required
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value.replace(/\D/g, '').slice(0, 12) })}
                  placeholder="56912345678"
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary outline-none text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="paciente@correo.cl"
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary outline-none text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Dirección / Comuna</label>
                <input
                  type="text"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  placeholder="Calle, Número, Depto"
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary outline-none text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Previsión de Salud</label>
                <input
                  type="text"
                  value={formData.prevision}
                  onChange={(e) => setFormData({ ...formData, prevision: e.target.value })}
                  placeholder="Fonasa / Isapre / Particular"
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary outline-none text-xs"
                />
              </div>
            </div>
          </div>

          {/* 2. Contacto de Emergencia */}
          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">2. Contacto de Emergencia</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre Contacto</label>
                <input
                  type="text"
                  value={formData.contacto_emergencia}
                  onChange={(e) => setFormData({ ...formData, contacto_emergencia: e.target.value })}
                  placeholder="Familiar o pareja"
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary outline-none text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Teléfono Emergencia</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={formData.telefono_emergencia}
                  onChange={(e) => setFormData({ ...formData, telefono_emergencia: e.target.value.replace(/\D/g, '').slice(0, 12) })}
                  placeholder="56912345678"
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary outline-none text-xs"
                />
              </div>
            </div>
          </div>

          {/* 3. Alergias & Antecedentes */}
          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-secondary mb-3 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>3. Alergias & Antecedentes Médicos</span>
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-red-700 mb-1">Alergias Conocidas (Metales, fármacos, plantas...)</label>
                <input
                  type="text"
                  value={formData.alergias}
                  onChange={(e) => setFormData({ ...formData, alergias: e.target.value })}
                  placeholder="Ninguna conocida / Alergia al níquel, etc."
                  className="w-full p-2.5 rounded-xl border border-red-200 bg-red-50/40 focus:border-red-400 outline-none text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Antecedentes Clínicos / Medicación Actual</label>
                <textarea
                  rows={2}
                  value={formData.antecedentes}
                  onChange={(e) => setFormData({ ...formData, antecedentes: e.target.value })}
                  placeholder="Hipertensión, marcapasos, uso de anticoagulantes, cirugías previas..."
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary outline-none text-xs resize-none"
                />
              </div>
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
              <span>Guardar Ficha del Paciente</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
