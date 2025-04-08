import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner, Alert, Form } from "react-bootstrap";
import { notification } from "antd";
import API_URL from "../../../../Config";

const ModalAsignarLideres = ({ show, onHide, onAsignacionExitosa }) => {
    const [personas, setPersonas] = useState([]);
    const [ministerios, setMinisterios] = useState([]);
    const [selectedMinisterio, setSelectedMinisterio] = useState(null);
    const [lider1, setLider1] = useState("");
    const [lider2, setLider2] = useState("");
    const [loading, setLoading] = useState({ personas: false, ministerios: false });
    const [submitting, setSubmitting] = useState(false);
    const [api, contextHolder] = notification.useNotification();

    const fetchPersonasDisponibles = async () => {
        try {
            setLoading(prev => ({ ...prev, personas: true }));
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_URL}/Miembros/personas/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const data = await response.json();
            setPersonas(Array.isArray(data.personas_sin_usuario) ? data.personas_sin_usuario : []);
        } catch (err) {
            api.error({ message: 'Error', description: err.message });
        } finally {
            setLoading(prev => ({ ...prev, personas: false }));
        }
    };

    const fetchMinisteriosDisponibles = async () => {
        try {
            setLoading(prev => ({ ...prev, ministerios: true }));
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_URL}/Ministerio/listarministerios/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setMinisterios(Array.isArray(data.ministerios) ? data.ministerios : []);
        } catch (err) {
            api.error({ message: 'Error', description: err.message });
        } finally {
            setLoading(prev => ({ ...prev, ministerios: false }));
        }
    };

    const handleConfirmSelection = async () => {
        if (!selectedMinisterio) {
            api.warning({ message: 'Ministerio requerido', description: 'Debes seleccionar un ministerio' });
            return;
        }

        if (!lider1 && !lider2) {
            api.warning({ message: 'Líderes requeridos', description: 'Debes seleccionar al menos un líder' });
            return;
        }

        setSubmitting(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_URL}/Roles/asignar_lideres/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ministerio: selectedMinisterio,
                    lider1: lider1 || null,
                    lider2: lider2 || null
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al asignar líderes');
            }

            const responseData = await response.json();

            api.success({
                message: 'Éxito',
                description: `Líderes asignados al ministerio: ${responseData.ministerio.nombre}`,
                duration: 5
            });

            onAsignacionExitosa();
            handleClose();
        } catch (err) {
            api.error({ message: 'Error', description: err.message });
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setSelectedMinisterio(null);
        setLider1("");
        setLider2("");
        onHide();
    };

    useEffect(() => {
        if (show) {
            fetchPersonasDisponibles();
            fetchMinisteriosDisponibles();
        }
    }, [show]);

    const ministerioSeleccionado = ministerios.find(m => m.id_ministerio == selectedMinisterio);

    return (
        <>
            {contextHolder}
            <Modal show={show} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton className="bg-dark text-white">
                    <Modal.Title>Asignar Líderes a Ministerio</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loading.personas || loading.ministerios ? (
                        <div className="text-center my-4">
                            <Spinner animation="border" />
                            <p>Cargando datos...</p>
                        </div>
                    ) : (
                        <div className="p-3">
                            <div className="mb-4">
                                <Form.Group>
                                    <Form.Label className="fw-bold">Seleccionar Ministerio</Form.Label>
                                    <Form.Select
                                        value={selectedMinisterio || ""}
                                        onChange={(e) => setSelectedMinisterio(e.target.value ? parseInt(e.target.value) : null)}
                                        disabled={submitting}
                                    >
                                        <option value="">Seleccione un ministerio</option>
                                        {ministerios.map(ministerio => (
                                            <option
                                                key={ministerio.id_ministerio}
                                                value={ministerio.id_ministerio}
                                            >
                                                {ministerio.nombre} - {ministerio.descripcion}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                {ministerioSeleccionado && (
                                    <div className="mt-3">
                                        <Alert variant="info">
                                            <div className="d-flex justify-content-between">
                                                <div>
                                                    <strong>Líder 1 actual:</strong> 
                                                    {ministerioSeleccionado.lider1 
                                                        ? `${ministerioSeleccionado.lider1.nombres} ${ministerioSeleccionado.lider1.apellidos}`
                                                        : 'No asignado'}
                                                </div>
                                                <div>
                                                    <strong>Líder 2 actual:</strong> 
                                                    {ministerioSeleccionado.lider2 
                                                        ? `${ministerioSeleccionado.lider2.nombres} ${ministerioSeleccionado.lider2.apellidos}`
                                                        : 'No asignado'}
                                                </div>
                                            </div>
                                        </Alert>
                                    </div>
                                )}
                            </div>

                            {selectedMinisterio && (
                                <>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <Form.Group>
                                                <Form.Label className="fw-bold">Líder 1</Form.Label>
                                                <Form.Select
                                                    value={lider1}
                                                    onChange={(e) => setLider1(e.target.value || "")}
                                                    disabled={submitting}
                                                >
                                                    <option value="">Seleccione líder 1</option>
                                                    {personas.map(persona => (
                                                        <option
                                                            key={`l1-${persona.id_persona}`}
                                                            value={persona.id_persona}
                                                            disabled={persona.id_persona == lider2}
                                                        >
                                                            {persona.nombres} {persona.apellidos} - {persona.numero_cedula}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-6">
                                            <Form.Group>
                                                <Form.Label className="fw-bold">Líder 2</Form.Label>
                                                <Form.Select
                                                    value={lider2}
                                                    onChange={(e) => setLider2(e.target.value || "")}
                                                    disabled={submitting}
                                                >
                                                    <option value="">Seleccione líder 2</option>
                                                    {personas.map(persona => (
                                                        <option
                                                            key={`l2-${persona.id_persona}`}
                                                            value={persona.id_persona}
                                                            disabled={persona.id_persona == lider1}
                                                        >
                                                            {persona.nombres} {persona.apellidos} - {persona.numero_cedula}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </div>
                                    </div>

                                    <Alert variant="warning" className="mt-3">
                                        <i className="bi bi-info-circle-fill me-2"></i>
                                        Puedes asignar uno o ambos líderes. Si dejas un campo vacío, se mantendrá el líder actual o se dejará sin asignar.
                                    </Alert>
                                </>
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} disabled={submitting}>
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleConfirmSelection}
                        disabled={!selectedMinisterio || submitting}
                    >
                        {submitting ? (
                            <>
                                <Spinner as="span" animation="border" size="sm" />
                                <span className="ms-2">Procesando...</span>
                            </>
                        ) : 'Confirmar'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ModalAsignarLideres;