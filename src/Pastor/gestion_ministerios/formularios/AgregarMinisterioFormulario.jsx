import React, { useState, useEffect } from "react";
import { notification } from "antd";
import API_URL from "../../../../Config";

function AgregarMinisterioFormulario({ onClose }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [lideres, setLideres] = useState([]);
  const [selectedLider, setSelectedLider] = useState("");
  const [availableLideres, setAvailableLideres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Configuración inicial de Ant Design Notification
  const [api, contextHolder] = notification.useNotification();

  // Obtener lista de líderes disponibles al cargar el componente
  useEffect(() => {
    const fetchLideres = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No se encontró token de autenticación');
        }

        const response = await fetch(`${API_URL}/Miembros/personas/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al obtener los líderes');
        }

        const data = await response.json();
        setAvailableLideres(data.personas);
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

    fetchLideres();
  }, [api]);

  const handleAddLider = () => {
    if (selectedLider && !lideres.includes(selectedLider) && lideres.length < 2) {
      setLideres([...lideres, selectedLider]);
      setSelectedLider("");
    }
  };

  const handleRemoveLider = (liderId) => {
    setLideres(lideres.filter((id) => id !== liderId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('descripcion', descripcion);

      lideres.forEach((liderId, index) => {
        formData.append(`id_persona_lider${index + 1}`, liderId);
      });

      const response = await fetch(`${API_URL}/Ministerio/crearministerios/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Manejo específico de errores conocidos del backend
        if (responseData.error) {
          if (response.status === 400 && responseData.error.includes("Ya existe un ministerio con este nombre")) {
            api.warning({
              message: 'Ministerio existente',
              description: responseData.error,
              duration: 5,
            });
            return;
          }

          if (response.status === 403) {
            api.error({
              message: 'Permisos insuficientes',
              description: responseData.error,
              duration: 5,
            });
            return;
          }

          if (response.status === 401) {
            api.error({
              message: 'Autenticación fallida',
              description: responseData.error,
              duration: 5,
            });
            return;
          }

          // Error genérico del backend
          throw new Error(responseData.error);
        }

        // Error sin mensaje específico
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Éxito
      api.success({
        message: 'Éxito',
        description: responseData.mensaje || 'Ministerio creado correctamente',
        duration: 3,
      });

      onClose();

    } catch (err) {
      api.error({
        message: 'Error',
        description: err.message,
        duration: 5,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center my-4">Cargando líderes disponibles...</div>;
  }

  return (
    <div className="card shadow-lg border-0">
      {contextHolder}
      <div className="card-header bg-dark text-white py-3">
        <h5 className="mb-0 fw-bold"><i className="bi bi-building-fill me-2"></i>Agregar Nuevo Ministerio</h5>
      </div>
      <div className="card-body bg-light">
        <form onSubmit={handleSubmit} className="p-2">
          <div className="mb-3 g-3">
            <label htmlFor="nombre" className="form-label fw-bold text-dark">
              Nombre del Ministerio <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-dark text-white"><i className="bi bi-building"></i></span>
              <input
                type="text"
                className="form-control"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                disabled={submitting}
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="descripcion" className="form-label fw-bold text-dark">
              Descripción <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-dark text-white"><i className="bi bi-file-earmark-text"></i></span>
              <textarea
                className="form-control"
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
                disabled={submitting}
              />
            </div>
          </div>

          <div className="mb-3 g-3">
            <label className="form-label fw-bold text-dark">
              Líder(es) (Máximo 2)
            </label>
            <div className="d-flex justify-content-between">
              <select
                className="form-select w-75"
                value={selectedLider}
                onChange={(e) => setSelectedLider(e.target.value)}
                disabled={lideres.length >= 2 || submitting}
              >
                <option value="">Seleccionar líder</option>
                {availableLideres.map((persona) => (
                  <option key={persona.id_persona} value={persona.id_persona}>
                    {persona.nombres} {persona.apellidos}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-success ms-2"
                onClick={handleAddLider}
                disabled={!selectedLider || lideres.length >= 2 || submitting}
              >
                +
              </button>
            </div>

            <div className="mt-2">
              {lideres.length > 0 && (
                <ul className="list-group">
                  {lideres.map((liderId) => {
                    const lider = availableLideres.find(p => p.id_persona == liderId);
                    return (
                      <li
                        key={liderId}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        {lider ? `${lider.nombres} ${lider.apellidos}` : `ID: ${liderId}`}
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemoveLider(liderId)}
                          disabled={submitting}
                        >
                          &times;
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn btn-success text-white"
              disabled={submitting}
            >
              {submitting ? 'Guardando...' : 'Agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

}

export default AgregarMinisterioFormulario;