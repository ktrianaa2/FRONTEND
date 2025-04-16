import React from "react";
import { notification } from "antd";
import dayjs from "dayjs";
import "../../../Styles/Tabla.css";

function TablaCursos({
  cursos,
  filteredCursos,
  onRefreshData,
  onVerDetalle,
  onEditar,
}) {
  const [api, contextHolder] = notification.useNotification();

  const formatFecha = (fecha) => dayjs(fecha).format("DD/MM/YYYY");
  const formatHora = (hora) => dayjs(hora, "HH:mm:ss").format("hh:mm A");

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
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCursos.map((curso) => (
                <tr key={curso.id_curso}>
                  <td>{curso.nombre}</td>
                  <td
                    className="text-truncate"
                    style={{ maxWidth: "200px" }}
                    title={curso.descripcion}
                  >
                    {curso.descripcion}
                  </td>
                  <td>
                    {formatFecha(curso.fecha_inicio)} -{" "}
                    {formatFecha(curso.fecha_fin)}
                  </td>
                  <td>
                    {formatHora(curso.hora_inicio)} -{" "}
                    {formatHora(curso.hora_fin)}
                  </td>
                  <td>
                    <div className="btn-acciones">
                      <button
                        className="btn-ver"
                        onClick={() => onVerDetalle(curso.id_curso)}
                      >
                        <i className="bi bi-eye-fill me-1"></i> Ver
                      </button>
                      <button
                        className="btn-editar"
                        onClick={() => onEditar(curso)}
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
        <div
          className={`sin-contenido-mensaje ${cursos.length === 0 ? "" : "filtros"
            }`}
        >
          {cursos.length === 0
            ? "No hay cursos registrados todavía."
            : "No hay cursos que coincidan con los filtros aplicados."}
        </div>
      )}
    </div>
  );
}

export default TablaCursos;