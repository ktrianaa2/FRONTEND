import React, { useEffect, useState } from "react";
import API_URL from "../../../../Config";
import { notification } from "antd";
import '../../../Styles/Detalles.css';

function DetalleTarea({ tareaId, onClose }) {
    const [tarea, setTarea] = useState(null);
    const [loading, setLoading] = useState(true);
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        const fetchTarea = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('authToken');
                if (!token) throw new Error("No hay sesión activa");

                const response = await fetch(`${API_URL}/Curso/ver_tarea/${tareaId}/`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Error al obtener los datos de la tarea");
                }

                const data = await response.json();
                setTarea(data);
            } catch (error) {
                api.error({
                    message: "Error al obtener tarea",
                    description: error.message,
                    duration: 4
                });
            } finally {
                setLoading(false);
            }
        };

        if (tareaId) {
            fetchTarea();
        }
    }, [tareaId, api]);

    if (loading) return <div className="text-center my-4">Cargando datos de la tarea...</div>;

    if (!tarea) return <div className="text-danger">No se encontró la tarea.</div>;

    return (
        <div className="detalle-container">
            {contextHolder}
            <h4 className="titulo">Detalle de la Tarea</h4>
            <hr />
            <div className="detalle-item">
                <span className="detalle-label"><strong>Título:</strong></span>
                <span className="detalle-info">{tarea.titulo}</span>
            </div>
            <div className="detalle-item">
                <span className="detalle-label"><strong>Descripción:</strong></span>
                <span className="detalle-info">{tarea.descripcion || 'No especificado'}</span>
            </div>
            <div className="detalle-item">
                <span className="detalle-label"><strong>Curso:</strong></span>
                <span className="detalle-info">{tarea.id_curso?.nombre || 'No especificado'}</span>
            </div>
            <div className="detalle-item">
                <span className="detalle-label"><strong>Criterio:</strong></span>
                <span className="detalle-info">{tarea.id_criterio?.nombre || 'No especificado'}</span>
            </div>
            <div className="detalle-item">
                <span className="detalle-label"><strong>Fecha de Entrega:</strong></span>
                <span className="detalle-info">{tarea.fecha_entrega}</span>
            </div>

            <button className="btn-volver" onClick={onClose}>
                Volver
            </button>
        </div>
    );
}

export default DetalleTarea;