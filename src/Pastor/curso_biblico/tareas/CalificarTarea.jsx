import React, { useState, useEffect } from "react";
import { Table, Input, Button, notification, Spin } from "antd";
import API_URL from "../../../../Config";

function CalificarTarea({ tarea, onClose, onSuccess }) {
    const [participantes, setParticipantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const [calificaciones, setCalificaciones] = useState({});

    useEffect(() => {
        fetchParticipantesYCalificaciones();
    }, [tarea]);

    const fetchParticipantesYCalificaciones = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("authToken");

            // Usamos el nuevo endpoint que obtiene todo en una sola llamada
            const response = await fetch(
                `${API_URL}/Cursos/listar_calificaciones_tarea/${tarea.id_tarea}/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Error al obtener participantes y calificaciones");
            }

            const data = await response.json();

            // Crear el mapa de calificaciones
            const calificacionesMap = {};
            data.participantes.forEach(participante => {
                calificacionesMap[participante.id_persona] = participante.nota;
            });

            setCalificaciones(calificacionesMap);
            setParticipantes(data.participantes);
        } catch (error) {
            api.error({
                message: "Error",
                description: error.message || "No se pudieron cargar los participantes y calificaciones",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCalificacionChange = (idPersona, value) => {
        setCalificaciones(prev => ({
            ...prev,
            [idPersona]: value
        }));
    };

    const guardarCalificaciones = async () => {
        try {
            setSaving(true);
            const token = localStorage.getItem("authToken");
            const calificacionesArray = [];
            const eliminadasArray = [];

            Object.entries(calificaciones).forEach(([id_persona, nota]) => {
                const id = parseInt(id_persona);
                if (nota !== null && nota !== '' && !isNaN(parseFloat(nota))) {
                    calificacionesArray.push({
                        id_persona: id,
                        nota: parseFloat(nota)
                    });
                } else {
                    eliminadasArray.push(id);
                }
            });

            const response = await fetch(`${API_URL}/Cursos/registrar_calificaciones/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id_tarea: tarea.id_tarea,
                    calificaciones: calificacionesArray,
                    eliminadas: eliminadasArray
                }),
            });

            if (!response.ok) {
                throw new Error("Error al guardar calificaciones");
            }

            api.success({
                message: "Éxito",
                description: "Calificaciones guardadas correctamente",
                duration: 3,
            });

            if (onSuccess) onSuccess();
        } catch (error) {
            api.error({
                message: "Error",
                description: error.message || "Error al guardar calificaciones",
                duration: 5,
            });
        } finally {
            setSaving(false);
        }
    };

    const columns = [
        {
            title: 'Participante',
            dataIndex: 'nombre_completo',
            key: 'nombre',
            render: (_, record) => (
                <span>
                    {record.nombres} {record.apellidos}
                </span>
            ),
        },
        {
            title: 'Calificación',
            dataIndex: 'id_persona',
            key: 'calificacion',
            render: (id_persona) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={calificaciones[id_persona] !== null && calificaciones[id_persona] !== undefined ? calificaciones[id_persona] : ''}
                        onChange={(e) => handleCalificacionChange(id_persona, e.target.value)}
                        style={{ width: '100px' }}
                    />
                    <Button
                        type="text"
                        danger
                        onClick={() => handleCalificacionChange(id_persona, null)}
                        title="Borrar calificación"
                    >
                        ❌
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            {contextHolder}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Calificar Tarea: {tarea.titulo}</h3>
            </div>

            {loading ? (
                <div className="text-center my-4">
                    <Spin size="large" />
                    <p>Cargando participantes y calificaciones...</p>
                </div>
            ) : (
                <>
                    <Table
                        columns={columns}
                        dataSource={participantes}
                        rowKey="id_persona"
                        pagination={false}
                        bordered
                    />

                    <div className="d-flex justify-content-end mt-3">
                        <Button onClick={onClose} className="btn-cancelar">
                            Volver
                        </Button>

                        ㅤ
                        <Button
                            type="primary"
                            onClick={guardarCalificaciones}
                            loading={saving}
                            disabled={saving}
                        >
                            {saving ? 'Guardando...' : 'Guardar Calificaciones'}
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}

export default CalificarTarea;