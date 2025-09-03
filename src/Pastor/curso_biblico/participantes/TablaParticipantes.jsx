import React from "react";
import { notification } from "antd";
import "../../../Styles/Tabla.css";

function TablaParticipantes({
  participantes,
  filteredParticipantes,
  onRefreshData,
  onVerDetalles,
  onVerCalificaciones,
}) {
  const [api, contextHolder] = notification.useNotification();

  const formatearCalificacion = (calificacion) => {
    console.log("Calificación recibida:", calificacion);
    if (calificacion === null || calificacion === undefined) {
      return "Sin calificar";
    }
    return parseFloat(calificacion).toFixed(2);
  };

  const getColorCalificacion = (calificacion) => {
    if (calificacion === null || calificacion === undefined) {
      return "#6c757d"; // Gris para sin calificar
    }

    const nota = parseFloat(calificacion);
    if (nota >= 8) return "#28a745"; // Verde para excelente
    if (nota >= 6) return "#ffc107"; // Amarillo para regular
    return "#dc3545"; // Rojo para bajo
  };

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
                <th>Calificación Final</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredParticipantes.map((participante, index) => (
                <tr key={participante.id_persona}>
                  <td>{participante.nombre}</td>
                  <td>{participante.apellido}</td>
                  <td>
                    <span
                      style={{
                        color: getColorCalificacion(participante.calificacion_final),
                        fontWeight: 'bold'
                      }}
                    >
                      {formatearCalificacion(participante.calificacion_final)}
                    </span>
                  </td>
                  <td>
                    <div className="btn-acciones">
                      <button
                        className="btn-ver"
                        onClick={() => onVerDetalles(participante)}
                      >
                        <i className="bi bi-person-lines-fill me-1"></i> Ver Detalles
                      </button>
                      <button
                        className="btn-guardar"
                        onClick={() => onVerCalificaciones(participante)}
                      >
                        <i className="bi bi-journal-check me-1"></i> Calificaciones
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