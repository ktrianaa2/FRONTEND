import React from "react";
import { notification } from "antd";

function TablaMiembros({ personas, onRefreshData, onVerDetalle, onEditar }) {
  const [api, contextHolder] = notification.useNotification();

  return (
    <div>
      {contextHolder}
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
    </div>
  );
}

export default TablaMiembros;