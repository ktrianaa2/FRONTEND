import React, { useState, useEffect } from "react";
import { Modal, Button, ListGroup, Spinner, Alert, Form } from "react-bootstrap";
import { notification } from "antd";
import API_URL from "../../../../Config";

const ModalSeleccionPersona = ({
    show,
    onHide,
    tipoRol,
    onPersonaSeleccionada
}) => {
    const [personas, setPersonas] = useState([]);
    const [ministerios, setMinisterios] = useState([]);
    const [selectedPersona, setSelectedPersona] = useState("");
    const [selectedMinisterio, setSelectedMinisterio] = useState("");
    const [personasSeleccionadas, setPersonasSeleccionadas] = useState([]);
    const [loading, setLoading] = useState({ personas: false, ministerios: false });
    const [submitting, setSubmitting] = useState(false);
    const [asignarAMinisterio, setAsignarAMinisterio] = useState(false);
    const [api, contextHolder] = notification.useNotification();

    // Obtener personas disponibles
    const fetchPersonasDisponibles = async () => {
        try {
            setLoading(prev => ({ ...prev, personas: true }));
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_URL}/Miembros/personas/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setPersonas(Array.isArray(data.personas) ? data.personas : []);
        } catch (err) {
            api.error({ message: 'Error', description: err.message });
        } finally {
            setLoading(prev => ({ ...prev, personas: false }));
        }
    };

    // Obtener ministerios disponibles
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


    // Modificamos el handler del checkbox
    const handleToggleMinisterio = (e) => {
        const checked = e.target.checked;
        setAsignarAMinisterio(checked);
        if (!checked) {
            setSelectedMinisterio(""); // Limpiamos selección de ministerio al desmarcar
        }
    };

    // Modificamos el handler para agregar personas
    const handleAddPersona = () => {
        if (!selectedPersona) return;

        // Si ya hay 2 o más personas y está marcado ministerio, no permitir agregar más
        if (asignarAMinisterio && personasSeleccionadas.length >= 2) {
            api.warning({
                message: 'Límite alcanzado',
                description: 'Solo puedes asignar máximo 2 personas a un ministerio',
                duration: 3,
            });
            return;
        }

        if (!personasSeleccionadas.includes(selectedPersona)) {
            setPersonasSeleccionadas([...personasSeleccionadas, selectedPersona]);
            setSelectedPersona("");

            // Si al agregar superamos 2 personas y estaba marcado ministerio, desmarcamos
            if (asignarAMinisterio && personasSeleccionadas.length + 1 > 2) {
                setAsignarAMinisterio(false);
                setSelectedMinisterio("");
                api.warning({
                    message: 'Aviso',
                    description: 'Has seleccionado más de 2 personas, se desactivó la asignación a ministerio',
                    duration: 3,
                });
            }
        }
    };
    // Remover persona seleccionada
    const handleRemovePersona = (personaId) => {
        setPersonasSeleccionadas(personasSeleccionadas.filter(id => id !== personaId));
    };

    // Confirmar selección
    const handleConfirmSelection = async () => {
        if (personasSeleccionadas.length === 0) {
            api.warning({ message: 'Selección requerida', description: 'Debes seleccionar al menos una persona' });
            return;
        }

        if (asignarAMinisterio && !selectedMinisterio) {
            api.warning({ message: 'Ministerio requerido', description: 'Debes seleccionar un ministerio' });
            return;
        }

        setSubmitting(true);
        try {
            const personasConfirmadas = personasSeleccionadas.map(id =>
                personas.find(p => p.id_persona == id)
            );

            const result = {
                personas: personasConfirmadas,
                ministerio: asignarAMinisterio ? ministerios.find(m => m.id_ministerio == selectedMinisterio) : null
            };

            onPersonaSeleccionada(result);
            onHide();
        } catch (err) {
            api.error({ message: 'Error', description: err.message });
        } finally {
            setSubmitting(false);
        }
    };

    // Resetear estado al cerrar
    const handleClose = () => {
        setPersonasSeleccionadas([]);
        setSelectedMinisterio("");
        setAsignarAMinisterio(false);
        onHide();
    };

    // Cargar datos iniciales
    useEffect(() => {
        if (show) {
            fetchPersonasDisponibles();
            fetchMinisteriosDisponibles();
        }
    }, [show]);




    return (
        <>
            {contextHolder}
            <Modal show={show} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton className="bg-dark text-white">
                    <Modal.Title>
                        Crear {tipoRol === 'pastor' ? 'Pastor(es)' : 'Líder(es)'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loading.personas ? (
                        <div className="text-center my-4">
                            <Spinner animation="border" />
                            <p>Cargando personas disponibles...</p>
                        </div>
                    ) : (
                        <div className="p-3">
                            {/* Checkbox para asignar a ministerio */}
                            <Form.Check
                                type="switch"
                                id="asignar-ministerio"
                                label="Asignar a ministerio"
                                checked={asignarAMinisterio}
                                onChange={handleToggleMinisterio}
                                className="mb-3"
                                disabled={personasSeleccionadas.length > 2} // Deshabilitado si hay más de 2
                            />

                            {/* Mensaje explicativo condicional */}
                            {personasSeleccionadas.length > 2 && (
                                <Alert variant="warning" className="mb-3">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    Para asignar a ministerio, selecciona máximo 2 personas
                                </Alert>
                            )}
                            {asignarAMinisterio && (
                                <Alert variant="info">
                                    <strong>Modo asignación a ministerio:</strong> Puedes seleccionar máximo 2 personas por ministerio
                                </Alert>
                            )}

                            {/* Selector de personas */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">
                                    Seleccionar {tipoRol === 'pastor' ? 'pastor(es)' : 'líder(es)'}
                                </label>
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <select
                                        className="form-select flex-grow-1"
                                        value={selectedPersona}
                                        onChange={(e) => setSelectedPersona(e.target.value)}
                                        disabled={submitting || (asignarAMinisterio && personasSeleccionadas.length >= 2)}
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
                                        disabled={
                                            !selectedPersona ||
                                            submitting ||
                                            (asignarAMinisterio && personasSeleccionadas.length >= 2)
                                        }
                                        style={{ width: '40px', height: '38px', fontSize: '1.2rem' }}
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Selector de ministerio (solo si está marcado el checkbox) */}
                                {asignarAMinisterio && (
                                    <div className="mt-3">
                                        <label className="form-label fw-bold">Ministerio</label>
                                        {loading.ministerios ? (
                                            <Spinner animation="border" size="sm" />
                                        ) : (
                                            <select
                                                className="form-select"
                                                value={selectedMinisterio}
                                                onChange={(e) => setSelectedMinisterio(e.target.value)}
                                                disabled={submitting}
                                            >
                                                <option value="">Seleccione un ministerio</option>
                                                {ministerios.map(ministerio => (
                                                    <option
                                                        key={ministerio.id_ministerio}
                                                        value={ministerio.id_ministerio}
                                                    >
                                                        {ministerio.nombre} - {ministerio.descripcion}
                                                        {ministerio.lider1 && ` (Líder 1: ${ministerio.lider1.nombres})`}
                                                        {ministerio.lider2 && ` (Líder 2: ${ministerio.lider2.nombres})`}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Lista de personas seleccionadas */}
                            {personasSeleccionadas.length > 0 && (
                                <div className="mt-3">
                                    <h6>
                                        {tipoRol === 'pastor' ? 'Pastores' : 'Líderes'} seleccionados:
                                        {asignarAMinisterio && ` (${personasSeleccionadas.length}/2)`}
                                    </h6>
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
                        disabled={
                            personasSeleccionadas.length === 0 ||
                            submitting ||
                            (asignarAMinisterio && !selectedMinisterio)
                        }
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

export default ModalSeleccionPersona;