import { useState, useEffect } from "react";
import { notification } from "antd";
import TablaMiembros from "./Tabla/TablaMiembros";
import FormularioMiembro from "./Formularios/FormularioMiembro";
import API_URL from "../../../Config";

function AdministrarMiembros() {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const fetchPersonas = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');

      if (!token) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch(`${API_URL}/Miembros/personas/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener los datos');
      }

      const data = await response.json();
      setPersonas(data.personas);
    } catch (err) {
      api.error({
        message: 'Error',
        description: err.message,
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonas();
  }, []);

  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
  };

  const handleSuccess = () => {
    fetchPersonas();
    toggleFormulario();
    api.success({
      message: 'Éxito',
      description: 'Miembro registrado correctamente',
      duration: 3,
    });
  };

  return (
    <div className="container-fluid py-4">
      {contextHolder}
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="text-primary">
              <i className="bi bi-people-fill me-2"></i>
              Administración de Miembros
            </h2>
            <button
              className="btn btn-success"
              onClick={toggleFormulario}
              disabled={loading}
            >
              <i className={`bi ${mostrarFormulario ? "bi-x-circle" : "bi-plus-circle"} me-1`}></i>
              {mostrarFormulario ? "Cancelar" : "Nuevo Miembro"}
            </button>
          </div>
        </div>
      </div>

      {mostrarFormulario ? (
        <FormularioMiembro
          onClose={toggleFormulario}
          onSuccess={handleSuccess}
        />
      ) : (
        <TablaMiembros
          personas={personas}
          loading={loading}
          onRefreshData={fetchPersonas}
        />
      )}
    </div>
  );
}

export default AdministrarMiembros;