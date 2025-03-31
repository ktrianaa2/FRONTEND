import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './Principal/Login';
import PastorDashboard from './Pastor/PastorDashboard';
import LiderDashboard from './Lider/LiderDashboard';
import ProtectedRoute from './Principal/ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';

const HistoryBlocker = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    // Bloquear historial solo si no hay sesión activa (token)
    if (!token) {
      window.history.pushState(null, null, window.location.href);
      window.onpopstate = () => {
        window.history.pushState(null, null, window.location.href);
        navigate('/', { replace: true });
      };
    } else {
      // Si el token existe y es válido, no bloquear el historial
      window.onpopstate = null; // Dejar la navegación sin restricciones
    }

    return () => {
      window.onpopstate = null; // Limpiar al desmontar el componente
    };
  }, [navigate, token]);

  return null;
};

function App() {
  return (
    <Router>
      <HistoryBlocker />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/pastor/*"
          element={
            <ProtectedRoute requiredRole={1}>
              <PastorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lider"
          element={
            <ProtectedRoute requiredRole={2}>
              <LiderDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;