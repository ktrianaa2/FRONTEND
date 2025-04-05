import React, { useState, useEffect } from "react";
import { notification } from "antd";
import API_URL from "../../../../Config";

function EditarMinisterioFormulario({ ministerio, onClose }) {
  const [nombre, setNombre] = useState(ministerio.nombre || "");
  const [descripcion, setDescripcion] = useState(ministerio.descripcion || "");
  const [lideres, setLideres] = useState([]);
  const [selectedLider, setSelectedLider] = useState("");
  const [personasDisponibles, setPersonasDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorLideres, setErrorLideres] = useState(null);
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

      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ministerio]);

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
      formData.append('nombre', nombre);
      formData.append('descripcion', descripcion);

      // Enviar null para líderes que fueron eliminados
      formData.append('id_persona_lider1', lideres[0]?.id || '');
      formData.append('id_persona_lider2', lideres[1]?.id || '');

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
          // Obtener el ID del líder con problemas desde el mensaje de error
          const errorDetails = errorData.detalles;
          const errorKey = Object.keys(errorDetails)[0]; // 'lider1' o 'lider2'
          const errorMessage = errorDetails[errorKey];

          // Encontrar el líder correspondiente
          const liderConError = lideres[errorKey === 'lider1' ? 0 : 1];

          // Crear mensaje personalizado
          const mensajeError = `Error en ${liderConError?.nombreCompleto}: ${errorMessage.replace(/\\u[\dA-F]{4}/gi,
            match => String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16)))}`;

          setErrorLideres(mensajeError);
          return; // No cerrar el formulario
        }

        throw new Error(errorData.error || 'Error al editar ministerio');
      }

      // Cerrar el formulario e indicar que se actualizó
      onClose(true);

    } catch (error) {
      if (error.message.includes("Todos los datos de la persona deben estar completos")) {
        // Extraer el nombre del líder del mensaje de error si es posible
        const match = error.message.match(/para (.+?) \(/);
        const nombreLider = match ? match[1] : "el líder seleccionado";
        setErrorLideres(`Error en ${nombreLider}: Todos los datos deben estar completos para ser líder`);
      } else {
        onClose(false, error.message);
      }
    }
  };

  if (loading) {
    return <div className="text-center my-4">Cargando datos del ministerio...</div>;
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
              />
            </div>
          </div>
  
          {/* Líder(es) */}
          <div className="mb-3 g-3">
            <label className="form-label fw-bold text-dark">
              Líder(es) (Máximo 2)
            </label>
            <div className="d-flex justify-content-between">
              <select
                className="form-select w-75"
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
                className="btn btn-success ms-2"
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
            <div className="mt-2">
              {lideres.length > 0 && (
                <ul className="list-group">
                  {lideres.map((lider) => (
                    <li
                      key={lider.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {`${lider.nombreCompleto} (${lider.cedula})`}
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
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
  
          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onClose(false)}
            >
              Cancelar
            </button>
  
            <button
              type="submit"
              className="btn btn-success text-white"
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