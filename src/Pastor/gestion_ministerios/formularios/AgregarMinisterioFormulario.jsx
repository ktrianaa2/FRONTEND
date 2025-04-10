import React, { useState, useEffect } from "react";
import { notification } from "antd";
import API_URL from "../../../../Config";
import "../../../Styles/Formulario.css";

function AgregarMinisterioFormulario({ onClose, api }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [lideres, setLideres] = useState([]);
  const [selectedLider, setSelectedLider] = useState("");
  const [availableLideres, setAvailableLideres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

      onClose(true);

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
    <div className="formulario-card">
      <div className="formulario-header">
        <h5 className="formulario-titulo">
          <i className="bi bi-building-fill me-2"></i>Agregar Nuevo Ministerio
        </h5>
      </div>
      <div className="formulario-body">
        <form onSubmit={handleSubmit}>
          <div className="formulario-campo">
            <label htmlFor="nombre" className="formulario-label">
              Nombre del Ministerio <span className="text-danger">*</span>
            </label>
            <div className="formulario-input-group">
              <span className="formulario-input-group-text">
                <i className="bi bi-building"></i>
              </span>
              <input
                type="text"
                className="formulario-input"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                disabled={submitting}
              />
            </div>
          </div>

          <div className="formulario-campo">
            <label htmlFor="descripcion" className="formulario-label">
              Descripción <span className="text-danger">*</span>
            </label>
            <div className="formulario-input-group">
              <span className="formulario-input-group-text">
                <i className="bi bi-file-earmark-text"></i>
              </span>
              <textarea
                className="formulario-input"
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
                disabled={submitting}
              />
            </div>
          </div>

          <div className="formulario-campo">
            <label className="formulario-label">
              Líder(es) (Máximo 2)
            </label>
            <div className="contenedor-select-boton">
              <select
                className="formulario-input formulario-select"
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
                className="btn-guardar"
                onClick={handleAddLider}
                disabled={!selectedLider || lideres.length >= 2 || submitting}
              >
                +
              </button>
            </div>

            <div className="lista-lideres">
              {lideres.length > 0 && (
                <ul className="lista-lideres-ul">
                  {lideres.map((liderId) => {
                    const lider = availableLideres.find(p => p.id_persona == liderId);
                    return (
                      <li
                        key={liderId}
                        className="item-lider"
                      >
                        {lider ? `${lider.nombres} ${lider.apellidos}` : `ID: ${liderId}`}
                        <button
                          type="button"
                          className="btn-cancelar"
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
            {lideres.length >= 2 && (
              <small className="text-muted">Máximo 2 líderes permitidos</small>
            )}
          </div>

          <div className="formulario-acciones">
            <button
              type="button"
              className="btn-cancelar"
              onClick={onClose}
              disabled={submitting}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn-guardar"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner"></span>
                  Guardando...
                </>
              ) : (
                <>
                  Agregar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

}

export default AgregarMinisterioFormulario;