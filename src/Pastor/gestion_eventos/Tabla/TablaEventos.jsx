import React from "react";
import { notification } from "antd";
import dayjs from "dayjs";
import "../../../Styles/Tabla.css"

function TablaEventos({
  eventos,
  filteredEventos,
  onAbrirModalMotivo,
  onVerDetalle,
  onEditar,
  onAccionEvento,
  soloMisEventos
}) {
  const [api, contextHolder] = notification.useNotification();

  const formatFecha = (fecha, hora) => {
    return dayjs(`${fecha} ${hora}`).format('DD/MM/YYYY hh:mm A');
  };

  return (
    <div>
      {contextHolder}
      {filteredEventos.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-light">
              <tr>
                <th>Nombre</th>
                <th>Tipo</th>
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
                  <td>
                    {evento.tipo_evento ? (
                      <span className="badge bg-info text-dark">
                        {evento.tipo_evento}
                      </span>
                    ) : (
                      <span className="badge bg-secondary">Sin tipo</span>
                    )}
                  </td>
                  <td className="text-truncate" style={{ maxWidth: '200px' }} title={evento.descripcion}>
                    {evento.descripcion}
                  </td>
                  <td>{formatFecha(evento.fecha, evento.hora)}</td>
                  <td>{evento.lugar || 'No especificado'}</td>
                  <td>{evento.ministerio}</td>
                  <td>
                    <span className={`badge ${evento.estado === 'Aprobado' ? 'bg-success' :
                      evento.estado === 'Pendiente' ? 'bg-warning text-dark' :
                        evento.estado === 'Rechazado' ? 'bg-danger' :
                          evento.estado === 'Cancelado' ? 'bg-secondary' :
                            evento.estado === 'Pospuesto' ? 'bg-info' :
                              'bg-primary'}`}>
                      {evento.estado}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => onVerDetalle(evento.id_evento)}
                      >
                        <i className="bi bi-eye-fill me-1"></i> Ver
                      </button>

                      {/* Botón Editar condicional */}
                      {soloMisEventos && (
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => onEditar(evento)}
                          disabled={evento.estado === 'Aprobado'}
                        >
                          <i className="bi bi-pencil-fill me-1"></i> Editar
                        </button>
                      )}

                      {soloMisEventos && (
                        <button
                          className={`btn btn-sm ${evento.estado === 'Cancelado' ? 'btn-success' : 'btn-danger'
                            }`}
                          onClick={() => onAccionEvento(evento.id_evento)}
                        >
                          <i className={`bi ${evento.estado === 'Cancelado' ? 'bi-arrow-counterclockwise' : 'bi-x-circle-fill'
                            } me-1`}></i>
                          {evento.estado === 'Cancelado' ? 'Reactivar' : 'Cancelar'}
                        </button>
                      )}
                      {!soloMisEventos && (
                        <>
                          {evento.estado === 'Pendiente' && (
                            <>
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => onAbrirModalMotivo(evento.id_evento, 'aprobar')}
                              >
                                <i className="bi bi-check-circle-fill me-1"></i>
                                Aprobar
                              </button>
                              <button
                                className="btn btn-sm btn-info"
                                onClick={() => onAbrirModalMotivo(evento.id_evento, 'posponer')}
                              >
                                <i className="bi bi-clock-fill me-1"></i>
                                Posponer
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => onAbrirModalMotivo(evento.id_evento, 'rechazar')}
                              >
                                <i className="bi bi-slash-circle-fill me-1"></i>
                                Rechazar
                              </button>
                            </>
                          )}
                          {evento.estado === 'Aprobado' && (
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => onAbrirModalMotivo(evento.id_evento, 'cancelar')}
                            >
                              <i className="bi bi-x-circle-fill me-1"></i>
                              Cancelar
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="alert alert-info">
          {eventos.length === 0
            ? "No hay eventos registrados todavía."
            : "No hay eventos que coincidan con los filtros aplicados."}
        </div>
      )}
    </div>
  );
}

export default TablaEventos;