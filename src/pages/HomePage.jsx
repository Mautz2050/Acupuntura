import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingSection from '../components/BookingSection';
import { SERVICIOS, formatCLP } from '../lib/supabase';
import { 
  Sparkles, 
  Award, 
  BookOpen, 
  Brain, 
  Flame, 
  Activity, 
  HeartHandshake, 
  Baby, 
  Moon, 
  ChevronRight,
  HelpCircle,
  CheckCircle,
  MessageCircle
} from 'lucide-react';

const EQUIPO = [
  { nombre: 'Soledad Menares', foto: '/images/dra-soledad-menares.jpg', rol: 'Acupunturista' },
  { nombre: 'Lorena Olivares', foto: '/images/lorena-olivares.jpg', rol: 'Acupunturista' },
  { nombre: 'Paola Soto', foto: '/images/paola-soto.jpg', rol: 'Acupunturista' },
];

export default function HomePage() {
  const serviceIcons = {
    'Acupuntura General': Sparkles,
    'Moxibustión': Flame,
    'Cupping (Ventosas)': Activity,
    'Gestión del Dolor': HeartHandshake,
    'Fertilidad & Salud Femenina': Baby,
    'Estrés, Ansiedad y Sueño': Moon,
    'Evaluación y Diagnóstico TCM': BookOpen,
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative min-h-[750px] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div 
              className="w-full h-full bg-cover bg-center" 
              style={{ 
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC35hlaBm5LGYMgaSE81JtNKhMYP6g914rM76LT4OI5nvuomsm3wFcFLea7FWVfudfP-Hg5h6CRVICiBVaoCrbuASVBsmHq3ZtWIr7xg9UyDTX_sZjAqPjrU6cqiqMU9tQKrwFXhL0UgoCu-K3FYtNrcrIQp0aXSjHiCH-Jt9TkvKl5lJZ-JKb5NBhcVZapmD5w6a0BECgskPjm7eLOe5VBaa623nWeu9xcQ980rLHh78X2ribV-KVBCoSOvzsp5FoLH5NdWJTlqTZh')` 
              }} 
            />
            <div className="absolute inset-0 bg-[#fbfbe2]/70 backdrop-blur-[1px]" />
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
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface mb-4">Nuestro Equipo de Especialistas</h2>
              <p className="text-sm text-on-surface-variant max-w-xl mx-auto leading-relaxed">
                Combinamos el conocimiento ancestral de la Medicina Tradicional China con un enfoque clínico riguroso, calidez humana y fichas digitales de seguimiento continuo.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-14">
              {EQUIPO.map((persona) => (
                <div key={persona.nombre} className="text-center group">
                  <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-lg border border-outline-subtle/30 mb-4 bg-gray-100 group-hover:shadow-xl transition duration-300">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      src={persona.foto}
                      alt={persona.nombre}
                    />
                  </div>
                  <h3 className="font-headline text-lg font-bold text-on-surface mb-0.5">{persona.nombre}</h3>
                  <p className="text-xs uppercase tracking-widest text-primary font-semibold">{persona.rol}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Acupuntura Bioenergética & Selección Precisa</span>
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
                <span className="text-sm font-medium">Tratamiento Integral del Dolor & Bienestar</span>
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
                        <span className="font-bold text-sm text-primary block">{formatCLP(s.precio)}</span>
                        <span className="text-[10px] text-gray-400 font-semibold">{s.duracion} minutos</span>
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
        href="https://wa.me/56912345678"
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
