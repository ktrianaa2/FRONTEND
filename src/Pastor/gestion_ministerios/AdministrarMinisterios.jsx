import React, { useState, useEffect } from "react";
import MinisteriosTabla from "./tablas/MinisteriosTabla";
import AgregarMinisterio from "./AgregarMinisterio";
import EditarMinisterio from "./EditarMinisterio";
import ModalDeshabilitar from "./modales/ModalDeshabilitar";
import API_URL from "../../../Config";
import { notification } from "antd";

function AdministrarMinisterios() {
    const [search, setSearch] = useState("");
    const [isAgregarOpen, setIsAgregarOpen] = useState(false);
    const [isEditarOpen, setIsEditarOpen] = useState(false);
    const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);
    const [selectedMinisterio, setSelectedMinisterio] = useState(null);
    const [ministerios, setMinisterios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [api, contextHolder] = notification.useNotification();

    // Obtener ministerios desde la API
    useEffect(() => {
        const fetchMinisterios = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('No se encontró token de autenticación');
                }

                const response = await fetch(`${API_URL}/Ministerio/listarministerios/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Error al obtener los ministerios');
                }
                
                const data = await response.json();
                setMinisterios(data.ministerios);
            } catch (err) {
                api.error({
                    message: 'Error',
                    description: err.message,
                    duration: 5,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchMinisterios();
    }, [api]);

    // Filtrar ministerios según búsqueda
    const filteredMinisterios = ministerios.filter((ministerio) =>
        ministerio.nombre.toLowerCase().includes(search.toLowerCase())
    );

    const handleEdit = (ministerio) => {
        setSelectedMinisterio(ministerio);
        setIsEditarOpen(true);
    };

    const handleDisable = (ministerio) => {
        setSelectedMinisterio(ministerio);
        setIsDisableModalOpen(true);
    };

    const confirmDisable = async (ministerio) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_URL}/Ministerio/desactivar/${ministerio.id_ministerio}/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al desactivar el ministerio');
            }

            // Actualizar lista de ministerios
            setMinisterios(ministerios.map(m => 
                m.id_ministerio === ministerio.id_ministerio ? {...m, estado: 'Inactivo'} : m
            ));

            api.success({
                message: 'Éxito',
                description: 'Ministerio desactivado correctamente',
                duration: 3,
            });
        } catch (err) {
            api.error({
                message: 'Error',
                description: err.message,
                duration: 5,
            });
        } finally {
            setIsDisableModalOpen(false);
        }
    };

    const handleAgregarClose = () => {
        setIsAgregarOpen(false);
        // Refrescar lista después de agregar
        setLoading(true);
        setMinisterios([]);
    };

    const handleEditarClose = (updated = false) => {
        setIsEditarOpen(false);
        if (updated) {
            // Refrescar lista si se editó
            setLoading(true);
            setMinisterios([]);
        }
    };

    return (
        <div>
            {contextHolder}
            <h2 className="text-black">Administración de Ministerios</h2>
            <hr />

            {!isAgregarOpen && !isEditarOpen && (
                <div>
                    <div className="d-flex justify-content-between mb-4">
                        <input
                            type="text"
                            placeholder="Buscar ministerio"
                            className="form-control w-50 shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button
                            className="btn btn-success text-white shadow-sm"
                            onClick={() => setIsAgregarOpen(true)}
                        >
                            Agregar Ministerio
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center my-4">Cargando ministerios...</div>
                    ) : (
                        <MinisteriosTabla
                            filteredMinisterios={filteredMinisterios}
                            handleEdit={handleEdit}
                            handleDisable={handleDisable}
                        />
                    )}
                </div>
            )}

            {isAgregarOpen && <AgregarMinisterio onClose={handleAgregarClose} />}
            {isEditarOpen && (
                <EditarMinisterio
                    ministerio={selectedMinisterio}
                    onClose={handleEditarClose}
                />
            )}
            {isDisableModalOpen && (
                <ModalDeshabilitar
                    ministerio={selectedMinisterio}
                    onClose={() => setIsDisableModalOpen(false)}
                    onConfirm={confirmDisable}
                />
            )}
        </div>
    );
}

export default AdministrarMinisterios;