import React, { useState } from 'react';
import { supabase, SERVICIOS, CONTACTO, formatCLP, formatFecha } from '../lib/supabase';
import { Calendar, Clock, User, Phone, FileText, CheckCircle2, MessageCircle, MapPin, Loader2, Mail } from 'lucide-react';

const PROFESIONALES = ['Lorena', 'Soledad', 'Paola'];

export default function BookingSection() {
  const [formData, setFormData] = useState({
    nombre: '',
    rut: '',
    telefono: '',
    email: '',
    servicio: SERVICIOS[0].nombre,
    profesional: 'Soledad',
    fecha: new Date().toISOString().split('T')[0],
    hora: '09:30',
    notas: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [occupiedHours, setOccupiedHours] = useState([]);
  const [loadingHours, setLoadingHours] = useState(false);

  React.useEffect(() => {
    async function checkAvailability() {
      if (!formData.fecha) return;
      setLoadingHours(true);
      try {
        const { data, error } = await supabase
          .from('citas')
          .select('hora')
          .eq('fecha', formData.fecha)
          .neq('estado', 'cancelada');
        
        if (!error && data) {
          setOccupiedHours(data.map(c => c.hora.substring(0, 5)));
        }
      } catch (err) {
        console.error('Error al verificar disponibilidad:', err);
      } finally {
        setLoadingHours(false);
      }
    }
    checkAvailability();
  }, [formData.fecha]);

  const selectedServiceObj = SERVICIOS.find(s => s.nombre === formData.servicio) || SERVICIOS[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('citas').insert([{
        nombre: formData.nombre.trim(),
        telefono: formData.telefono.trim(),
        email: formData.email.trim(),
        servicio: formData.servicio,
        fecha: formData.fecha,
        hora: formData.hora,
        monto: selectedServiceObj.precio,
        pago_estado: 'pendiente',
        notas: formData.notas.trim() ? `Profesional: ${formData.profesional} | RUT: ${formData.rut} | Reserva online: ${formData.notas.trim()}` : `Profesional: ${formData.profesional} | RUT: ${formData.rut} | Reserva online`,
        estado: 'pendiente'
      }]);

      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      alert('Error al agendar tu cita: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      nombre: '',
      rut: '',
      telefono: '',
      email: '',
      servicio: SERVICIOS[0].nombre,
      profesional: 'Soledad',
      fecha: new Date().toISOString().split('T')[0],
      hora: '09:30',
      notas: ''
    });
    setSuccess(false);
  };

  return (
    <section className="py-20 bg-surface-container overflow-hidden" id="booking">
      <div className="max-w-[1140px] mx-auto px-6">
        <div className="bg-surface rounded-3xl overflow-hidden shadow-xl border border-outline-subtle/40 flex flex-col md:flex-row">
          
          {/* Info Side */}
          <div className="md:w-5/12 p-8 md:p-12 bg-primary text-white flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest text-white/80 font-bold block mb-2">Agendamiento Digital</span>
              <h2 className="font-headline text-2xl md:text-3xl font-bold mb-4">Reserva tu Sesión</h2>
              <p className="text-xs md:text-sm text-white/90 mb-8 leading-relaxed">
                Selecciona el servicio y la fecha que más te acomode. Tu cita quedará ingresada directamente en nuestro sistema clínico.
              </p>

              <div className="space-y-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-primary-container" />
                  </div>
                  <div>
                    <p className="font-semibold">Consulta Clínica</p>
                    <p className="text-white/70">{CONTACTO.direccion}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-primary-container" />
                  </div>
                  <div>
                    <p className="font-semibold">Horario de Atención</p>
                    <p className="text-white/70">{CONTACTO.horario}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-primary-container" />
                  </div>
                  <div>
                    <p className="font-semibold">Contacto</p>
                    <p className="text-white/70">{CONTACTO.telefono}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <a
                href={`https://wa.me/${CONTACTO.telefonoWhatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-full hover:brightness-110 transition text-xs font-semibold shadow"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Consultas directas por WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Form Side */}
          <div className="md:w-7/12 p-8 md:p-12 bg-white">
            {success ? (
              <div className="p-8 rounded-2xl bg-green-50 border border-green-200 text-green-900 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-green-500 text-white flex items-center justify-center shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-headline font-bold text-xl text-green-900">¡Cita Agendada con Éxito!</h3>
                <p className="text-xs text-green-800 leading-relaxed max-w-md mx-auto">
                  Muchas gracias <strong>{formData.nombre}</strong>. Hemos registrado tu reserva para <strong>{formData.servicio}</strong> el día <strong>{formatFecha(formData.fecha)}</strong> a las <strong>{formData.hora} hrs</strong>.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
                  <button
                    onClick={handleReset}
                    className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-semibold shadow hover:bg-primary-dark transition"
                  >
                    Agendar otra cita
                  </button>
                  <a
                    href={`https://wa.me/${CONTACTO.telefonoWhatsapp}?text=${encodeURIComponent(`Hola! Acabo de agendar una cita para ${formData.servicio} el día ${formData.fecha} a nombre de ${formData.nombre}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 bg-[#25D366] text-white rounded-xl text-xs font-semibold shadow hover:brightness-105 transition flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Confirmar por WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre Completo *</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        placeholder="Tu nombre y apellido"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">RUT *</label>
                    <div className="relative">
                      <FileText className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={formData.rut}
                        onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                        placeholder="12.345.678-9"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Teléfono / WhatsApp *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <input
                        type="tel"
                        inputMode="numeric"
                        required
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value.replace(/\D/g, '').slice(0, 12) })}
                        placeholder="56912345678"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Correo Electrónico *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="tu@correo.cl"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Tratamiento / Servicio *</label>
                  <select
                    value={formData.servicio}
                    onChange={(e) => setFormData({ ...formData, servicio: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-xs"
                  >
                    {SERVICIOS.map((s) => (
                      <option key={s.id} value={s.nombre}>
                        {s.nombre} — {formatCLP(s.precio)} ({s.duracion} min)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Profesional Preferida *</label>
                  <select
                    value={formData.profesional}
                    onChange={(e) => setFormData({ ...formData, profesional: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-xs"
                  >
                    {PROFESIONALES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Fecha Preferida *</label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.fecha}
                      onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Horario Sugerido *</label>
                    <select
                      value={formData.hora}
                      onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-xs disabled:opacity-50"
                      disabled={loadingHours}
                    >
                      {loadingHours ? (
                        <option value="">Verificando disponibilidad...</option>
                      ) : (
                        ['09:30', '10:15', '11:00', '11:45', '12:30'].map(hora => {
                          const isOccupied = occupiedHours.includes(hora);
                          return (
                            <option 
                              key={hora} 
                              value={hora} 
                              disabled={isOccupied}
                            >
                              {hora} AM {isOccupied ? '(Ocupado)' : ''}
                            </option>
                          );
                        })
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Motivo de Consulta o Molestia Principal</label>
                  <textarea
                    rows={2}
                    value={formData.notas}
                    onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                    placeholder="Cuéntanos brevemente tu molestia (ej: dolor lumbar, migrañas, insomnio)..."
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-xs resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-secondary hover:opacity-90 text-white font-semibold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-md transition flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Registrando Reserva...</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      <span>Confirmar Reserva de Cita</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
