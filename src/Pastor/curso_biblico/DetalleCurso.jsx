import React, { useEffect, useState } from "react";
import API_URL from "../../../Config";
import { notification } from "antd";
import '../../Styles/Detalles.css';

function DetalleCurso({ idCurso, onClose }) {
    const [curso, setCurso] = useState(null);
    const [loading, setLoading] = useState(true);
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        const fetchCurso = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('authToken');
                if (!token) throw new Error("No hay sesión activa");

                const response = await fetch(`${API_URL}/Cursos/${idCurso}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Error al obtener los datos del curso");
                }

                const data = await response.json();
                setCurso(data);
            } catch (error) {
                api.error({
                    message: "Error al obtener curso",
                    description: error.message,
                    duration: 4
                });
            } finally {
                setLoading(false);
            }
        };

        if (idCurso) {
            fetchCurso();
        }
    }, [idCurso]);

    if (loading) return <div className="text-center my-4">Cargando datos del curso...</div>;

    if (!curso) return <div className="text-danger">No se encontró el curso.</div>;

    return (
        <div className="detalle-container">
            {contextHolder}
            <h4 className="titulo">Detalle del Curso</h4>
            <hr />
            <div className="detalle-item">
                <span className="detalle-label"><strong>Nombre:</strong></span>
                <span className="detalle-info">{curso.nombre}</span>
            </div>
            <div className="detalle-item">
                <span className="detalle-label"><strong>Descripción:</strong></span>
                <span className="detalle-info">{curso.descripcion}</span>
            </div>
            <div className="detalle-item">
                <span className="detalle-label"><strong>Fecha de Inicio:</strong></span>
                <span className="detalle-info">{curso.fecha_inicio}</span>
            </div>
            <div className="detalle-item">
                <span className="detalle-label"><strong>Fecha de Fin:</strong></span>
                <span className="detalle-info">{curso.fecha_fin}</span>
            </div>
            <div className="detalle-item">
                <span className="detalle-label"><strong>Hora de Inicio:</strong></span>
                <span className="detalle-info">{curso.hora_inicio}</span>
            </div>
            <div className="detalle-item">
                <span className="detalle-label"><strong>Hora de Fin:</strong></span>
                <span className="detalle-info">{curso.hora_fin}</span>
            </div>

            <button className="btn-volver" onClick={onClose}>
                Volver
            </button>
        </div>
    );
}

export default DetalleCurso;
