import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col, Alert, Card } from "react-bootstrap";
import { notification } from "antd";
import API_URL from "../../../../Config";

// Modify the component props to accept an onUpdateSuccess callback
function FormularioEditarMiembro({ miembro, onClose, onUpdateSuccess }) {
    const [formData, setFormData] = useState({
        numero_cedula: "",
        nombres: "",
        apellidos: "",
        fecha_nacimiento: "",
        genero: "",
        celular: "",
        direccion: "",
        correo_electronico: "",
        nivel_estudio: "",
        nacionalidad: "",
        profesion: "",
        estado_civil: "",
        lugar_trabajo: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        if (miembro) {
            setFormData({
                numero_cedula: miembro.numero_cedula || "",
                nombres: miembro.nombres || "",
                apellidos: miembro.apellidos || "",
                fecha_nacimiento: miembro.fecha_nacimiento || "",
                genero: miembro.genero || "",
                celular: miembro.celular || "",
                direccion: miembro.direccion || "",
                correo_electronico: miembro.correo_electronico || "",
                nivel_estudio: miembro.nivel_estudio || "",
                nacionalidad: miembro.nacionalidad || "",
                profesion: miembro.profesion || "",
                estado_civil: miembro.estado_civil || "",
                lugar_trabajo: miembro.lugar_trabajo || ""
            });
        }
    }, [miembro]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error("No se encontró el token de autenticación");
            }

            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });

            const response = await fetch(`${API_URL}/Miembros/editarpersonas/${miembro.id_persona}/actualizar/`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formDataToSend
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al actualizar el miembro");
            }

            // Solo llama al callback de éxito, no cierres el formulario aquí
            if (onUpdateSuccess) {
                await onUpdateSuccess(); // Añade await
            }

        } catch (error) {
            api.error({
                message: 'Error',
                description: error.message,
                duration: 5,
            });
        } finally {
            setLoading(false);
        }
    };


    return (
        <Card className="shadow">
            {contextHolder}
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Editar Miembro</h5>
                <Button variant="light" size="sm" onClick={onClose}>
                    Volver al listado
                </Button>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Cédula</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="numero_cedula"
                                    value={formData.numero_cedula}
                                    onChange={handleChange}
                                // Ya no es required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombres</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombres"
                                    value={formData.nombres}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Apellidos</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="apellidos"
                                    value={formData.apellidos}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Fecha de Nacimiento</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="fecha_nacimiento"
                                    value={formData.fecha_nacimiento}
                                    onChange={handleChange}
                                // Ya no es required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Género</Form.Label>
                                <Form.Select
                                    name="genero"
                                    value={formData.genero}
                                    onChange={handleChange}
                                // Ya no es required
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Femenino">Femenino</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Celular</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="celular"
                                    value={formData.celular}
                                    onChange={handleChange}
                                // Ya no es required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Dirección</Form.Label>
                        <Form.Control
                            type="text"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                        // Ya no es required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Correo Electrónico</Form.Label>
                        <Form.Control
                            type="email"
                            name="correo_electronico"
                            value={formData.correo_electronico}
                            onChange={handleChange}
                        // Ya no es required
                        />
                    </Form.Group>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nivel de Estudio</Form.Label>
                                <Form.Select
                                    name="nivel_estudio"
                                    value={formData.nivel_estudio}
                                    onChange={handleChange}
                                // Remove the required attribute
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="Primaria">Primaria</option>
                                    <option value="Secundaria">Secundaria</option>
                                    <option value="Técnico">Técnico</option>
                                    <option value="Universidad">Universidad</option>
                                    <option value="Postgrado">Postgrado</option>
                                    <option value="Ninguno">Ninguno</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nacionalidad</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nacionalidad"
                                    value={formData.nacionalidad}
                                    onChange={handleChange}
                                // Also remove required from here
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Profesión</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="profesion"
                                    value={formData.profesion}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Estado Civil</Form.Label>
                                <Form.Select
                                    name="estado_civil"
                                    value={formData.estado_civil}
                                    onChange={handleChange}
                                // Remove required from here too
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="Soltero/a">Soltero/a</option>
                                    <option value="Casado/a">Casado/a</option>
                                    <option value="Divorciado/a">Divorciado/a</option>
                                    <option value="Viudo/a">Viudo/a</option>
                                    <option value="Unión libre">Unión libre</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Lugar de Trabajo</Form.Label>
                        <Form.Control
                            type="text"
                            name="lugar_trabajo"
                            value={formData.lugar_trabajo}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-between mt-4">
                        <Button variant="secondary" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
}

export default FormularioEditarMiembro;