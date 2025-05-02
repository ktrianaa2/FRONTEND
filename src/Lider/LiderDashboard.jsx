import { useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import API_URL from '../../Config';
import LiderMenu from './LiderMenu';
import LiderNav from './LiderNav';
import LiderNotificationes from './LiderNotificationes';
import LiderPanel from './LiderPanel';
import AdministrarMisMinisterios from '../Pastor/administrar_ministerios/AdministrarMisMinisterios';
import CalendarioActividades from '../Pastor/calendario_actividades/CalendarioActividades';
import AdministrarReportes from "../Reportes/ReporteInicio";

const LiderDashboard = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('userData'));

  useEffect(() => {
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, null, window.location.href);
    };

    return () => {
      window.onpopstate = null;
    };
  }, []);

  useEffect(() => {
    if (!userData || userData.rol !== 2) {
      navigate('/', { replace: true });
    }
  }, [navigate, userData]);

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/Login/logout/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');

      // Redirigir y limpiar historial
      window.history.replaceState(null, '', '/');
      window.location.href = '/';
    }
  };

  if (!userData) return null;

  const usuario = userData.nombre_usuario; // Extraer nombre de usuario
  const nombreCompleto = `${userData.nombres} ${userData.apellidos}`;

  const handleNavigate = (view) => {
    const viewPathMap = {
      "panel": "/lider",
      "mis_ministerios": "/lider/citi_mis_ministerios",
      "calendario": "/lider/citi_calendario",
      "reportes": "/lider/citi_reportes"
    };

    navigate(viewPathMap[view] || "/lider");
  };

  return (
    <div className="container-fluid vh-100 bg-light">
      <div className="min-h-screen">
        <LiderNav onNavigate={handleNavigate} Usuario={nombreCompleto} />
        <div className="mx-2 pt-5 mt-4">
          <Routes>
            <Route index element={<LiderPanel onNavigate={handleNavigate} />} />
            <Route path="citi_mis_ministerios" element={<AdministrarMisMinisterios />} />
            <Route path="citi_calendario" element={<CalendarioActividades />} />
            <Route path="citi_reportes" element={<AdministrarReportes />} />
          </Routes>
        </div>
        <LiderNotificationes />
        <LiderMenu onNavigate={handleNavigate} Usuario={usuario} onLogout={handleLogout} />
      </div>
    </div>
  );
};

export default LiderDashboard;