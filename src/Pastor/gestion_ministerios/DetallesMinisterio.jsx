import React, { useEffect, useState } from "react";
import API_URL from "../../../Config";
import { notification } from "antd";
import '../../Styles/Detalles.css';

function DetalleMinisterio({ idMinisterio, onClose }) {
    const [ministerio, setMinisterio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [api, contextHolder] = notification.useNotification();

    // Función para formatear los nombres de los líderes
    const formatLideres = (lider1, lider2) => {
        const lideres = [];
        if (lider1) {
            lideres.push(`${lider1.nombres} ${lider1.apellidos}`);
        }
        if (lider2) {
            lideres.push(`${lider2.nombres} ${lider2.apellidos}`);
        }
        return lideres.length > 0 ? lideres.join(", ") : "Sin líderes asignados";
    };

    useEffect(() => {
        const fetchMinisterio = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("authToken");
                if (!token) {
                    throw new Error("No hay sesión activa");
                }

                const response = await fetch(`${API_URL}/Ministerio/listarministerios/`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Error al obtener los ministerios");
                }

                const data = await response.json();
                const ministerioEncontrado = data.ministerios.find(m => m.id_ministerio === idMinisterio);

                if (!ministerioEncontrado) {
                    throw new Error("Ministerio no encontrado");
                }

                setMinisterio(ministerioEncontrado);

            } catch (error) {
                api.error({
                    message: "Error",
                    description: error.message,
                    duration: 4
                });
            } finally {
                setLoading(false);
            }
        };

        if (idMinisterio) {
            fetchMinisterio();
        }
    }, [idMinisterio]);

    if (loading) return <div className="text-center my-4">Cargando datos del ministerio...</div>;

    if (!ministerio) return <div className="text-danger">No se encontró el ministerio.</div>;

    return (
        <div className="detalle-container">
            {contextHolder}
            <h4 className="titulo">Detalle del Ministerio</h4>
            <hr />
            <p><strong>Nombre:</strong> {ministerio.nombre}</p>
            <p><strong>Líder(es):</strong> {formatLideres(ministerio.lider1, ministerio.lider2)}</p>
            <p><strong>Descripción:</strong> {ministerio.descripcion}</p>
            <p><strong>Miembros:</strong>______</p>
            <p><strong>Eventos Recientes:</strong> _________</p>
            <p><strong>Estado:</strong> {ministerio.estado}</p>
    
            <button className="btn-volver" onClick={onClose}>
                Volver
            </button>
        </div>
    );    
}

export default DetalleMinisterio;
