# 🏥 MedPuntos — Sistema de Gestión Clínica & Acupuntura en React

Aplicación web completa construida con **React**, **Vite**, **Tailwind CSS**, **Lucide Icons** y **Supabase**.

---

## 🚀 Cómo ejecutar la aplicación en desarrollo

1. Abre tu terminal en esta carpeta (`MedPuntos-App`).
2. Instala las dependencias (si aún no están instaladas):
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abre tu navegador en:
   - **Sitio Web Público y Reservas:** `http://localhost:5173/`
   - **Portal Médico y Fichas Clínicas:** `http://localhost:5173/admin/login`

---

## 📋 Credenciales del Panel Médico

- **Email:** `
- **Contraseña:** ``

---

## 🗄️ Base de datos Supabase

El esquema de la base de datos se encuentra en `.
Pega y ejecuta ese script en tu panel de Supabase (**SQL Editor > New Query > Run**).

---

## 🌐 Estructura de Vistas (Rutas)

- `/` : Sitio Web Público con catálogo de tratamientos (CLP), bio de la especialista y formulario de agendamiento online en vivo.
- `/admin/login` : Inicio de sesión seguro con Supabase Auth.
- `/admin` : Dashboard con métricas diarias, agenda del día y accesos rápidos.
- `/admin/citas` : Gestión de agenda con filtros por fecha y estado, más agendamiento manual.
- `/admin/pacientes` : Directorio de pacientes con buscador en tiempo real.
- `/admin/pacientes/:id` : Ficha clínica digital con historial de sesiones TCM, recetas, exámenes adjuntos e impresión de reportes.
