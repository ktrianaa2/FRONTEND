import React, { useState, useEffect } from "react";
import { Spin, message } from "antd";
import { Card, Row, Col, ButtonGroup, Button } from "react-bootstrap";
import "../../Styles/Panel.css";
import { CalendarEvent, People } from "react-bootstrap-icons"; // Importa los iconos
import API_URL from "../../../Config";
import EventosMinisterio from "./Tabla/EventosMinisterio";

function AdministrarMisMinisterios({ onNavigate }) {
    const [ministerios, setMinisterios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMinisterio, setSelectedMinisterio] = useState(null);

    // Función para obtener el ID del usuario del token
    const obtenerUsuarioId = () => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                throw new Error('Token no proporcionado');
            }

            // Decodificación manual del token JWT
            const payloadBase64 = token.split('.')[1];
            const payloadJson = atob(payloadBase64);
            const payload = JSON.parse(payloadJson);

            if (!payload.id_usuario) {
                throw new Error('ID de usuario no encontrado en el token');
            }

            return payload.id_usuario;
        } catch (error) {
            message.error('Error al obtener información del usuario: ' + error.message);
            localStorage.removeItem("authToken");
            window.location.href = "/login";
            return null;
        }
    };

    useEffect(() => {
        const fetchMinisterios = async () => {
            try {
                const usuarioId = obtenerUsuarioId();
                if (!usuarioId) return;

                const token = localStorage.getItem("authToken");
                const response = await fetch(`${API_URL}/Ministerio/ministerios_usuario/${usuarioId}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) throw new Error("Error al cargar los ministerios");

                const data = await response.json();

                // Obtener conteo de eventos para cada ministerio
                const ministeriosConEventos = await Promise.all(
                    data.ministerios.map(async ministerio => {
                        const eventosResponse = await fetch(`${API_URL}/Eventos/eventos_ministerio/${ministerio.id_ministerio}/`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        const eventosData = await eventosResponse.json();
                        return {
                            ...ministerio,
                            eventos_count: eventosData.eventos?.length || 0
                        };
                    })
                );

                setMinisterios(ministeriosConEventos);
            } catch (error) {
                message.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMinisterios();
    }, []);

    if (selectedMinisterio) {
        return (
            <EventosMinisterio
                ministerioId={selectedMinisterio}
                onBack={() => setSelectedMinisterio(null)}
            />
        );
    }

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div>
            <h2>Mis Ministerios</h2>
            <p>Administra los ministerios donde eres líder</p>

            {ministerios.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px" }}>
                    <p>No estás asignado a ningún ministerio actualmente.</p>
                </div>
            ) : (
                <Row className="d-flex flex-wrap justify-content-start">
                    {ministerios.map((ministerio) => (
                        <Col key={ministerio.id_ministerio} xs={12} sm={6} md={4} lg={3}>
                            <Card className="h-100 d-flex flex-column">
                                {/* Imagen del ministerio (altura fija) */}
                                <div
                                    className="bg-light"
                                    style={{ height: '150px', overflow: 'hidden' }}
                                    onClick={() => setSelectedMinisterio(ministerio.id_ministerio)}
                                >
                                    {ministerio.imagen_url ? (
                                        <Card.Img
                                            variant="top"
                                            src={ministerio.imagen_url}
                                            className="h-100 w-100 object-fit-cover"
                                        />
                                    ) : (
                                        <div className="h-100 d-flex align-items-center justify-content-center">
                                            <span className="text-muted">Sin imagen</span>
                                        </div>
                                    )}
                                </div>

                                {/* Cuerpo de la tarjeta (crecerá para ocupar espacio disponible) */}
                                <Card.Body className="d-flex flex-column">
                                    <div
                                        onClick={() => setSelectedMinisterio(ministerio.id_ministerio)}
                                        className="flex-grow-1"
                                    >
                                        <Card.Title className="fs-6 mb-2">{ministerio.nombre}</Card.Title>
                                        <Card.Text className="text-muted small text-truncate-multiline">
                                            {ministerio.descripcion || "Sin descripción"}
                                        </Card.Text>

                                        <div className="mt-auto pt-2 small text-muted">
                                            <div><strong>Estado:</strong> {ministerio.estado}</div>
                                            {ministerio.lider1 && (
                                                <div><strong>Líder 1:</strong> {ministerio.lider1.nombres} {ministerio.lider1.apellidos}</div>
                                            )}
                                            {ministerio.lider2 && (
                                                <div><strong>Líder 2:</strong> {ministerio.lider2.nombres} {ministerio.lider2.apellidos}</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Botones (se mantienen al fondo) */}
                                    <ButtonGroup className="mt-3">
                                        <Button
                                            variant="outline-primary"
                                            className="d-flex flex-column align-items-center position-relative"
                                            onClick={() => setSelectedMinisterio(ministerio.id_ministerio)}
                                        >
                                            <div className="position-relative">
                                                <CalendarEvent size={20} />
                                                {ministerio.eventos_count > 0 && (
                                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                                                        {ministerio.eventos_count}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="small mt-1">Eventos</span>
                                        </Button>
                                        <Button
                                            variant="outline-success"
                                            className="d-flex flex-column align-items-center"
                                        >
                                            <People size={20} />
                                            <span className="small mt-1">Asistentes</span>
                                        </Button>
                                    </ButtonGroup>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
}

export default AdministrarMisMinisterios;