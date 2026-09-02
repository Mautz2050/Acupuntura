import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingSection from '../components/BookingSection';
import { SERVICIOS, PAQUETES, CONTACTO, formatCLP } from '../lib/supabase';
import { 
  Sparkles, 
  Award, 
  BookOpen, 
  Brain, 
  Flame, 
  Activity, 
  Wind,
  Stethoscope,
  ChevronRight,
  MessageCircle
} from 'lucide-react';

const EQUIPO = [
  { nombre: 'Soledad Menares', foto: '/images/dra-soledad-menares.jpg', rol: 'Acupuntora' },
  { nombre: 'Lorena Olivares', foto: '/images/lorena-olivares.jpg', rol: 'Acupuntora' },
  { nombre: 'Paola Soto', foto: '/images/paola-soto.jpg', rol: 'Acupuntora' },
];

export default function HomePage() {
  const serviceIcons = {
    'Rejuvenecimiento Facial Coreano': Sparkles,
    'Acupuntura General': Stethoscope,
    'Moxibustión': Flame,
    'Ventosa / Masaje Tui Na': Activity,
    'Auriculoterapia': BookOpen,
    'Tratamiento de Edemas': Wind,
    'Problemas Digestivos y Alergias': Brain,
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative min-h-[750px] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#eef0dd] via-[#fbfbe2] to-[#e4e8cf]">
            <img
              src="/images/logo-medpuntos.jpg"
              alt=""
              aria-hidden="true"
              className="absolute -right-24 -top-24 w-[520px] h-[520px] object-cover rounded-full opacity-10 pointer-events-none select-none"
            />
          </div>

          <div className="max-w-[1140px] mx-auto px-6 relative z-10 w-full">
            <div className="max-w-2xl fade-in-up">
              <span className="px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-xs uppercase tracking-wider inline-flex items-center gap-1.5 mb-4 border border-primary/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Medicina Tradicional China & Acupuntura Clínica</span>
              </span>
              
              <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl text-on-surface mb-5 font-bold leading-tight">
                Equilibrio natural para cuerpo, mente y energía
              </h1>
              
              <p className="text-base md:text-lg text-on-surface-variant mb-8 max-w-lg leading-relaxed">
                Recupera tu vitalidad y alivio a través de técnicas milenarias aplicadas con rigor médico, fichas digitales y calidez humana.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="#booking" 
                  className="bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider text-center shadow-lg transition active:scale-95"
                >
                  Reservar Cita Online
                </a>
                <a 
                  href="#services" 
                  className="border border-tertiary text-tertiary px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider text-center hover:bg-tertiary hover:text-white transition"
                >
                  Conocer Tratamientos
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* NUESTRO EQUIPO */}
        <section className="py-20 bg-surface" id="about">
          <div className="max-w-[1140px] mx-auto px-6">
            <div className="text-center mb-14">
              <span className="text-xs text-secondary uppercase tracking-widest block mb-2 font-bold">Atención Personalizada</span>
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface mb-4">Nuestro Equipo</h2>
              <p className="text-sm text-on-surface-variant max-w-xl mx-auto leading-relaxed">
                Combinamos el conocimiento ancestral de la Medicina Tradicional China con un enfoque clínico riguroso y fichas digitales de seguimiento continuo.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-14">
              {EQUIPO.map((persona) => (
                <div key={persona.nombre} className="text-center">
                  <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-lg border border-outline-subtle/30 mb-4">
                    <img
                      className="w-full h-full object-cover"
                      src={persona.foto}
                      alt={persona.nombre}
                    />
                  </div>
                  <h3 className="font-headline text-lg font-bold text-on-surface">{persona.nombre}</h3>
                  <p className="text-xs uppercase tracking-widest text-tertiary font-semibold">{persona.rol}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Acupuntura & Selección Precisa de Puntos</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Fichas Clínicas Digitales con Seguimiento</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Estética Coreana & Bienestar</span>
              </div>
            </div>
          </div>
        </section>

        {/* CATÁLOGO DE SERVICIOS */}
        <section className="py-20 bg-surface-container-low" id="services">
          <div className="max-w-[1140px] mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface mb-3">Servicios Terapéuticos</h2>
              <p className="text-sm text-on-surface-variant max-w-xl mx-auto">
                Técnicas especializadas diseñadas para restaurar el flujo vital de energía (Qi) y promover una salud duradera.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SERVICIOS.map((s) => {
                const IconComponent = serviceIcons[s.nombre] || Sparkles;
                return (
                  <div 
                    key={s.id}
                    className="bg-surface p-7 rounded-2xl transition duration-300 hover:bg-white hover:shadow-xl border border-outline-subtle/30 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="w-12 h-12 mb-5 rounded-2xl bg-tertiary/10 text-tertiary flex items-center justify-center group-hover:scale-110 transition">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <h3 className="font-headline text-lg font-bold text-on-surface mb-2">{s.nombre}</h3>
                      <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">{s.desc}</p>
                    </div>

                    <div className="flex justify-between items-center border-t border-outline-subtle/40 pt-4">
                      <div>
                        <span className="inline-block font-bold text-sm text-white bg-secondary px-3 py-1 rounded-full shadow-sm">{formatCLP(s.precio)}</span>
                        <span className="text-[10px] text-gray-400 font-semibold block mt-1.5">{s.duracion} minutos</span>
                      </div>
                      <a 
                        href="#booking" 
                        className="text-xs text-tertiary font-semibold hover:underline flex items-center gap-1 group-hover:translate-x-1 transition"
                      >
                        <span>Agendar</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* PAQUETES Y PROMOCIONES */}
        <section className="py-16 bg-surface" id="packages">
          <div className="max-w-[1140px] mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="font-headline text-2xl md:text-3xl font-bold text-on-surface mb-2">Paquetes y Ciclos de Tratamiento</h2>
              <p className="text-xs text-on-surface-variant max-w-lg mx-auto">
                Ahorra realizando tu tratamiento por ciclo de sesiones. Paquetes válidos por 3 meses.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {PAQUETES.map((p, i) => (
                <div key={i} className="bg-surface-container-low p-5 rounded-2xl border border-outline-subtle/30">
                  <h4 className="font-bold text-sm text-on-surface mb-1">{p.nombre}</h4>
                  <p className="text-xs text-on-surface-variant mb-3">{p.detalle}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-headline text-base font-bold text-white bg-secondary px-3 py-1 rounded-full shadow-sm">{formatCLP(p.precio)}</span>
                    {p.ahorro && (
                      <span className="text-[10px] text-green-700 font-semibold bg-green-100 px-2 py-1 rounded-full">Ahorras {formatCLP(p.ahorro)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-[11px] text-on-surface-variant mt-8">
              Formas de pago: efectivo o transferencia bancaria · Seña o mitad al iniciar, el resto se puede dividir.
            </p>
          </div>
        </section>

        {/* METODOLOGÍA */}
        <section className="py-20 bg-surface" id="process">
          <div className="max-w-[1140px] mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface mb-3">Tu Camino hacia la Sanación</h2>
              <p className="text-sm text-on-surface-variant max-w-xl mx-auto">
                Un proceso clínico riguroso con seguimiento continuo en tu ficha personalizada.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-sm">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 text-primary font-bold text-xl flex items-center justify-center">01</div>
                <h4 className="font-bold text-sm mb-1">Reserva Online</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Elige tu horario conveniente en nuestro sistema digital.</p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-sm">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 text-primary font-bold text-xl flex items-center justify-center">02</div>
                <h4 className="font-bold text-sm mb-1">Diagnóstico TCM</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Evaluación de pulso, lengua y anamnesis clínica completa.</p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-sm">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 text-primary font-bold text-xl flex items-center justify-center">03</div>
                <h4 className="font-bold text-sm mb-1">Sesión Terapéutica</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Aplicación de acupuntura y técnicas en ambiente tranquilo.</p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-sm">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 text-primary font-bold text-xl flex items-center justify-center">04</div>
                <h4 className="font-bold text-sm mb-1">Ficha & Evolución</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Registro histórico de sesiones, recetas y evolución clínica.</p>
              </div>
            </div>
          </div>
        </section>

        {/* PREGUNTAS FRECUENTES */}
        <section className="py-16 bg-surface-container-low" id="faq">
          <div className="max-w-2xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="font-headline text-2xl md:text-3xl font-bold text-on-surface mb-2">Preguntas Frecuentes</h2>
              <p className="text-xs text-on-surface-variant">Resolvemos tus dudas para que asistas con total tranquilidad.</p>
            </div>

            <div className="space-y-3">
              <details className="bg-white rounded-2xl p-5 border border-outline-subtle/30 text-sm">
                <summary className="font-semibold text-on-surface cursor-pointer list-none flex justify-between items-center">
                  <span>¿Duele la aplicación de agujas de acupuntura?</span>
                  <ChevronRight className="w-4 h-4 text-primary" />
                </summary>
                <p className="mt-3 text-xs text-gray-600 leading-relaxed">
                  No. Las agujas de acupuntura son ultrafinas (como un cabello) y de acero quirúrgico estéril desechable. La mayoría de los pacientes solo siente una leve sensación de pesadez o relajación profunda.
                </p>
              </details>

              <details className="bg-white rounded-2xl p-5 border border-outline-subtle/30 text-sm">
                <summary className="font-semibold text-on-surface cursor-pointer list-none flex justify-between items-center">
                  <span>¿Cuántas sesiones se recomiendan?</span>
                  <ChevronRight className="w-4 h-4 text-primary" />
                </summary>
                <p className="mt-3 text-xs text-gray-600 leading-relaxed">
                  Depende del cuadro clínico: problemas agudos suelen requerir de 3 a 5 sesiones, mientras que afecciones crónicas toman de 6 a 10 sesiones con seguimiento en tu ficha digital.
                </p>
              </details>

              <details className="bg-white rounded-2xl p-5 border border-outline-subtle/30 text-sm">
                <summary className="font-semibold text-on-surface cursor-pointer list-none flex justify-between items-center">
                  <span>¿Puedo solicitar boleta de atención de salud?</span>
                  <ChevronRight className="w-4 h-4 text-primary" />
                </summary>
                <p className="mt-3 text-xs text-gray-600 leading-relaxed">
                  Sí, emitimos boleta de atención de salud para que puedas presentarla para reembolso en tu seguro complementario o Isapre.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* COMPONENTE DE AGENDAMIENTO REAL */}
        <BookingSection />
      </main>

      <Footer />

      {/* Floating WhatsApp */}
      <a
        href={`https://wa.me/${CONTACTO.telefonoWhatsapp}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition flex items-center justify-center"
        title="Contactar por WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
}
