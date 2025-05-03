import React from "react";
import { notification } from "antd";
import "../../../Styles/Tabla.css";

function TablaTareas({
    tareas,
    filteredTareas,
    onRefreshData,
    onVerDetalles,
    onEditarTarea,
}) {
    const [api, contextHolder] = notification.useNotification();

    return (
        <div>
            {contextHolder}
            {filteredTareas.length > 0 ? (
                <div className="table-responsive">
                    <table className="tabla-principal">
                        <thead>
                            <tr>
                                <th>Titulo</th>
                                <th>Descripcion</th>
                                <th>Criterio</th>
                                <th>Fecha de Entrega</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTareas.map((tarea, index) => (
                                <tr key={tarea.id_tarea}>
                                    <td>{tarea.titulo}</td>
                                    <td>{tarea.descripcion}</td>
                                    <td>{tarea.criterio || "No especificado"}</td>
                                    <td>{tarea.fecha_entrega}</td>
                                    <td>
                                        <div className="btn-acciones">
                                            <button
                                                className="btn-ver"
                                                onClick={() => onVerDetalles(tarea)}
                                            >
                                                <i className="bi bi-person-lines-fill me-1"></i> Ver Detalles
                                            </button>
                                            <button
                                                className="btn-editar"
                                                onClick={() => onEditarTarea(tarea)}
                                            >
                                                <i className="bi bi-pencil-square me-1"></i> Editar
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
                    className={`sin-contenido-mensaje ${tareas.length === 0 ? "" : "filtros"}`}
                >
                    {tareas.length === 0
                        ? "No hay tareas registradas todavía."
                        : "No hay tareas que coincidan con los filtros aplicados."}
                </div>
            )}
        </div>
    );
}

export default TablaTareas;