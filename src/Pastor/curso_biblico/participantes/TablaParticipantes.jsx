import React from "react";
import { notification } from "antd";
import "../../../Styles/Tabla.css";

function TablaParticipantes({
  participantes,
  filteredParticipantes,
  onRefreshData,
  onGestionar,
}) {
  const [api, contextHolder] = notification.useNotification();

  return (
    <div>
      {contextHolder}
      {filteredParticipantes.length > 0 ? (
        <div className="table-responsive">
          <table className="tabla-principal">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Asistencia</th>
                <th>Calificación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredParticipantes.map((participante, index) => (
                <tr key={participante.id_persona}>
                  <td>{participante.nombre}</td>
                  <td>{participante.apellido}</td>
                  <td>100%</td>
                  <td>10.00</td>
                  <td>
                    <div className="btn-acciones">
                      <button
                        className="btn-ver"
                        onClick={() => onGestionar(participante)}
                      >
                        <i className="bi bi-person-lines-fill me-1"></i> Ver Detalles
                      </button>

                      <button
                        className="btn-guardar"
                        onClick={() => onGestionar(participante)}
                      >
                        <i className="bi bi-person-lines-fill me-1"></i> Calificaciones
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          className={`sin-contenido-mensaje ${participantes.length === 0 ? "" : "filtros"}`}
        >
          {participantes.length === 0
            ? "No hay participantes registrados todavía."
            : "No hay participantes que coincidan con los filtros aplicados."}
        </div>
      )}
    </div>
  );
}

export default TablaParticipantes;