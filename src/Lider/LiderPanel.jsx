import React from "react";
import '../Styles/Panel.css';
import { Card, Row, Col } from "react-bootstrap";

function LiderPanel({ onNavigate }) {
    return (
        <div>
            <Row className="d-flex flex-wrap justify-content-start">
                <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
                    <Card className="hover-relief shadow-sm" style={{ cursor: 'pointer' }} onClick={() => onNavigate("mis_ministerios")}>
                        <Card.Img
                            variant="top"
                            src="/ministerio.png"
                            style={{ maxWidth: '100%', maxHeight: '100px', objectFit: 'contain', marginTop: '10px' }}
                        />
                        <Card.Body>
                            <Card.Title>Administrar Ministerios</Card.Title>
                            <Card.Text>
                                Administrar reuniones y eventos de tus ministerios.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
                    <Card className="hover-relief shadow-sm" style={{ cursor: 'pointer' }} onClick={() => onNavigate("calendario")}>
                        <Card.Img
                            variant="top"
                            src="/calendario.png"
                            style={{ maxWidth: '100%', maxHeight: '100px', objectFit: 'contain', marginTop: '10px' }}
                        />
                        <Card.Body>
                            <Card.Title>Calendario de Actividades</Card.Title>
                            <Card.Text>
                                Vista detallada de la agenda.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
                    <Card className="hover-relief shadow-sm" style={{ cursor: 'pointer' }} onClick={() => onNavigate("reportes")}>
                        <Card.Img
                            variant="top"
                            src="/reportes.png"
                            style={{ maxWidth: '100%', maxHeight: '100px', objectFit: 'contain', marginTop: '10px' }}
                        />
                        <Card.Body>
                            <Card.Title>Reportes</Card.Title>
                            <Card.Text>
                                Genera informes detallados de actividades y contribuciones.                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default LiderPanel;
