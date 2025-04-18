import React, { useState, useEffect, useRef } from "react";
import { notification } from "antd";
import API_URL from "../../../../Config";
import "../../../Styles/Formulario.css";

function EditarMinisterioFormulario({ ministerio, onClose }) {
  const [nombre, setNombre] = useState(ministerio.nombre || "");
  const [descripcion, setDescripcion] = useState(ministerio.descripcion || "");
  const [lideres, setLideres] = useState([]);
  const [selectedLider, setSelectedLider] = useState("");
  const [personasDisponibles, setPersonasDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorLideres, setErrorLideres] = useState(null);
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(ministerio.imagen_url || null);
  const [eliminarImagen, setEliminarImagen] = useState(false);
  const fileInputRef = useRef(null);
  const [api, contextHolder] = notification.useNotification();

  // Cargar personas disponibles y líderes actuales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');

        // Obtener personas disponibles
        const personasResponse = await fetch(`${API_URL}/Miembros/personas/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!personasResponse.ok) throw new Error('Error al obtener personas');
        const personasData = await personasResponse.json();
        setPersonasDisponibles(personasData.personas);

        // Obtener líderes actuales del ministerio
        const lideresActuales = [];

        if (ministerio.lider1) {
          lideresActuales.push({
            id: ministerio.lider1.id_persona || ministerio.lider1.id_usuario,
            nombreCompleto: `${ministerio.lider1.nombres} ${ministerio.lider1.apellidos}`,
            cedula: ministerio.lider1.cedula || ministerio.lider1.numero_cedula
          });
        }

        if (ministerio.lider2) {
          lideresActuales.push({
            id: ministerio.lider2.id_persona || ministerio.lider2.id_usuario,
            nombreCompleto: `${ministerio.lider2.nombres} ${ministerio.lider2.apellidos}`,
            cedula: ministerio.lider2.cedula || ministerio.lider2.numero_cedula
          });
        }

        setLideres(lideresActuales);
        setNombre(ministerio.nombre);
        setDescripcion(ministerio.descripcion);
        setPreview(ministerio.imagen_url || null);

      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ministerio]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tamaño de imagen (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      api.error({
        message: 'Error',
        description: 'La imagen es demasiado grande (máximo 5MB)',
        duration: 5,
      });
      return;
    }

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      api.error({
        message: 'Error',
        description: 'Formato no válido. Use JPG, PNG o WEBP',
        duration: 5,
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setImagen(file);
      setEliminarImagen(false); // Si suben nueva imagen, cancelar eliminación
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setImagen(null);
    setEliminarImagen(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddLider = () => {
    if (selectedLider && !lideres.some(l => l.id === selectedLider)) {
      if (lideres.length < 2) {
        const personaSeleccionada = personasDisponibles.find(p => p.id_persona == selectedLider);
        if (personaSeleccionada) {
          setLideres([...lideres, {
            id: personaSeleccionada.id_persona,
            nombreCompleto: `${personaSeleccionada.nombres} ${personaSeleccionada.apellidos}`,
            cedula: personaSeleccionada.numero_cedula
          }]);
          setSelectedLider("");
          setErrorLideres(null); // Limpiar error al agregar líder
        }
      } else {
        setErrorLideres('Solo se permiten 2 líderes por ministerio');
      }
    }
  };

  const handleRemoveLider = (idLider) => {
    setLideres(lideres.filter(l => l.id !== idLider));
    setErrorLideres(null); // Limpiar error al quitar líder
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorLideres(null);

    try {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      
      // Datos básicos
      formData.append('nombre', nombre);
      formData.append('descripcion', descripcion);
      
      // Líderes (enviar vacío si se eliminó)
      formData.append('id_persona_lider1', lideres[0]?.id || '');
      formData.append('id_persona_lider2', lideres[1]?.id || '');
      
      // Imagen
      if (imagen) {
        formData.append('imagen', imagen);
      }
      
      // Eliminar imagen
      if (eliminarImagen) {
        formData.append('eliminar_imagen', 'true');
      }

      const response = await fetch(`${API_URL}/Ministerio/editarministerios/${ministerio.id_ministerio}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Manejar error específico de validación de líderes
        if (errorData.error === "Error en los líderes") {
          const errorDetails = errorData.detalles;
          const errorKey = Object.keys(errorDetails)[0]; // 'lider1' o 'lider2'
          const errorMessage = errorDetails[errorKey];

          // Encontrar el líder correspondiente
          const liderConError = lideres[errorKey === 'lider1' ? 0 : 1];

          // Crear mensaje personalizado
          const mensajeError = `Error en ${liderConError?.nombreCompleto}: ${errorMessage}`;
          setErrorLideres(mensajeError);
          return;
        }

        throw new Error(errorData.error || 'Error al editar ministerio');
      }

      // Cerrar el formulario e indicar que se actualizó
      onClose(true);

    } catch (error) {
      if (error.message.includes("Todos los datos de la persona deben estar completos")) {
        const match = error.message.match(/para (.+?) \(/);
        const nombreLider = match ? match[1] : "el líder seleccionado";
        setErrorLideres(`Error en ${nombreLider}: Todos los datos deben estar completos para ser líder`);
      } else {
        api.error({
          message: 'Error',
          description: error.message,
          duration: 5,
        });
      }
    }
  };

  if (loading) {
    return <div className="text-center my-4">Cargando datos del ministerio...</div>;
  }

  return (
    <div className="formulario-card">
      {contextHolder}
      <div className="formulario-header">
        <h5 className="formulario-titulo">
          <i className="bi bi-building-fill me-2"></i>
          Editar Ministerio
        </h5>
      </div>
      <div className="formulario-body">
        <form onSubmit={handleSubmit}>

          <div className="formulario-campo">
            <label htmlFor="nombre" className="form-label fw-bold text-dark">
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
              />
            </div>
          </div>

          <div className="formulario-campo">
            <label className="formulario-label">
              Imagen del Ministerio
            </label>
            <div className="image-upload-container">
              {preview && !eliminarImagen ? (
                <div className="position-relative" style={{width: '150px'}}>
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="img-thumbnail"
                    style={{width: '100%', height: '150px', objectFit: 'cover'}}
                  />
                  <button
                    type="button"
                    className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 rounded-circle"
                    onClick={handleRemoveImage}
                    style={{width: '25px', height: '25px'}}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-outline-primary align-self-start"
                  onClick={() => fileInputRef.current.click()}
                >
                  <i className="bi bi-cloud-arrow-up me-2"></i>
                  {ministerio.imagen_url ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
                </button>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="d-none"
              />
              {ministerio.imagen_url && !preview && eliminarImagen && (
                <div className="alert alert-warning p-2 mt-2">
                  <small>La imagen actual se eliminará al guardar los cambios</small>
                </div>
              )}
              <small className="text-muted d-block mt-1">Formatos: JPEG, PNG, WEBP (Máx. 5MB)</small>
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
                disabled={lideres.length >= 2}
              >
                <option value="">Seleccionar líder</option>
                {personasDisponibles
                  .filter(p => !lideres.some(l => l.id === p.id_persona))
                  .map((persona) => (
                    <option
                      key={persona.id_persona}
                      value={persona.id_persona}
                    >
                      {`${persona.nombres} ${persona.apellidos} (${persona.numero_cedula})`}
                    </option>
                  ))}
              </select>
              <button
                type="button"
                className="btn-guardar"
                onClick={handleAddLider}
                disabled={!selectedLider || lideres.length >= 2}
              >
                +
              </button>
            </div>

            {/* Mostrar errores de líderes */}
            {errorLideres && (
              <div className="alert alert-danger mt-2">
                {errorLideres}
              </div>
            )}

            {/* Mostrar líderes actuales */}
            <div className="lista-lideres">
              {lideres.length > 0 && (
                <ul className="lista-lideres-ul">
                  {lideres.map((lider) => (
                    <li
                      key={lider.id}
                      className="item-lider"
                      >
                      {`${lider.nombreCompleto} (${lider.cedula})`}
                      <button
                        type="button"
                        className="btn-cancelar"
                        onClick={() => handleRemoveLider(lider.id)}
                      >
                        &times;
                      </button>
                    </li>
                  ))}
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
              onClick={() => onClose(false)}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn-guardar"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditarMinisterioFormulario;