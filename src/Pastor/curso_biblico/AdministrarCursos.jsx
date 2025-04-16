import React, { useState, useEffect } from "react";
import { notification, Select } from "antd";
import DetalleCurso from "./DetalleCurso";
import TablaCursos from "./Tabla/TablaCursos";
import FormularioCrearCurso from "./Formularios/FormularioCurso";
import FormularioEditarCurso from "./Formularios/FormularioEditarCurso";
import FormularioCrearCiclo from "./ciclos/Formularios/FormularioCiclo";
import FormularioEditarCiclo from "./ciclos/Formularios/FormularioEditarCiclo";
import DetalleCiclo from "./ciclos/DetalleCiclo";
import API_URL from "../../../Config";

const { Option } = Select;

function AdministrarCursos() {
    const [api, contextHolder] = notification.useNotification();
    const [search, setSearch] = useState("");
    const [ciclos, setCiclos] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [cursoSeleccionadoId, setCursoSeleccionadoId] = useState(null);
    const [mostrarFormularioCurso, setMostrarFormularioCurso] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showEditCicloForm, setShowEditCicloForm] = useState(false);
    const [selectedCurso, setSelectedCurso] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingCursos, setLoadingCursos] = useState(false);
    const [selectedCicloId, setSelectedCicloId] = useState(null);
    const [selectedCiclo, setSelectedCiclo] = useState(null);
    const [mostrarFormularioCiclo, setMostrarFormularioCiclo] = useState(false);
    const [mostrarDetalleCiclo, setMostrarDetalleCiclo] = useState(false);

    useEffect(() => {
        console.log("Ciclo seleccionado actualizado:", selectedCiclo);
    }, [selectedCiclo]);

    const fetchCiclos = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("authToken");
            if (!token) throw new Error("No hay sesión activa");

            const response = await fetch(`${API_URL}/Ciclos/listar_ciclos/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al obtener los ciclos");
            }

            const data = await response.json();
            setCiclos(data.ciclos);

            // Si hay ciclos, seleccionar el primero automáticamente
            if (data.ciclos.length > 0) {
                setSelectedCicloId(data.ciclos[0].id_ciclo);
                setSelectedCiclo(data.ciclos[0]);
                setMostrarDetalleCiclo(true);
                fetchCursos(data.ciclos[0].id_ciclo);
            }

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

    const fetchCursos = async (cicloId) => {
        try {
            setLoadingCursos(true);
            const token = localStorage.getItem("authToken");
            if (!token) throw new Error("No hay sesión activa");

            const response = await fetch(`${API_URL}/Cursos/listar_cursos/${cicloId}/`, {
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
            setLoadingCursos(false);
        }
    };

    const handleCreateCicloSuccess = () => {
        fetchCiclos();
        setMostrarFormularioCiclo(false);
        api.success({
            message: "Éxito",
            description: "Ciclo creado correctamente",
            duration: 3,
        });
    };

    const handleUpdateCicloSuccess = () => {
        fetchCiclos();
        setShowEditCicloForm(false);
        api.success({
            message: "Éxito",
            description: "Ciclo actualizado correctamente",
            duration: 3,
        });
    };

    const handleCicloSelect = (value) => {
        const cicloSeleccionado = ciclos.find(c => c.id_ciclo === value);
        if (!cicloSeleccionado) {
            api.error({
                message: "Error",
                description: "No se encontró el ciclo seleccionado",
                duration: 3,
            });
            return;
        }

        setSelectedCicloId(value);
        setSelectedCiclo(cicloSeleccionado);
        setMostrarDetalleCiclo(true);
        fetchCursos(value);
    };

    useEffect(() => {
        fetchCiclos();
    }, []);

    const toggleFormularioCurso = () => {
        setMostrarFormularioCurso(!mostrarFormularioCurso);
    };

    const toggleFormularioCiclo = () => {
        setMostrarFormularioCiclo(!mostrarFormularioCiclo);
    };

    const handleSuccessCurso = () => {
        fetchCursos(selectedCicloId);
        toggleFormularioCurso();
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

            await fetchCursos(selectedCicloId);
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

            <div>
                <div className="d-flex justify-content-between mb-4">
                    <h4>Seleccione un ciclo</h4>
                    <button className="btn btn-primary text-white shadow-sm" onClick={toggleFormularioCiclo}>
                        <i className="bi bi-plus-circle me-1"></i>
                        Crear Ciclo
                    </button>
                </div>

                {loading ? (
                    <div className="text-center my-4">Cargando ciclos...</div>
                ) : ciclos.length === 0 ? (
                    <div className="alert alert-info">
                        No hay ciclos disponibles. Crea un nuevo ciclo para comenzar.
                    </div>
                ) : (
                    <>
                        <Select
                            showSearch
                            style={{ width: '100%', marginBottom: '20px' }}
                            placeholder="Buscar ciclo..."
                            optionFilterProp="children"
                            onChange={handleCicloSelect}
                            value={selectedCicloId}
                            filterOption={(input, option) =>
                                (option?.children?.toString() || "").toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {ciclos.map(ciclo => (
                                <Option key={ciclo.id_ciclo} value={ciclo.id_ciclo}>
                                    {ciclo.nombre}
                                </Option>
                            ))}
                        </Select>

                        {selectedCiclo && (
                            <div>
                                <h3>{selectedCiclo.nombre}</h3>
                                <p>{selectedCiclo.descripcion || 'Sin descripción'}</p>
                                <button className="btn btn-outline-primary mb-3" onClick={() => setMostrarDetalleCiclo(true)}>
                                    Ver Detalles del Ciclo
                                </button>
                                <button className="btn btn-success ms-2 mb-3" onClick={toggleFormularioCurso}>
                                    <i className="bi bi-plus-circle me-1"></i>
                                    Crear Curso
                                </button>
                            </div>
                        )}

                        {loadingCursos ? (
                            <div>Cargando cursos...</div>
                        ) : (
                            <TablaCursos
                                cursos={cursos}
                                filteredCursos={filteredCursos}
                                loading={loadingCursos}
                                onRefreshData={() => fetchCursos(selectedCicloId)}
                                onVerDetalle={(id) => setCursoSeleccionadoId(id)}
                                onEditar={handleEditClick}
                            />
                        )}
                    </>
                )}
            </div>

            {/* Formulario para crear curso */}
            {mostrarFormularioCurso && (
                <FormularioCrearCurso
                    visible={mostrarFormularioCurso}
                    onCancel={toggleFormularioCurso}
                    onSuccess={handleSuccessCurso}
                    idCiclo={selectedCicloId}
                />
            )}

            {/* Formulario para editar curso */}
            {showEditForm && selectedCurso && (
                <FormularioEditarCurso
                    visible={showEditForm}
                    onCancel={handleCloseForm}
                    curso={selectedCurso}
                    onSuccess={handleUpdateSuccess}
                />
            )}

            {/* Detalle del curso seleccionado */}
            {cursoSeleccionadoId && (
                <DetalleCurso
                    cursoId={cursoSeleccionadoId}
                    onClose={() => setCursoSeleccionadoId(null)}
                />
            )}

            {/* Formulario para crear ciclo */}
            {mostrarFormularioCiclo && (
                <FormularioCrearCiclo
                    visible={mostrarFormularioCiclo}
                    onCancel={() => setMostrarFormularioCiclo(false)}
                    onSuccess={handleCreateCicloSuccess}
                />
            )}

            {/* Formulario para editar ciclo */}
            {showEditCicloForm && selectedCiclo && (
                <FormularioEditarCiclo
                    ciclo={selectedCiclo}
                    visible={showEditCicloForm}
                    onCancel={() => setShowEditCicloForm(false)}
                    onSuccess={handleUpdateCicloSuccess}
                />
            )}

            {/* Detalle del ciclo */}
            {mostrarDetalleCiclo && selectedCiclo && (
                <DetalleCiclo
                    ciclo={selectedCiclo}
                    onClose={() => setMostrarDetalleCiclo(false)}
                    onEdit={() => {
                        setShowEditCicloForm(true);
                        setMostrarDetalleCiclo(false);
                    }}
                />
            )}
        </div>
    );
}

export default AdministrarCursos;