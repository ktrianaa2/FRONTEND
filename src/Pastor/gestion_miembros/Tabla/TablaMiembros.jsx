import React, { useState } from "react";
import FormularioEditarMiembro from "../Formularios/FormularioEditarMiembro";
import { notification } from "antd";

function TablaMiembros({ personas, onRefreshData, onVerDetalle, onEditar }) {
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
        <div className="table-responsive">
          <table className="table table-striped table-hover shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Nombres</th>
                <th>Apellidos</th>
                <th>Celular</th>
                <th>Cédula</th>
                <th>Ministerios</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {personas.map((persona) => (
                <tr key={persona.id_persona}>
                  <td>{persona.id_persona}</td>
                  <td>{persona.nombres}</td>
                  <td>{persona.apellidos}</td>
                  <td>{persona.celular}</td>
                  <td>{persona.numero_cedula}</td>
                  <td>a los que asiste</td>
                  <td>
                    <div className="d-flex flex-wrap gap-2">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => onVerDetalle(persona.id_persona)}
                      >
                        Ver Detalles
                      </button>
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => onEditar(persona)}
                      >
                        Editar
                      </button>
                      <button className="btn btn-danger btn-sm">
                        Deshabilitar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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