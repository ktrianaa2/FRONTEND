import React from "react";
import { notification } from "antd";
import dayjs from "dayjs";
import "../../../Styles/Tabla.css"

function TablaEventos({ eventos, filteredEventos, onRefreshData, onVerDetalle, onEditar }) {
  const [api, contextHolder] = notification.useNotification();

  const formatFecha = (fecha, hora) => {
    return dayjs(`${fecha} ${hora}`).format('DD/MM/YYYY hh:mm A');
  };

  return (
    <div>
      {contextHolder}
      {filteredEventos.length > 0 ? (
        <div className="table-responsive">
          <table className="tabla-principal">
            <thead>
              <tr>
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
              {filteredEventos.map((evento) => (
                <tr key={evento.id_evento}>
                  <td>{evento.nombre}</td>
                  <td className="text-truncate" style={{ maxWidth: '200px' }} title={evento.descripcion}>
                    {evento.descripcion}
                  </td>
                  <td>{formatFecha(evento.fecha, evento.hora)}</td>
                  <td>{evento.lugar || 'No especificado'}</td>
                  <td>{evento.ministerio}</td>
                  <td>
                    <span className={
                      evento.estado === 'Aprobado'
                        ? 'badge-activo'
                        : evento.estado === 'Pendiente'
                          ? 'badge-pendiente'
                          : evento.estado === 'Rechazado'
                            ? 'badge-rechazado'
                            : 'badge-inactivo'
                    }>
                      {evento.estado}
                    </span>
                  </td>
                  <td>
                    <div className="btn-acciones">
                      <button
                        className="btn-ver"
                        onClick={() => onVerDetalle(evento.id_evento)}
                      >
                        <i className="bi bi-eye-fill me-1"></i> Ver
                      </button>
                      <button
                        className="btn-editar"
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
      ) : (
        <div className={`sin-contenido-mensaje ${eventos.length === 0 ? '' : 'filtros'}`}>
          {eventos.length === 0
            ? "No hay eventos registrados todavía."
            : "No hay eventos que coincidan con los filtros aplicados."}
        </div>
      )}
    </div>
  );
}

export default TablaEventos;