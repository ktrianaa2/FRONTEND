import { useState, useEffect } from "react";
import TablaMiembros from "./Tabla/TablaMiembros";
import FormularioMiembro from "./Formularios/FormularioMiembro";
import API_URL from "../../../Config";

function AdministrarMiembros() {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const fetchPersonas = async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('No hay sesión activa');
        setLoading(false);
        return;
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
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonas();
  }, []);

  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
  };

  return (
    <div className="container-fluid py-4">
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
          onSuccess={fetchPersonas} 
        />
      ) : (
        <TablaMiembros 
          personas={personas} 
          onRefreshData={fetchPersonas} 
        />
      )}
    </div>
  );
}

export default AdministrarMiembros;
