import React, { useEffect, useState } from "react";
import API_URL from "../../../../Config";
import { notification } from "antd";
import '../../../Styles/Detalles.css';

function DetalleCiclo({ idCiclo, onClose }) {
    const [ciclo, setCiclo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        const fetchCiclo = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('authToken');
                if (!token) throw new Error("No hay sesión activa");

                const response = await fetch(`${API_URL}/Ciclos/ver_ciclo/${idCiclo}/`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Error al obtener los datos del ciclo");
                }

                const data = await response.json();
                setCiclo(data);
            } catch (error) {
                api.error({
                    message: "Error al obtener ciclo",
                    description: error.message,
                    duration: 4
                });
            } finally {
                setLoading(false);
            }
        };

        if (idCiclo) {
            fetchCiclo();
        }
    }, [idCiclo]);

    if (loading) return <div className="text-center my-4">Cargando datos del ciclo...</div>;

    if (!ciclo) return <div className="text-danger">No se encontró el ciclo.</div>;

    return (
        <div className="detalle-container">
            {contextHolder}
            <h4 className="titulo">Detalle del Ciclo</h4>
            <hr />
            <div className="detalle-item">
                <span className="detalle-label"><strong>Nombre:</strong></span>
                <span className="detalle-info">{ciclo.nombre}</span>
            </div>
            <div className="detalle-item">
                <span className="detalle-label"><strong>Descripción:</strong></span>
                <span className="detalle-info">{ciclo.descripcion}</span>
            </div>

            <button className="btn-volver" onClick={onClose}>
                Volver
            </button>
        </div>
    );
}

export default DetalleCiclo;
