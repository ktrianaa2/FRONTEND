import React, { useState, useEffect } from "react";
import { notification } from "antd";
import DetalleCurso from "./DetalleCurso";
import TablaCursos from "./Tabla/TablaCursos";
import FormularioCrearCurso from "./Formularios/FormularioCurso";
import FormularioEditarCurso from "./Formularios/FormularioEditarCurso";
import API_URL from "../../../Config";

function AdministrarCursos() {
    const [api, contextHolder] = notification.useNotification();
    const [search, setSearch] = useState("");
    const [cursos, setCursos] = useState([]);
    const [cursoSeleccionadoId, setCursoSeleccionadoId] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [selectedCurso, setSelectedCurso] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCursos = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("authToken");
            if (!token) throw new Error("No hay sesión activa");

            const response = await fetch(`${API_URL}/Cursos/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al obtener los cursos");
            }

            const data = await response.json();
            setCursos(data);
        } catch (err) {
            api.error({
                message: "Error",
                description: err.message,
                duration: 5,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCursos();
    }, []);

    const toggleFormulario = () => {
        setMostrarFormulario(!mostrarFormulario);
    };

    const handleSuccess = () => {
        fetchCursos();
        toggleFormulario();
        api.success({
            message: "Éxito",
            description: "Curso creado correctamente",
            duration: 3,
        });
    };

    const handleEditClick = (curso) => {
        setSelectedCurso(curso);
        setShowEditForm(true);
    };

    const handleCloseForm = () => {
        setShowEditForm(false);
        setSelectedCurso(null);
    };

    const handleUpdateSuccess = async () => {
        try {
            api.success({
                message: "Éxito",
                description: "Los datos del curso se actualizaron correctamente",
                duration: 3,
            });

            await fetchCursos();
            setShowEditForm(false);
            setSelectedCurso(null);
        } catch (error) {
            api.error({
                message: "Error",
                description: "Ocurrió un error al actualizar el curso",
                duration: 5,
            });
        }
    };

    const filteredCursos = cursos.filter((curso) =>
        `${curso.nombre}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            {contextHolder}
            <h2 className="text-black">Administración de Cursos Bíblicos</h2>
            <hr />

            {cursoSeleccionadoId ? (
                <DetalleCurso
                    idCurso={cursoSeleccionadoId}
                    onClose={() => setCursoSeleccionadoId(null)}
                />
            ) : showEditForm ? (
                <FormularioEditarCurso
                    curso={selectedCurso}
                    onClose={handleCloseForm}
                    onUpdateSuccess={handleUpdateSuccess}
                />
            ) : mostrarFormulario ? (
                <FormularioCrearCurso
                    onClose={toggleFormulario}
                    onSuccess={handleSuccess}
                />
            ) : (
                <div>
                    <div className="d-flex justify-content-between mb-4">
                        <input
                            type="text"
                            placeholder="Buscar curso"
                            className="form-control w-50 shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button
                            className="btn btn-success text-white shadow-sm"
                            onClick={toggleFormulario}
                            disabled={loading}
                        >
                            <i
                                className={`bi ${mostrarFormulario ? "bi-x-circle" : "bi-plus-circle"
                                    } me-1`}
                            ></i>
                            {mostrarFormulario ? "Cancelar" : "Nuevo Curso"}
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center my-4">Cargando cursos...</div>
                    ) : (
                        <TablaCursos
                            cursos={cursos}
                            filteredCursos={filteredCursos}
                            loading={loading}
                            onRefreshData={fetchCursos}
                            onVerDetalle={(id) => setCursoSeleccionadoId(id)}
                            onEditar={handleEditClick}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

export default AdministrarCursos;