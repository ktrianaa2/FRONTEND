import { useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import API_URL from '../../Config';
import PastorMenu from './PastorMenu';
import PastorNav from './PastorNav';
import PastorPanel from './PastorPanel';
import AdministrarMiembros from "./gestion_miembros/AdministrarMiembros";
import AdministrarCurso from "./curso_biblico/AdministrarCursos";
import AdministrarFamiliasEvento from "./familias_evento/AdministrarFamiliasEvento";
import AdministrarDiezmos from "./gestion_diezmos/AdministrarDiezmos";
import AdministrarMinisterios from "./gestion_ministerios/AdministrarMinisterios";
import AdministrarEventos from "./gestion_eventos/AdministrarEventos";
import AdministrarReportes from "../Reportes/ReporteInicio";

const PastorDashboard = () => {
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
        if (!userData || userData.rol !== 1) {
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
            "panel": "/pastor",
            "miembros": "/pastor/citi_miembros",
            "ministerios": "/pastor/citi_ministerios",
            "eventos": "/pastor/citi_eventos",
            "diezmos": "/pastor/citi_diezmos",
            "curso": "/pastor/citi_curso",
            "familias": "/pastor/citi_familias",
            "reportes": "/pastor/citi_reportes"
        };

        navigate(viewPathMap[view] || "/pastor");
    };

    return (
        <div className="container-fluid vh-100 bg-light">
            <div className="min-h-screen">
                <PastorNav onNavigate={handleNavigate} Usuario={nombreCompleto} />
                <div className="mx-2 pt-5 mt-4">
                    <Routes>
                        <Route index element={<PastorPanel onNavigate={handleNavigate} />} />
                        <Route path="citi_miembros" element={<AdministrarMiembros />} />
                        <Route path="citi_ministerios" element={<AdministrarMinisterios />} />
                        <Route path="citi_eventos" element={<AdministrarEventos />} />
                        <Route path="citi_diezmos" element={<AdministrarDiezmos />} />
                        <Route path="citi_curso" element={<AdministrarCurso />} />
                        <Route path="citi_familias" element={<AdministrarFamiliasEvento />} />
                        <Route path="citi_reportes" element={<AdministrarReportes />} />
                    </Routes>

                </div>
                <PastorMenu onNavigate={handleNavigate} Usuario={usuario} onLogout={handleLogout} />
            </div>
        </div>
    );
};

export default PastorDashboard;
