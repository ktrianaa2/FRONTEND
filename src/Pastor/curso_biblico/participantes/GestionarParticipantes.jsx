import React, { useState, useEffect } from "react";
import { Checkbox, Button, Spin } from "antd";
import { notification } from 'antd';
import API_URL from "../../../../Config";

function GestionarParticipantes({ curso, onClose, onSave }) {
    const [allPersonas, setAllPersonas] = useState([]);
    const [selectedParticipantes, setSelectedParticipantes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchPersonas();
        fetchCurrentParticipantes();
    }, [curso]);

    const showNotification = (type, message, description) => {
        notification[type]({
            message,
            description,
            duration: type === 'error' ? 5 : 4,
            placement: 'topRight',
            style: {
                zIndex: 9999,
            },
        });
    };

    const fetchPersonas = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("authToken");
            const response = await fetch(`${API_URL}/Miembros/personas/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Error al obtener la lista de personas");
            }

            const data = await response.json();
            setAllPersonas(data.personas || []);
        } catch (error) {
            console.error("Error en fetchPersonas:", error);
            showNotification('error', "Error", error.message || "No se pudieron cargar las personas");
        } finally {
            setLoading(false);
        }
    };

    const fetchCurrentParticipantes = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`${API_URL}/Cursos/listar_participantes/${curso.id_curso}/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Error al obtener participantes actuales");
            }

            const data = await response.json();
            setSelectedParticipantes(data.map(p => p.id_persona));
        } catch (error) {
            console.error("Error en fetchCurrentParticipantes:", error);
            showNotification('error', "Error", error.message || "No se pudieron cargar los participantes actuales");
        }
    };

    const handleCheckboxChange = (idPersona) => {
        setSelectedParticipantes(prev => {
            if (prev.includes(idPersona)) {
                return prev.filter(id => id !== idPersona);
            } else {
                return [...prev, idPersona];
            }
        });
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const token = localStorage.getItem("authToken");
            
            const response = await fetch(`${API_URL}/Cursos/registrar_participantes/${curso.id_curso}/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id_curso: curso.id_curso,
                    participantes: selectedParticipantes
                }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.error || "Error al guardar participantes");
            }
    
            onSave();
            onClose();
        } catch (error) {
            api.error({
                message: "Error",
                description: error.message || "No se pudieron guardar los cambios",
                duration: 5,
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>Gestionar Participantes - {curso.nombre}</h4>
                <div className="d-flex gap-2">
                    <Button
                        type="primary"
                        onClick={handleSave}
                        disabled={saving}
                        loading={saving}
                    >
                        {saving ? "Guardando..." : "Guardar"}
                    </Button>
                    <Button onClick={onClose}>Volver</Button>
                </div>
            </div>

            {loading ? (
                <div className="text-center my-4">
                    <Spin size="large" />
                    <p>Cargando lista de personas...</p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Seleccionar</th>
                                <th>Nombre</th>
                                <th>Apellido</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allPersonas.map(persona => (
                                <tr key={persona.id_persona}>
                                    <td>
                                        <Checkbox
                                            checked={selectedParticipantes.includes(persona.id_persona)}
                                            onChange={() => handleCheckboxChange(persona.id_persona)}
                                        />
                                    </td>
                                    <td>{persona.nombres}</td>
                                    <td>{persona.apellidos}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default GestionarParticipantes;