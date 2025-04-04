import React from "react";
import '../Styles.css';
import { Card, Row, Col } from "react-bootstrap";

function PastorPanel({ onNavigate }) {
    return (
        <div>
            <Row className="d-flex flex-wrap justify-content-start">
                <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
                    <Card className="hover-relief shadow-sm" style={{ cursor: 'pointer' }} onClick={() => onNavigate("miembros")}>
                        <Card.Img
                            variant="top"
                            src="/miembros.png"
                            style={{ maxWidth: '100%', maxHeight: '100px', objectFit: 'contain', marginTop: '10px' }}
                        />
                        <Card.Body>
                            <Card.Title>Gestión de Miembros</Card.Title>
                            <Card.Text>
                                Administra los miembros de la iglesia.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
                    <Card className="hover-relief shadow-sm" style={{ cursor: 'pointer' }} onClick={() => onNavigate("ministerios")}>
                        <Card.Img
                            variant="top"
                            src="/ministerios.png"
                            style={{ maxWidth: '100%', maxHeight: '100px', objectFit: 'contain', marginTop: '10px' }}
                        />
                        <Card.Body>
                            <Card.Title>Gestión de Ministerios</Card.Title>
                            <Card.Text>
                                Controla y asigna ministerios a los líderes.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

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
                    <Card className="hover-relief shadow-sm" style={{ cursor: 'pointer' }} onClick={() => onNavigate("eventos")}>
                        <Card.Img
                            variant="top"
                            src="/eventos.png"
                            style={{ maxWidth: '100%', maxHeight: '100px', objectFit: 'contain', marginTop: '10px' }}
                        />
                        <Card.Body>
                            <Card.Title>Gestión de Eventos</Card.Title>
                            <Card.Text>
                                Organiza y gestiona eventos y actividades.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
                    <Card className="hover-relief shadow-sm" style={{ cursor: 'pointer' }} onClick={() => onNavigate("diezmos")}>
                        <Card.Img
                            variant="top"
                            src="/diezmos.png"
                            style={{ maxWidth: '100%', maxHeight: '100px', objectFit: 'contain', marginTop: '10px' }}
                        />
                        <Card.Body>
                            <Card.Title>Gestión de Diezmos</Card.Title>
                            <Card.Text>
                                Lleva un registro de los diezmos y ofrendas.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
                    <Card className="hover-relief shadow-sm" style={{ cursor: 'pointer' }} onClick={() => onNavigate("curso")}>
                        <Card.Img
                            variant="top"
                            src="/curso.png"
                            style={{ maxWidth: '100%', maxHeight: '100px', objectFit: 'contain', marginTop: '10px' }}
                        />
                        <Card.Body>
                            <Card.Title>Curso Bíblico</Card.Title>
                            <Card.Text>
                                Administra los cursos bíblicos disponibles.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
                    <Card className="hover-relief shadow-sm" style={{ cursor: 'pointer' }} onClick={() => onNavigate("familias")}>
                        <Card.Img
                            variant="top"
                            src="/familiasevento.png"
                            style={{ maxWidth: '100%', maxHeight: '100px', objectFit: 'contain', marginTop: '10px' }}
                        />
                        <Card.Body>
                            <Card.Title>Familias al Encuentro con Jesús</Card.Title>
                            <Card.Text>
                                Organiza y gestiona este ministerio de familias.
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

export default PastorPanel;
