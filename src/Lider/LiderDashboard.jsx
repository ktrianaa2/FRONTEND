import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LiderDashboard = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('userData'));

  useEffect(() => {
    if (!userData || userData.rol !== 2) {
      navigate('/');
    }
  }, [navigate, userData]);

  if (!userData) return null;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body text-center">
              <h1 className="display-4">Bienvenido {userData.nombre_usuario}, Líder</h1>
              <p className="lead">Panel de liderazgo</p>
              {/* Aquí puedes agregar más contenido específico para líderes */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiderDashboard;