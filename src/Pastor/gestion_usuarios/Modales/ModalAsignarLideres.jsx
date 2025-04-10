import React, { useState, useEffect } from "react";
import { Modal, Alert } from "react-bootstrap";
import { notification } from "antd";
import API_URL from "../../../../Config";
import "../../../Styles/Modal.css"

const ModalAsignarLideres = ({ show, onHide, onAsignacionExitosa }) => {
    const [personas, setPersonas] = useState([]);
    const [ministerios, setMinisterios] = useState([]);
    const [selectedMinisterio, setSelectedMinisterio] = useState(null);
    const [lider1, setLider1] = useState("");
    const [lider2, setLider2] = useState("");
    const [loading, setLoading] = useState({ personas: false, ministerios: false });
    const [submitting, setSubmitting] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const ministerioSeleccionado = ministerios.find(m => m.id_ministerio == selectedMinisterio);

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

        // Validar que no sea la misma persona para ambos roles
        if (lider1 && lider2 && lider1 === lider2) {
            api.error({
                message: 'Error de selección',
                description: 'Una persona no puede ser líder 1 y líder 2 simultáneamente',
                duration: 5
            });
            return;
        }

        setSubmitting(true);
        try {
            const token = localStorage.getItem('authToken');
            const formData = new FormData();
            formData.append('ministerio_id', selectedMinisterio);

            // Siempre enviamos los dos líderes para asegurar que el backend tenga toda la información
            // En lugar de solo enviar los que han cambiado
            formData.append('lider1_id', lider1);
            formData.append('lider2_id', lider2);

            const response = await fetch(`${API_URL}/Roles/asignar_lider/`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            const responseData = await response.json();

            if (!response.ok) {
                // Manejar específicamente el error de perfil incompleto
                if (responseData.error === 'Perfil incompleto' && responseData.detalle) {
                    throw new Error(responseData.detalle);
                }
                throw new Error(responseData.error || 'Error al asignar líderes');
            }

            api.success({
                message: 'Éxito',
                description: `Líderes asignados correctamente al ministerio: ${ministerioSeleccionado.nombre}`,
                duration: 5
            });

            if (responseData.usuarios_desactivados) {
                api.info({
                    message: 'Usuarios afectados',
                    description: `Se desactivaron ${responseData.usuarios_desactivados.length} usuarios anteriores`,
                    duration: 8
                });
            }

            onAsignacionExitosa();
            handleClose();
        } catch (err) {
            api.error({
                message: 'Error',
                description: err.message,
                duration: 5
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        onHide();
    };

    // Resetear cuando show cambia a false
    useEffect(() => {
        if (!show) {
            setSelectedMinisterio(null);
            setLider1("");
            setLider2("");
        }
    }, [show]);

    // Cargar los líderes actuales cuando se selecciona un ministerio
    useEffect(() => {
        if (selectedMinisterio && ministerioSeleccionado) {
            setLider1(ministerioSeleccionado.lider1?.id_persona || "");
            setLider2(ministerioSeleccionado.lider2?.id_persona || "");
        }
    }, [selectedMinisterio, ministerioSeleccionado]);

    useEffect(() => {
        if (show) {
            fetchPersonasDisponibles();
            fetchMinisteriosDisponibles();
        }
    }, [show]);

    return (
        <>
            {contextHolder}
            <Modal show={show} onHide={handleClose} size="lg" centered className="modal-container">
                <Modal.Header closeButton className="modal-header">
                    <Modal.Title className="modal-title">Asignar Líderes a Ministerio</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body">
                    {loading.personas || loading.ministerios ? (
                        <div className="modal-loading">
                            <div className="modal-spinner"></div>
                            <p>Cargando datos...</p>
                        </div>
                    ) : (
                        <div className="modal-body-content">
                            <div className="mb-4">
                                <div className="modal-form-group">
                                    <label className="modal-form-label">Seleccionar Ministerio</label>
                                    <select
                                        className="modal-form-select"
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
                                    </select>
                                </div>

                                {ministerioSeleccionado && (
                                    <div className="mt-3">
                                        <Alert variant="info" className="modal-alerta modal-alerta-info">
                                            <div className="d-flex justify-content-between">
                                                <div>
                                                    <strong>Líder 1 actual:</strong>{' '}
                                                    {ministerioSeleccionado.lider1
                                                        ? `${ministerioSeleccionado.lider1.nombres} ${ministerioSeleccionado.lider1.apellidos}`
                                                        : 'No asignado'}
                                                </div>
                                                <div>
                                                    <strong>Líder 2 actual:</strong>{' '}
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
                                            <div className="modal-form-group">
                                                <label className="modal-form-label">Líder 1</label>
                                                <select
                                                    className="modal-form-select"
                                                    value={lider1}
                                                    onChange={(e) => {
                                                        const newLider1 = e.target.value || "";
                                                        setLider1(newLider1);

                                                        if (newLider1 === lider2) {
                                                            setLider2("");
                                                        }
                                                    }}
                                                    disabled={submitting}
                                                >
                                                    <option value="">Seleccione líder 1</option>
                                                    {personas.map(persona => {
                                                        const esLider2Seleccionado = persona.id_persona == lider2;
                                                        return (
                                                            <option
                                                                key={`l1-${persona.id_persona}`}
                                                                value={persona.id_persona}
                                                                disabled={esLider2Seleccionado}
                                                            >
                                                                {persona.nombres} {persona.apellidos} - {persona.numero_cedula}
                                                                {esLider2Seleccionado && " (Seleccionado como Líder 2)"}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="modal-form-group">
                                                <label className="modal-form-label">Líder 2</label>
                                                <select
                                                    className="modal-form-select"
                                                    value={lider2}
                                                    onChange={(e) => {
                                                        const newLider2 = e.target.value || "";
                                                        setLider2(newLider2);

                                                        if (newLider2 === lider1) {
                                                            setLider1("");
                                                        }
                                                    }}
                                                    disabled={submitting}
                                                >
                                                    <option value="">Seleccione líder 2</option>
                                                    {personas.map(persona => {
                                                        const esLider1Seleccionado = persona.id_persona == lider1;
                                                        return (
                                                            <option
                                                                key={`l2-${persona.id_persona}`}
                                                                value={persona.id_persona}
                                                                disabled={esLider1Seleccionado}
                                                            >
                                                                {persona.nombres} {persona.apellidos} - {persona.numero_cedula}
                                                                {esLider1Seleccionado && " (Seleccionado como Líder 1)"}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <Alert variant="warning" className="modal-alerta modal-alerta-advertencia">
                                        <i className="bi bi-info-circle-fill me-2"></i>
                                        Puedes asignar uno o ambos líderes. Si dejas un campo vacío, se eliminará el líder actual de ese puesto.
                                        No se permite asignar la misma persona como Líder 1 y Líder 2 simultáneamente.
                                    </Alert>
                                </>
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
                            disabled={!selectedMinisterio || submitting}
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

export default ModalAsignarLideres;