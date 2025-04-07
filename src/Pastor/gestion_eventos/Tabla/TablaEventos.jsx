import React from "react";
import { notification } from "antd";
import dayjs from "dayjs";

function TablaEventos({ eventos, onRefreshData, onVerDetalle, onEditar }) {
  const [api, contextHolder] = notification.useNotification();

  // Función para formatear la fecha
  const formatFecha = (fecha, hora) => {
    return dayjs(`${fecha} ${hora}`).format('DD/MM/YYYY hh:mm A');
  };

  return (
    <div>
      {contextHolder}
      <div className="table-responsive">
        <table className="table table-striped table-hover shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Fecha y Hora</th>
              <th>Lugar</th>
              <th>Ministerio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {eventos.map((evento) => (
              <tr key={evento.id_evento}>
                <td>{evento.id_evento}</td>
                <td>{evento.nombre}</td>
                <td className="text-truncate" style={{maxWidth: '200px'}} title={evento.descripcion}>
                  {evento.descripcion}
                </td>
                <td>{formatFecha(evento.fecha, evento.hora)}</td>
                <td>{evento.lugar || 'No especificado'}</td>
                <td>{evento.ministerio}</td>
                <td>
                  <span className={`badge ${
                    evento.estado === 'Aprobado' ? 'bg-success' :
                    evento.estado === 'Pendiente' ? 'bg-warning text-dark' :
                    evento.estado === 'Rechazado' ? 'bg-danger' : 'bg-secondary'
                  }`}>
                    {evento.estado}
                  </span>
                </td>
                <td>
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onVerDetalle(evento.id_evento)}
                    >
                      <i className="bi bi-eye-fill me-1"></i> Ver
                    </button>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => onEditar(evento)}
                      disabled={evento.estado === 'Aprobado'}
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
    </div>
  );
}

export default TablaEventos;