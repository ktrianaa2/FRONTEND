import React, { useState, useEffect } from "react";
import { notification, Tag, Badge, Spin, Button } from "antd";
import API_URL from "../../../../Config";
import "../../../Styles/Tabla.css"

function EventosMinisterio({ ministerioId, onBack }) {
    const [eventos, setEventos] = useState([]);
    const [ministerio, setMinisterio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        const fetchEventosMinisterio = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const response = await fetch(`${API_URL}/Eventos/eventos_ministerio/${ministerioId}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Error al obtener eventos");
                }

                const data = await response.json();
                setMinisterio(data.ministerio);
                setEventos(data.eventos);
            } catch (error) {
                api.error({
                    message: "Error",
                    description: error.message,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchEventosMinisterio();
    }, [ministerioId]);

    const renderEstado = (estado) => {
        const estados = {
            'Aprobado': { color: 'green', text: 'Aprobado' },
            'Pendiente': { color: 'orange', text: 'Pendiente' },
            'Cancelado': { color: 'red', text: 'Cancelado' }
        };

        const estadoInfo = estados[estado] || { color: 'default', text: estado };

        return (
            <Tag color={estadoInfo.color}>
                {estadoInfo.text}
            </Tag>
        );
    };

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="container-evento-ministerio">
            {contextHolder}

            <div className="header-ministerio">
                <h1>Eventos del Ministerio: {ministerio?.nombre}</h1>
                <Button
                    type="primary"
                    onClick={onBack}
                >
                    Volver
                </Button>
            </div>

            {eventos.length > 0 ? (
                <div className="table-responsive">
                    <table className="tabla-principal">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Lugar</th>
                                <th>Estado</th>
                                <th>Creador</th>
                            </tr>
                        </thead>
                        <tbody>
                            {eventos.map((evento) => (
                                <tr key={evento.id_evento}>
                                    <td>{evento.id_evento}</td>
                                    <td>{evento.nombre}</td>
                                    <td>{evento.descripcion || "Sin descripción"}</td>
                                    <td>{evento.fecha}</td>
                                    <td>{evento.hora.substring(0, 5)}</td>
                                    <td>{evento.lugar || "-"}</td>
                                    <td>{renderEstado(evento.estado.nombre)}</td>
                                    <td>{evento.creador.nombres} {evento.creador.apellidos}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="sin-contenido-mensaje">
                    No hay eventos aprobados para este ministerio.
                </div>
            )}
        </div>
    );
}

export default EventosMinisterio;