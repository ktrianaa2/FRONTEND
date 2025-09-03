import React, { useState, useEffect } from "react";
import { notification } from "antd";
import API_URL from "../../../../Config";

function DetalleCalificacionesParticipante({ participante, curso, onClose }) {
    const [detalleCalificaciones, setDetalleCalificaciones] = useState(null);
    const [loading, setLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();

    const fetchDetalleCalificaciones = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("authToken");
            const response = await fetch(
                `${API_URL}/Cursos/calcular_calificacion/${curso.id_curso}/${participante.id_persona}/`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error al obtener calificaciones");
            }

            setDetalleCalificaciones(data);
        } catch (error) {
            console.error("Error en fetchDetalleCalificaciones:", error);
            api.error({
                message: "Error",
                description: error.message || "No se pudieron cargar las calificaciones",
                duration: 5,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetalleCalificaciones();
    }, [participante, curso]);

    const getColorCalificacion = (calificacion) => {
        if (calificacion >= 8) return "#28a745";
        if (calificacion >= 6) return "#ffc107";
        return "#dc3545";
    };

    return (
        <div>
            {contextHolder}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>Calificaciones de {participante.nombre} {participante.apellido}</h4>
                <button className="btn-cancelar" onClick={onClose}>
                    Volver
                </button>
            </div>

            {loading ? (
                <div className="text-center my-4">Cargando calificaciones...</div>
            ) : detalleCalificaciones ? (
                <div>
                    <div className="card mb-4">
                        <div className="card-header">
                            <h5>Calificación Final</h5>
                        </div>
                        <div className="card-body text-center">
                            <h2 
                                style={{ 
                                    color: getColorCalificacion(detalleCalificaciones.calificacion_final),
                                    fontWeight: 'bold' 
                                }}
                            >
                                {detalleCalificaciones.calificacion_final.toFixed(2)}
                            </h2>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h5>Detalle por Criterios</h5>
                        </div>
                        <div className="card-body">
                            {detalleCalificaciones.detalles.map((criterio, index) => (
                                <div key={index} className="mb-4 p-3 border rounded">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h6 className="mb-0">{criterio.criterio}</h6>
                                        <div className="d-flex align-items-center gap-3">
                                            <span className="badge bg-primary">
                                                {criterio.porcentaje}%
                                            </span>
                                            <span 
                                                className="fw-bold"
                                                style={{ color: getColorCalificacion(criterio.promedio) }}
                                            >
                                                Promedio: {criterio.promedio}
                                            </span>
                                            <span className="text-success">
                                                Puntos: {criterio.puntos_obtenidos}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {criterio.tareas.length > 0 ? (
                                        <div className="table-responsive">
                                            <table className="table table-sm">
                                                <thead>
                                                    <tr>
                                                        <th>Tarea</th>
                                                        <th>Nota</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {criterio.tareas.map((tarea, tareaIndex) => (
                                                        <tr key={tareaIndex}>
                                                            <td>{tarea.titulo_tarea}</td>
                                                            <td>
                                                                <span 
                                                                    style={{ 
                                                                        color: getColorCalificacion(tarea.nota),
                                                                        fontWeight: 'bold' 
                                                                    }}
                                                                >
                                                                    {tarea.nota.toFixed(2)}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="text-muted mb-0">No hay tareas calificadas para este criterio</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center my-4">No hay datos de calificaciones disponibles</div>
            )}
        </div>
    );
}

export default DetalleCalificacionesParticipante;