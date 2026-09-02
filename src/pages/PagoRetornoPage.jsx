import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase, formatCLP, formatFecha, CONTACTO } from '../lib/supabase';
import { CheckCircle2, XCircle, Clock, Loader2, MessageCircle } from 'lucide-react';

// Flow puede tardar unos segundos en llamar a nuestro webhook (flow-confirm) y actualizar
// la base de datos, así que reintentamos la consulta unas cuantas veces antes de mostrar
// "pendiente" como estado final.
const REINTENTOS = 6;
const ESPERA_MS = 2500;

export default function PagoRetornoPage() {
  const [searchParams] = useSearchParams();
  const order = searchParams.get('order');
  const [cita, setCita] = useState(null);
  const [loading, setLoading] = useState(true);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    if (!order) {
      setLoading(false);
      return;
    }

    let cancelado = false;

    const consultar = async () => {
      const { data, error } = await supabase.rpc('get_estado_pago_cita', { p_id: order });
      if (cancelado) return;

      const fila = Array.isArray(data) ? data[0] : data;

      if (!error && fila) {
        setCita(fila);
        if (fila.pago_estado === 'pendiente' && intento < REINTENTOS) {
          setTimeout(() => setIntento((i) => i + 1), ESPERA_MS);
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    consultar();
    return () => { cancelado = true; };
  }, [order, intento]);

  const renderEstado = () => {
    if (!order) {
      return (
        <>
          <XCircle className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <h1 className="font-headline text-xl font-bold text-on-surface mb-2">No encontramos tu reserva</h1>
          <p className="text-sm text-on-surface-variant">Vuelve a la página principal para agendar o contáctanos directamente.</p>
        </>
      );
    }

    if (loading) {
      return (
        <>
          <Loader2 className="w-14 h-14 text-primary mx-auto mb-4 animate-spin" />
          <h1 className="font-headline text-xl font-bold text-on-surface mb-2">Confirmando tu pago...</h1>
          <p className="text-sm text-on-surface-variant">Esto puede tomar unos segundos.</p>
        </>
      );
    }

    if (!cita) {
      return (
        <>
          <XCircle className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <h1 className="font-headline text-xl font-bold text-on-surface mb-2">No pudimos verificar tu reserva</h1>
          <p className="text-sm text-on-surface-variant">Escríbenos por WhatsApp y lo revisamos al tiro.</p>
        </>
      );
    }

    if (cita.pago_estado === 'pagado') {
      return (
        <>
          <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
          <h1 className="font-headline text-xl font-bold text-on-surface mb-2">¡Pago confirmado!</h1>
          <p className="text-sm text-on-surface-variant mb-4">
            Tu sesión de <strong>{cita.servicio}</strong> el <strong>{formatFecha(cita.fecha)}</strong> a las <strong>{cita.hora?.slice(0, 5)} hrs</strong> quedó pagada por {formatCLP(cita.monto)}.
          </p>
        </>
      );
    }

    if (cita.pago_estado === 'rechazado' || cita.pago_estado === 'anulado') {
      return (
        <>
          <XCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
          <h1 className="font-headline text-xl font-bold text-on-surface mb-2">El pago no se completó</h1>
          <p className="text-sm text-on-surface-variant mb-4">Tu cita sigue reservada, pero el pago no pasó. Puedes pagar en el lugar o escribirnos para intentarlo de nuevo.</p>
        </>
      );
    }

    return (
      <>
        <Clock className="w-14 h-14 text-yellow-500 mx-auto mb-4" />
        <h1 className="font-headline text-xl font-bold text-on-surface mb-2">Pago pendiente</h1>
        <p className="text-sm text-on-surface-variant mb-4">Aún no recibimos la confirmación de Flow. Si ya pagaste, dinos por WhatsApp y lo revisamos.</p>
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-200/80 shadow-sm p-8 md:p-10 text-center">
          {renderEstado()}
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/"
              className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-semibold shadow hover:bg-primary-dark transition"
            >
              Volver al inicio
            </Link>
            <a
              href={`https://wa.me/${CONTACTO.telefonoWhatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 bg-[#25D366] text-white rounded-xl text-xs font-semibold shadow hover:brightness-105 transition flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Escribir por WhatsApp</span>
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
