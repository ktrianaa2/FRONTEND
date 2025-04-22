import React, { useState, useEffect } from "react";
import { notification, Select } from "antd";
import DetalleCurso from "./cursos/DetalleCurso";
import TablaCursos from "./cursos/TablaCursos";
import FormularioCrearCurso from "./cursos/Formularios/FormularioCurso";
import FormularioEditarCurso from "./cursos/Formularios/FormularioEditarCurso";
import FormularioCrearCiclo from "./ciclos/Formularios/FormularioCiclo";
import FormularioEditarCiclo from "./ciclos/Formularios/FormularioEditarCiclo";
import DetalleCiclo from "./ciclos/DetalleCiclo";
import GestionarCurso from "./cursos/GestionarCurso";
import API_URL from "../../../Config";
import "../../Styles/Formulario.css"

const { Option } = Select;

function AdministrarCursos() {
    const [api, contextHolder] = notification.useNotification();
    const [search, setSearch] = useState("");
    const [ciclos, setCiclos] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [cursoSeleccionadoId, setCursoSeleccionadoId] = useState(null);
    const [selectedCurso, setSelectedCurso] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingCursos, setLoadingCursos] = useState(false);
    const [selectedCicloId, setSelectedCicloId] = useState(null);
    const [selectedCiclo, setSelectedCiclo] = useState(null);

    const [currentView, setCurrentView] = useState("main"); // "main", "createCiclo", "detalleCiclo", "createCurso", "detalleCurso", "editCurso", "editCiclo"

    const handleCloseGestionarCurso = () => {
        setCurrentView("gestionCurso");
    };
    
    const handleCloseMain = () => {
        setCurrentView("main");
        setSelectedCurso(null);
        setCursoSeleccionadoId(null);
    };
    

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

            if (data.ciclos.length > 0) {
                setSelectedCicloId(data.ciclos[0].id_ciclo);
                setSelectedCiclo(data.ciclos[0]);
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
            setCursos([]);
            const token = localStorage.getItem("authToken");
            if (!token) throw new Error("No hay sesión activa");
            if (!cicloId) {
                throw new Error("No se ha seleccionado un ciclo válido");
            }

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
            setCursos([]);
        } finally {
            setLoadingCursos(false);
        }
    };

    const handleCreateCicloSuccess = () => {
        fetchCiclos();
        handleCloseMain();
        api.success({
            message: "Éxito",
            description: "Ciclo creado correctamente",
            duration: 3,
        });
    };

    const handleUpdateCicloSuccess = () => {
        fetchCiclos();
        handleCloseMain();
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
        fetchCursos(value);
    };

    useEffect(() => {
        fetchCiclos();
    }, []);

    const handleSuccessCurso = () => {
        fetchCursos(selectedCicloId);
        handleCloseMain();
        api.success({
            message: "Éxito",
            description: "Curso creado correctamente",
            duration: 3,
        });
    };

    const handleUpdateSuccess = async () => {
        try {
            api.success({
                message: "Éxito",
                description: "Los datos del curso se actualizaron correctamente",
                duration: 3,
            });

            await fetchCursos(selectedCicloId);
            handleCloseMain();
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

    const renderMainView = () => (
        <div>
            <div className="d-flex justify-content-between mb-4">
                <h4>Seleccione un ciclo</h4>
                <button
                    className="btn-guardar"
                    onClick={() => setCurrentView("createCiclo")}
                >
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
                            <div className="row mb-3 g-3">
                                <div className="col-md-6">
                                    <h3>{selectedCiclo.nombre}</h3>
                                    <p>{selectedCiclo.descripcion || 'Sin descripción'}</p>
                                </div>
                                <div className="col-md-6">
                                    <div className="formulario-acciones">
                                        <button
                                            className="btn-cancelar"
                                            onClick={() => setCurrentView("detalleCiclo")}
                                        >
                                            Ver Detalles
                                        </button>
                                        <button
                                            className="btn-editar"
                                            onClick={() => setCurrentView("editCiclo")}
                                        >
                                            <i className="bi bi-pencil-square me-1"></i>
                                            Editar Ciclo
                                        </button>
                                        <button
                                            className="btn-guardar"
                                            onClick={() => setCurrentView("createCurso")}
                                        >
                                            <i className="bi bi-plus-circle me-1"></i>
                                            Crear Curso
                                        </button>
                                    </div>
                                </div>
                            </div>
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
                            onGestionar={(curso) => {
                                setSelectedCurso(curso);
                                setCursoSeleccionadoId(curso.id_curso);
                                setCurrentView("gestionCurso");
                            }}
                        />
                    )}
                </>
            )}
        </div>
    );

    return (
        <div>
            {contextHolder}
            <h2 className="text-black">Administración de Cursos Bíblicos</h2>
            <hr />

            {currentView === "main" && renderMainView()}

            {currentView === "createCiclo" && (
                <FormularioCrearCiclo
                    visible={true}
                    onClose={handleCloseMain}
                    onSuccess={handleCreateCicloSuccess}
                />
            )}

            {currentView === "detalleCiclo" && selectedCiclo && (
                <DetalleCiclo
                    ciclo={selectedCiclo}
                    onClose={handleCloseMain}
                    onEdit={() => setCurrentView("editCiclo")}
                />
            )}

            {currentView === "createCurso" && (
                <FormularioCrearCurso
                    visible={true}
                    onClose={handleCloseMain}
                    onSuccess={handleSuccessCurso}
                    idCiclo={selectedCicloId}
                />
            )}
            {currentView === "editCurso" && selectedCurso && (
                <FormularioEditarCurso
                    visible={true}
                    onClose={handleCloseGestionarCurso}
                    curso={selectedCurso}
                    onSuccess={handleUpdateSuccess}
                />
            )}

            {currentView === "detalleCurso" && cursoSeleccionadoId && (
                <DetalleCurso
                    cursoId={cursoSeleccionadoId}
                    onClose={handleCloseGestionarCurso}
                />
            )}

            {currentView === "editCiclo" && selectedCiclo && (
                <FormularioEditarCiclo
                    ciclo={selectedCiclo}
                    visible={true}
                    onClose={handleCloseMain}
                    onSuccess={handleUpdateCicloSuccess}
                />
            )}

            {currentView === "gestionCurso" && selectedCurso && (
                <GestionarCurso
                    curso={selectedCurso}
                    onClose={handleCloseMain}
                    onVerDetalle={() => setCurrentView("detalleCurso")}
                    onEditar={() => setCurrentView("editCurso")}
                />
            )}

        </div>
    );
}

export default AdministrarCursos;