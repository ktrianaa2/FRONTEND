import React, { useState } from "react";
import FormularioEditarMiembro from "../Formularios/FormularioEditarMiembro";
import { notification } from "antd";

function TablaMiembros({ personas, onRefreshData }) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedMiembro, setSelectedMiembro] = useState(null);
  const [api, contextHolder] = notification.useNotification();

  const handleEditClick = (persona) => {
    setSelectedMiembro(persona);
    setShowEditForm(true);
  };

  const handleCloseForm = () => {
    setShowEditForm(false);
    setSelectedMiembro(null);
  };

  const handleUpdateSuccess = async () => {
    try {
      // Mostrar notificación de éxito
      api.success({
        message: 'Éxito',
        description: 'Los datos del miembro se actualizaron correctamente',
        duration: 3,
      });

      // Actualizar la tabla
      if (onRefreshData) {
        await onRefreshData(); // Añade await aquí
      }

      // Cerrar el formulario después de actualizar los datos
      setShowEditForm(false);
      setSelectedMiembro(null);

    } catch (error) {
      api.error({
        message: 'Error',
        description: 'Ocurrió un error al actualizar los datos',
        duration: 5,
      });
    }
  };

  return (
    <div>
      {contextHolder}
      {!showEditForm ? (
        <div className="card shadow">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Listado de Miembros</h5>
          </div>
          <div className="card-body">
            {personas.length === 0 ? (
              <div className="alert alert-info">No hay miembros registrados</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Cédula</th>
                      <th>Nombres</th>
                      <th>Apellidos</th>
                      <th>Fecha Nacimiento</th>
                      <th>Género</th>
                      <th>Celular</th>
                      <th>Dirección</th>
                      <th>Correo</th>
                      <th>Nivel Estudio</th>
                      <th>Nacionalidad</th>
                      <th>Profesión</th>
                      <th>Estado Civil</th>
                      <th>Lugar Trabajo</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {personas.map((persona) => (
                      <tr key={persona.id_persona}>
                        <td>{persona.id_persona}</td>
                        <td>{persona.numero_cedula}</td>
                        <td>{persona.nombres}</td>
                        <td>{persona.apellidos}</td>
                        <td>{persona.fecha_nacimiento}</td>
                        <td>{persona.genero}</td>
                        <td>{persona.celular}</td>
                        <td>{persona.direccion}</td>
                        <td>{persona.correo_electronico}</td>
                        <td>{persona.nivel_estudio}</td>
                        <td>{persona.nacionalidad}</td>
                        <td>{persona.profesion}</td>
                        <td>{persona.estado_civil}</td>
                        <td>{persona.lugar_trabajo}</td>
                        <td>
                          <div className="btn-group" role="group">
                            <button
                              className="btn btn-sm btn-primary me-1"
                              onClick={() => handleEditClick(persona)}
                            >
                              <i className="bi bi-pencil-fill"></i> Editar
                            </button>
                            <button className="btn btn-sm btn-danger">
                              <i className="bi bi-trash-fill"></i> Deshabilitar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        <FormularioEditarMiembro
          miembro={selectedMiembro}
          onClose={handleCloseForm}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
}

export default TablaMiembros;