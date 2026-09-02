import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PagoRetornoPage from './pages/PagoRetornoPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CitasPage from './pages/CitasPage';
import PacientesPage from './pages/PacientesPage';
import FichaClinicaPage from './pages/FichaClinicaPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Vista Pública */}
        <Route path="/" element={<HomePage />} />

        {/* Retorno de pago MercadoPago */}
        <Route path="/pago/retorno" element={<PagoRetornoPage />} />

        {/* Login de Administración */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Panel de Control Protegido */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/citas" 
          element={
            <ProtectedRoute>
              <CitasPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/pacientes" 
          element={
            <ProtectedRoute>
              <PacientesPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/pacientes/:id" 
          element={
            <ProtectedRoute>
              <FichaClinicaPage />
            </ProtectedRoute>
          } 
        />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
