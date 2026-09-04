import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Lock, Mail, ArrowRight, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/admin');
    });
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        if (error.message.includes('Email not confirmed') || error.code === 'email_not_confirmed') {
          setErrorMsg('El correo electrónico aún no ha sido confirmado. Verifica tu bandeja de entrada o confirma el usuario en Supabase Dashboard (Auth > Users).');
        } else if (error.message.includes('Invalid login credentials') || error.code === 'invalid_credentials') {
          setErrorMsg('Correo o contraseña incorrectos. Por favor verifica tus credenciales.');
        } else {
          setErrorMsg(error.message);
        }
      } else if (data.session) {
        navigate('/admin');
      }
    } catch (err) {
      setErrorMsg('Error al conectar con el servidor. Verifica tu conexión a internet e intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7ee] font-body text-[#1b1c18] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-200/80 overflow-hidden">
        {/* Header */}
        <div className="bg-[#4d6447] text-white p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl overflow-hidden shadow-inner">
            <img src="/images/logo-medpuntos.jpg" alt="Med Puntos" className="w-full h-full object-cover" />
          </div>
          <h1 className="font-headline text-2xl font-bold">MedPuntos</h1>
          <p className="text-white/80 text-xs mt-1">Portal Clínico & Fichas Médicas</p>
        </div>

        {/* Login Form */}
        <div className="p-8 space-y-6">
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <p className="font-medium">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                {/* Campos ocultos para engañar al autocompletado de Chrome */}
                <input type="email" name="fake-email-autofill" style={{ display: 'none' }} aria-hidden="true" />
                <input type="password" name="fake-password-autofill" style={{ display: 'none' }} aria-hidden="true" />
                
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="email"
                  name="email-login-medpuntos"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@medpuntos.cl"
                  autoComplete="off"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-[#4d6447] focus:ring-2 focus:ring-[#4d6447]/20 outline-none text-xs bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-[#4d6447] focus:ring-2 focus:ring-[#4d6447]/20 outline-none text-xs bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4d6447] hover:bg-[#3d5038] text-white font-semibold py-3.5 rounded-xl shadow-md hover:shadow-lg transition active:scale-[0.99] flex items-center justify-center gap-2 text-xs uppercase tracking-wider disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Validando Credenciales...</span>
                </>
              ) : (
                <>
                  <span>Ingresar al Sistema</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-gray-100 text-center">
            <Link
              to="/"
              className="text-xs text-gray-500 hover:text-[#4d6447] transition inline-flex items-center gap-1.5 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver al sitio web principal</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
