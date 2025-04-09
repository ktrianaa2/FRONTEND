import React from "react";
import { notification } from "antd";
import "../../../Styles/Tabla.css"

function TablaMiembros({ personas, filteredPersonas, onRefreshData, onVerDetalle, onEditar }) {
  const [api, contextHolder] = notification.useNotification();

  return (
    <div>
      {contextHolder}
      {filteredPersonas.length > 0 ? (
        <div className="table-responsive">
          <table className="tabla-principal">
            <thead>
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
              {filteredPersonas.map((persona) => (
                <tr key={persona.id_persona}>
                  <td>{persona.id_persona}</td>
                  <td>{persona.nombres}</td>
                  <td>{persona.apellidos}</td>
                  <td>{persona.celular}</td>
                  <td>{persona.numero_cedula}</td>
                  <td>A los que asiste</td>
                  <td>
                    <div className="btn-acciones">
                      <button
                        className="btn-ver"
                        onClick={() => onVerDetalle(persona.id_persona)}
                      >
                        <i className="bi bi-eye-fill me-1"></i> Ver Detalles
                      </button>
                      <button
                        className="btn-editar"
                        onClick={() => onEditar(persona)}
                      >
                        <i className="bi bi-pencil-fill me-1"></i> Editar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={`sin-contenido-mensaje ${personas.length === 0 ? '' : 'filtros'}`}>
          {personas.length === 0
            ? "No hay miembros registrados todavía."
            : "No hay miembros que coincidan con los filtros aplicados."}
        </div>
      )}
    </div>
  );
}

export default TablaMiembros;