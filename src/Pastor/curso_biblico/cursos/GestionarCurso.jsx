import React, { useState, useEffect } from "react";
import { notification } from "antd";
import API_URL from "../../../../Config";
import TablaParticipantes from "../participantes/TablaParticipantes";
import GestionarParticipantes from "../participantes/GestionarParticipantes";

function GestionarCurso({ curso, onClose, onVerDetalle, onEditar }) {
    const [participantes, setParticipantes] = useState([]);
    const [filteredParticipantes, setFilteredParticipantes] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const [showGestionarParticipantes, setShowGestionarParticipantes] = useState(false);

    const fetchParticipantes = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("authToken");
            const response = await fetch(`${API_URL}/Cursos/listar_participantes/${curso.id_curso}/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json(); // Esto puede lanzar un error si no es JSON válido

            if (!response.ok) {
                throw new Error(data.error || "Error al obtener participantes");
            }

            setParticipantes(data);
            setFilteredParticipantes(data);
        } catch (error) {
            console.error("Error en fetchParticipantes:", error);
            api.error({
                message: "Error",
                description: error.message || "No se pudieron cargar los participantes",
                duration: 5,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchParticipantes();
    }, [curso]);

    const handleAgregarParticipante = () => {
        setShowGestionarParticipantes(true);
    };

    const handleParticipantesSaved = () => {
        setShowGestionarParticipantes(false);
        fetchParticipantes().then(() => {
            api.success({
                message: "Participantes actualizados",
                description: "Los cambios se guardaron correctamente",
                duration: 4,
                placement: 'topRight',
            });
        });
    };

    if (showGestionarParticipantes) {
        return (
            <GestionarParticipantes
                curso={curso}
                onClose={() => setShowGestionarParticipantes(false)}
                onSave={handleParticipantesSaved}
            />
        );
    }

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);

        if (value === "") {
            setFilteredParticipantes(participantes);
        } else {
            const filtered = participantes.filter(
                (p) =>
                    p.nombre.toLowerCase().includes(value) ||
                    p.apellido.toLowerCase().includes(value) ||
                    (p.documento && p.documento.toLowerCase().includes(value))
            );
            setFilteredParticipantes(filtered);
        }
    };

    const handleGestionarParticipante = (participante) => {
        console.log("Gestionar participante:", participante);
        api.info({
            message: "Gestión de participante",
            description: `Gestión para ${participante.nombre} ${participante.apellido}`,
            duration: 3,
        });
    };

    return (
        <div>
            {contextHolder}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>{curso.nombre}</h4>
                <div className="d-flex gap-2">
                    <button className="btn-ver" onClick={onVerDetalle}>
                        Ver Detalles
                    </button>
                    <button className="btn-editar" onClick={onEditar}>
                        Editar
                    </button>
                    <button className="btn-cancelar" onClick={onClose}>
                        Volver
                    </button>
                </div>
            </div>
            <p className="mb-4">{curso.descripcion}</p>
            <hr />

            <div className="mb-4">
                <h5>Participantes del Curso</h5>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Buscar participantes..."
                            className="form-control search-input"
                            value={search}
                            onChange={handleSearch}
                        />
                        <i className="bi bi-search search-icon"></i>
                    </div>
                    <button className="btn-guardar" onClick={handleAgregarParticipante}>
                        <i className="bi bi-plus-circle me-1"></i> Gestionar Participante
                    </button>
                </div>

                {loading ? (
                    <div className="text-center my-4">Cargando participantes...</div>
                ) : (
                    <TablaParticipantes
                        participantes={participantes}
                        filteredParticipantes={filteredParticipantes}
                        onRefreshData={fetchParticipantes}
                        onGestionar={handleGestionarParticipante}
                    />
                )}
            </div>
        </div>
    );
}

export default GestionarCurso;