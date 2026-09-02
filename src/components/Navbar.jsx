import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Calendar } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="w-full sticky top-0 z-50 bg-surface/95 backdrop-blur-md shadow-sm border-b border-outline-subtle/30">
      <div className="max-w-[1140px] mx-auto px-6 flex justify-between items-center h-20">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-11 h-11 rounded-xl overflow-hidden shadow-sm group-hover:scale-105 transition shrink-0">
            <img src="/images/logo-medpuntos.jpg" alt="Med Puntos" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="font-headline text-2xl text-primary font-bold tracking-tight block leading-none">MedPuntos</span>
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold">Acupuntura & Estética Coreana</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#services" className="text-on-surface-variant hover:text-primary transition-colors">Servicios</a>
          <a href="#about" className="text-on-surface-variant hover:text-primary transition-colors">Especialista</a>
          <a href="#process" className="text-on-surface-variant hover:text-primary transition-colors">Método</a>
          <a href="#faq" className="text-on-surface-variant hover:text-primary transition-colors">Preguntas</a>
          <Link to="/admin" className="text-tertiary hover:text-tertiary/80 flex items-center gap-1.5 font-semibold py-1 px-3 rounded-lg hover:bg-tertiary/5 transition">
            <Lock className="w-4 h-4" />
            <span>Portal Médico</span>
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#booking"
            className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider shadow-md hover:shadow-lg transition active:scale-95 flex items-center gap-2"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Agendar Cita</span>
          </a>
        </div>
      </div>
    </header>
  );
}
