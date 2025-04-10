import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { notification } from "antd";
import API_URL from "../../../../Config";
import "../../../Styles/Modal.css"

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
            <Modal show={show} onHide={handleClose} size="lg" centered className="modal-container">
                <Modal.Header closeButton className="modal-header">
                    <Modal.Title className="modal-title">Asignar Pastores</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body">
                    {loading ? (
                        <div className="modal-loading">
                            <div className="modal-spinner"></div>
                            <p>Cargando personas disponibles...</p>
                        </div>
                    ) : (
                        <div className="modal-body-content">
                            <div className="mb-3">
                                <label className="modal-form-label">Seleccionar pastor(es)</label>
                                <div className="contenedor-select-pastor">
                                    <select
                                        className="modal-form-select"
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
                                        className="modal-btn btn-agregar"
                                        onClick={handleAddPersona}
                                        disabled={!selectedPersona || submitting}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {personasSeleccionadas.length > 0 && (
                                <div className="mt-3">
                                    <h6 className="titulo-pastores-seleccionados">Pastores seleccionados:</h6>
                                    <div className="lista-pastores">
                                        <ul className="lista-pastores-ul">
                                            {personasSeleccionadas.map(personaId => {
                                                const persona = personas.find(p => p.id_persona == personaId);
                                                return (
                                                    <li key={personaId} className="item-pastor">
                                                        <div className="info-pastor">
                                                            <strong className="nombre-pastor">{persona?.nombres} {persona?.apellidos}</strong>
                                                            <div className="cedula-pastor">
                                                                Cédula: {persona?.numero_cedula}
                                                            </div>
                                                        </div>
                                                        <button
                                                            className="btn-eliminar-pastor"
                                                            onClick={() => handleRemovePersona(personaId)}
                                                            disabled={submitting}
                                                        >
                                                            ×
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className="modal-footer">
                    <div className="modal-footer-buttons">
                        <button
                            className="modal-btn btn-cancelar"
                            onClick={handleClose}
                            disabled={submitting}
                        >
                            Cancelar
                        </button>
                        <button
                            className="modal-btn btn-guardar"
                            onClick={handleConfirmSelection}
                            disabled={personasSeleccionadas.length === 0 || submitting}
                        >
                            {submitting ? (
                                <>
                                    <span className="modal-spinner"></span>
                                    <span className="ms-2">Procesando...</span>
                                </>
                            ) : 'Confirmar'}
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ModalAsignarPastores;