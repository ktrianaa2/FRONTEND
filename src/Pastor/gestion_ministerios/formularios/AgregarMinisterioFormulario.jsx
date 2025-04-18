import React, { useState, useEffect, useRef } from "react";
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
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

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

  // Generar preview de la imagen seleccionada
  useEffect(() => {
    if (!imagen) {
      setPreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(imagen);

    return () => {
      reader.abort();
    };
  }, [imagen]);

  const handleAddLider = () => {
    if (selectedLider && !lideres.includes(selectedLider) && lideres.length < 2) {
      setLideres([...lideres, selectedLider]);
      setSelectedLider("");
    }
  };

  const handleRemoveLider = (liderId) => {
    setLideres(lideres.filter((id) => id !== liderId));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      api.error({
        message: 'Formato no válido',
        description: 'Solo se permiten imágenes JPEG, PNG o WEBP',
        duration: 5,
      });
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      api.error({
        message: 'Imagen demasiado grande',
        description: 'El tamaño máximo permitido es 5MB',
        duration: 5,
      });
      return;
    }

    setImagen(file);
  };

  const handleRemoveImage = () => {
    setImagen(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

      if (imagen) {
        formData.append('imagen', imagen);
      }

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

          throw new Error(responseData.error);
        }

        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

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
              Imagen del Ministerio
            </label>
            <div className="image-upload-container">
              {preview ? (
                <div className="position-relative" style={{ width: '150px', height: '150px' }}>
                  <img
                    src={preview}
                    alt="Preview"
                    className="img-thumbnail w-100 h-100 object-fit-cover"
                  />
                  <button
                    type="button"
                    className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 rounded-circle"
                    onClick={handleRemoveImage}
                    disabled={submitting}
                    style={{ width: '25px', height: '25px' }}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    type="button"
                    className="btn btn-outline-primary d-flex align-items-center gap-2"
                    onClick={() => fileInputRef.current.click()}
                    disabled={submitting}
                  >
                    <i className="bi bi-cloud-arrow-up"></i>
                    <span>Seleccionar Imagen</span>
                  </button>
                  <input
                    type="file"
                    id="imagen"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/jpeg, image/png, image/webp"
                    className="d-none"
                    disabled={submitting}
                  />
                  <small className="text-muted mt-2 d-block">
                    Formatos admitidos: JPEG, PNG, WEBP (Máx. 5MB)
                  </small>
                </div>
              )}
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
              disabled={submitting || !nombre || !descripcion}
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