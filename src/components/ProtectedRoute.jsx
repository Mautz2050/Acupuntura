import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7ee] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#4d6447] animate-spin" />
        <p className="text-xs text-gray-600 font-medium">Cargando portal médico...</p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
