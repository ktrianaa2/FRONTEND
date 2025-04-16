import React from "react";
import { notification } from "antd";
import dayjs from "dayjs";
import "../../../Styles/Tabla.css"

function TablaCursos({
  cursos,
  filteredCursos,
  onRefreshData,
  onVerDetalle,
  onEditar,
}) {
  const [api, contextHolder] = notification.useNotification();

  const formatFecha = (fecha, hora) => {
    return dayjs(`${fecha} ${hora}`).format('DD/MM/YYYY hh:mm A');
  };

  return (
    <div>
      {contextHolder}
      {filteredCursos.length > 0 ? (
        <div className="table-responsive">
          <table className="tabla-principal">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Periodo</th>
                <th>Horario</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCursos.map((Cursos) => (
                <tr key={Cursos.id_Cursos}>
                  <td>{Cursos.nombre}</td>
                  <td className="text-truncate" style={{ maxWidth: '200px' }} title={Cursos.descripcion}>
                    {Cursos.descripcion}
                  </td>
                  <td>{Cursos.fecha_inicio} - {Cursos.fecha_fin}</td>
                  <td>{Cursos.hora_inicio} - {Cursos.hora_fin}</td>
                  <td>
                    <span className={
                      Cursos.estado === 'En Curso'
                        ? 'badge-activo'
                        : Cursos.estado === 'Pendiente'
                          ? 'badge-pendiente'
                          : Cursos.estado === 'Culminado'
                            ? 'badge-rechazado'
                            : 'badge-inactivo'
                    }>
                      {Cursos.estado}
                    </span>
                  </td>
                  <td>
                    <div className="btn-acciones">
                      <button
                        className="btn-ver"
                        onClick={() => onVerDetalle(Cursos.id_Cursos)}
                      >
                        <i className="bi bi-eye-fill me-1"></i> Ver
                      </button>
                      <button
                        className="btn-editar"
                        onClick={() => onEditar(Cursos)}
                        disabled={Cursos.estado === 'Aprobado'}
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
        <div className={`sin-contenido-mensaje ${cursos.length === 0 ? '' : 'filtros'}`}>
          {cursos.length === 0
            ? "No hay cursos registrados todavía."
            : "No hay cursos que coincidan con los filtros aplicados."}
        </div>
      )}
    </div>
  );
}

export default TablaCursos;