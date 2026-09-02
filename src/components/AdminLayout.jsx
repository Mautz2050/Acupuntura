import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  ExternalLink,
  LogOut,
  Menu,
  X
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/citas', label: 'Agenda & Citas', icon: CalendarDays },
    { to: '/admin/pacientes', label: 'Fichas de Pacientes', icon: Users },
  ];

  return (
    <div className="bg-[#f7f7ee] min-h-screen flex flex-col md:flex-row text-[#1b1c18]">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#4d6447] text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-2xl">medical_services</span>
          <span className="font-headline font-bold text-lg">MedPuntos</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-white/10"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        ${mobileMenuOpen ? 'block' : 'hidden'} md:flex
        w-full md:w-64 bg-[#4d6447] text-white flex-col justify-between shrink-0 shadow-xl z-40
      `}>
        <div>
          <div className="p-6 border-b border-white/10 hidden md:flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <span className="material-symbols-outlined text-2xl">medical_services</span>
            </div>
            <div>
              <h2 className="font-headline text-lg font-bold leading-none">MedPuntos</h2>
              <span className="text-[11px] text-white/70">Panel Clínico TCM</span>
            </div>
          </div>

          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition
                  ${isActive
                    ? 'bg-white/20 text-white shadow-inner font-semibold'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'}
                `}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white font-medium text-sm transition"
            >
              <ExternalLink className="w-5 h-5" />
              <span>Ver Sitio Web</span>
            </a>
          </nav>
        </div>

        {/* User profile & logout */}
        <div className="p-4 border-t border-white/10">
          <div className="px-2 mb-3">
            <p className="text-xs text-white font-medium truncate">soledadmenares@gmail.com</p>
            <span className="text-[10px] text-white/60 uppercase tracking-wider font-semibold">Médico Administrador</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/40 text-red-100 text-xs font-semibold transition active:scale-[0.98] cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main View Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
}
