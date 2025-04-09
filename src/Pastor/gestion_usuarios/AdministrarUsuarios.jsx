import React, { useState, useEffect } from "react";
import { notification } from "antd";
import TablaUsuarios from "./Tabla/TablaUsuarios";
import FormularioEditarMiembro from "../gestion_miembros/Formularios/FormularioEditarMiembro";
import DetalleMiembro from "../gestion_miembros/DetalleMiembro";
import API_URL from "../../../Config";

import ModalAsignarLideres from "./Modales/ModalAsignarLideres";
import ModalAsignarPastores from "./Modales/ModalAsignarPastores";

function AdministrarMiembros() {
    const [search, setSearch] = useState("");
    const [personas, setPersonas] = useState([]);
    const [miembroSeleccionadoId, setMiembroSeleccionadoId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEditForm, setShowEditForm] = useState(false);
    const [selectedMiembro, setSelectedMiembro] = useState(null);
    const [api, contextHolder] = notification.useNotification();
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [showPastoresModal, setShowPastoresModal] = useState(false);
    const [showLideresModal, setShowLideresModal] = useState(false);


    const fetchPersonas = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');

            if (!token) throw new Error('No hay sesión activa');

            const response = await fetch(`${API_URL}/Miembros/personas_usuario/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al obtener los datos');
            }

            const data = await response.json();
            setPersonas(Array.isArray(data.personas_con_usuario) ? data.personas_con_usuario : []);
        } catch (err) {
            api.error({
                message: 'Error',
                description: err.message,
                duration: 5,
            });
            setPersonas([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAsignacionExitosa = () => {
        fetchPersonas();
    };
    const handleOpenModal = (type) => {
        setModalType(type);
        setShowModal(true);
    };

    const handlePersonaSeleccionada = async (personasIds) => {
        try {
            const token = localStorage.getItem('authToken');
            const idsArray = Array.isArray(personasIds) ? personasIds : [];

            if (idsArray.length === 0) {
                throw new Error('No se seleccionaron personas');
            }

            const response = await fetch(`${API_URL}/Roles/asignar_pastor/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ personas: idsArray })
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

            // Mostrar errores individuales con nombres
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

            await fetchPersonas();
        } catch (err) {
            api.error({
                message: 'Error',
                description: err.message,
                duration: 5
            });
        }
    };
    useEffect(() => {
        fetchPersonas();
    }, []);


    const handleEditClick = (persona) => {
        setSelectedMiembro(persona);
        setShowEditForm(true);
    };

    const handleCloseForm = () => {
        setShowEditForm(false);
        setSelectedMiembro(null);
    };

    const handleUpdateSuccess = async () => {
        try {
            api.success({
                message: 'Éxito',
                description: 'Los datos del miembro se actualizaron correctamente',
                duration: 3,
            });

            if (fetchPersonas) {
                await fetchPersonas();
            }

            setShowEditForm(false);
            setSelectedMiembro(null);
        } catch (error) {
            api.error({
                message: 'Error',
                description: 'Ocurrió un error al actualizar los datos',
                duration: 5,
            });
        }
    };

    // Modificar el filtrado para manejar casos donde personas no es un array
    const filteredPersonas = Array.isArray(personas)
        ? personas.filter((persona) =>
            `${persona.nombres || ''} ${persona.apellidos || ''} ${persona.numero_cedula || ''}`
                .toLowerCase()
                .includes(search.toLowerCase())
        )
        : [];

    return (
        <div>
            {contextHolder}
            <h2 className="text-black">Administración de Usuarios</h2>
            <hr />

            {miembroSeleccionadoId ? (
                <DetalleMiembro
                    idMiembro={miembroSeleccionadoId}
                    onClose={() => setMiembroSeleccionadoId(null)}
                />
            ) : showEditForm ? (
                <FormularioEditarMiembro
                    miembro={selectedMiembro}
                    onClose={handleCloseForm}
                    onUpdateSuccess={handleUpdateSuccess}
                />
            ) : (
                <div>
                    <div className="d-flex justify-content-between mb-4">
                        <input
                            type="text"
                            placeholder="Buscar usuario"
                            className="form-control w-50 shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className="d-flex flex-wrap gap-2">
                            <button
                                className="btn btn-success text-white shadow-sm"
                                onClick={() => setShowPastoresModal(true)}
                            >
                                Añadir Pastor
                            </button>
                            <button
                                className="btn btn-success text-white shadow-sm"
                                onClick={() => setShowLideresModal(true)}
                            >
                                Añadir Líder
                            </button>
                        </div>

                        <ModalAsignarPastores
                            show={showPastoresModal}
                            onHide={() => setShowPastoresModal(false)}
                            onAsignacionExitosa={handleAsignacionExitosa}
                        />

                        <ModalAsignarLideres
                            show={showLideresModal}
                            onHide={() => setShowLideresModal(false)}
                            onAsignacionExitosa={handleAsignacionExitosa}
                        />
                    </div>

                    {loading ? (
                        <div className="text-center my-4">Cargando usuarios...</div>
                    ) : (
                        <TablaUsuarios
                            usuarios={personas}
                            filteredUsuarios={filteredPersonas}
                            loading={loading}
                            onRefreshData={fetchPersonas}
                            onVerDetalle={(id) => setMiembroSeleccionadoId(id)}
                            onEditar={handleEditClick}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

export default AdministrarMiembros;