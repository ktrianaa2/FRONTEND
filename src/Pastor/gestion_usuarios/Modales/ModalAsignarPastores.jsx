import React, { useState, useEffect } from "react";
import { Modal, Button, ListGroup, Spinner } from "react-bootstrap";
import { notification } from "antd";
import API_URL from "../../../../Config";

const ModalAsignarPastores = ({ show, onHide, onAsignacionExitosa }) => {
    const [personas, setPersonas] = useState([]);
    const [selectedPersona, setSelectedPersona] = useState("");
    const [personasSeleccionadas, setPersonasSeleccionadas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [api, contextHolder] = notification.useNotification();

    const fetchPersonasDisponibles = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_URL}/Miembros/personas_sinusuario/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const data = await response.json();
            setPersonas(Array.isArray(data.personas_sin_usuario) ? data.personas_sin_usuario : []);
        } catch (err) {
            api.error({ message: 'Error', description: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleAddPersona = () => {
        if (!selectedPersona) return;
        if (!personasSeleccionadas.includes(selectedPersona)) {
            setPersonasSeleccionadas([...personasSeleccionadas, selectedPersona]);
            setSelectedPersona("");
        }
    };

    const handleRemovePersona = (personaId) => {
        setPersonasSeleccionadas(personasSeleccionadas.filter(id => id !== personaId));
    };

    const handleConfirmSelection = async () => {
        if (personasSeleccionadas.length === 0) {
            api.warning({ message: 'Selección requerida', description: 'Debes seleccionar al menos una persona' });
            return;
        }

        setSubmitting(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_URL}/Roles/asignar_pastor/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ personas: personasSeleccionadas })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al asignar pastores');
            }

            const responseData = await response.json();

            // Mostrar resultados
            if (responseData.estado === 'completado') {
                api.success({
                    message: 'Éxito',
                    description: `Se asignaron ${responseData.pastores_asignados} pastores`,
                    duration: 5
                });
            }

            // Mostrar errores individuales
            if (responseData.personas_rechazadas?.length > 0) {
                responseData.personas_rechazadas.forEach(p => {
                    const nombre = p.nombre_completo || `Persona ${p.id_persona}`;
                    api.warning({
                        message: nombre,
                        description: p.error,
                        duration: 5
                    });
                });
            }

            onAsignacionExitosa();
            handleClose();
        } catch (err) {
            api.error({ message: 'Error', description: err.message });
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setPersonasSeleccionadas([]);
        setSelectedPersona("");
        onHide();
    };

    useEffect(() => {
        if (show) {
            fetchPersonasDisponibles();
        }
    }, [show]);

    return (
        <>
            {contextHolder}
            <Modal show={show} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton className="bg-dark text-white">
                    <Modal.Title>Asignar Pastores</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loading ? (
                        <div className="text-center my-4">
                            <Spinner animation="border" />
                            <p>Cargando personas disponibles...</p>
                        </div>
                    ) : (
                        <div className="p-3">
                            <div className="mb-3">
                                <label className="form-label fw-bold">Seleccionar pastor(es)</label>
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <select
                                        className="form-select flex-grow-1"
                                        value={selectedPersona}
                                        onChange={(e) => setSelectedPersona(e.target.value)}
                                        disabled={submitting}
                                    >
                                        <option value="">Seleccione una persona</option>
                                        {personas.map(persona => (
                                            <option
                                                key={persona.id_persona}
                                                value={persona.id_persona}
                                                disabled={personasSeleccionadas.includes(persona.id_persona)}
                                            >
                                                {persona.nombres} {persona.apellidos} - {persona.numero_cedula}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        className="btn btn-success"
                                        onClick={handleAddPersona}
                                        disabled={!selectedPersona || submitting}
                                        style={{ width: '40px', height: '38px', fontSize: '1.2rem' }}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {personasSeleccionadas.length > 0 && (
                                <div className="mt-3">
                                    <h6>Pastores seleccionados:</h6>
                                    <ListGroup>
                                        {personasSeleccionadas.map(personaId => {
                                            const persona = personas.find(p => p.id_persona == personaId);
                                            return (
                                                <ListGroup.Item
                                                    key={personaId}
                                                    className="d-flex justify-content-between align-items-center"
                                                >
                                                    <div>
                                                        <strong>{persona?.nombres} {persona?.apellidos}</strong>
                                                        <div className="text-muted small">
                                                            Cédula: {persona?.numero_cedula}
                                                        </div>
                                                    </div>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleRemovePersona(personaId)}
                                                        disabled={submitting}
                                                        style={{ width: '30px', height: '30px', fontSize: '1.2rem' }}
                                                    >
                                                        ×
                                                    </button>
                                                </ListGroup.Item>
                                            );
                                        })}
                                    </ListGroup>
                                </div>
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
                        disabled={personasSeleccionadas.length === 0 || submitting}
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

export default ModalAsignarPastores;