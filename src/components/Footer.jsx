import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, MapPin, Clock, Phone, Mail, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface-container-low pt-14 pb-8 border-t border-outline-subtle/30 text-xs">
      <div className="max-w-[1140px] mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary text-2xl">medical_services</span>
            <span className="font-headline text-lg text-primary font-bold">MedPuntos</span>
          </div>
          <p className="text-on-surface-variant text-xs leading-relaxed mb-4">
            Medicina Integral y Acupuntura para el equilibrio del ser humano. Fusión de tradición milenaria, ciencia y seguimiento clínico.
          </p>
          <div className="flex items-center gap-2 text-green-700 font-semibold text-[11px]">
            <ShieldCheck className="w-4 h-4" />
            <span>Ficha Clínica Digital Segura</span>
          </div>
        </div>

        <div>
          <h4 className="font-bold uppercase tracking-wider text-on-surface mb-3 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-primary" />
            <span>Horario de Atención</span>
          </h4>
          <p className="text-gray-600 mb-1">Lunes a Viernes: 09:00 - 18:00 hrs</p>
          <p className="text-gray-600 mb-1">Sábados: Previa coordinación</p>
          <p className="text-gray-400">Domingos: Cerrado</p>
        </div>

        <div>
          <h4 className="font-bold uppercase tracking-wider text-on-surface mb-3 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-primary" />
            <span>Ubicación & Contacto</span>
          </h4>
          <p className="text-gray-600 mb-1">Santiago, Chile</p>
          <p className="text-gray-600 mb-1">soledadmenares@gmail.com</p>
          <p className="text-gray-600">+56 9 1234 5678</p>
        </div>

        <div>
          <h4 className="font-bold uppercase tracking-wider text-on-surface mb-3">Acceso al Sistema</h4>
          <ul className="space-y-2 text-gray-600">
            <li><a href="#services" className="hover:text-primary transition">Tratamientos</a></li>
            <li><a href="#booking" className="hover:text-primary transition">Agendar Cita Online</a></li>
            <li>
              <Link to="/admin" className="font-bold text-tertiary hover:underline inline-flex items-center gap-1.5 p-1 rounded hover:bg-tertiary/10 transition">
                <Lock className="w-3.5 h-3.5" />
                <span>Portal Médico / Admin</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1140px] mx-auto px-6 mt-10 pt-6 border-t border-outline-subtle/20 text-center text-gray-400 text-[11px]">
        © 2026 MedPuntos Clínica de Acupuntura & Medicina Tradicional China. Todos los derechos reservados.
      </div>
    </footer>
  );
}
