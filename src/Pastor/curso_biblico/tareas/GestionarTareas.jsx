import React, { useEffect, useState } from "react";
import { Input, Button, notification } from "antd";
import TablaTareas from "./TablaTareas";
import FormularioCrearTarea from "./Formularios/FormularioTarea";
import FormularioEditarTarea from "./Formularios/FormularioEditarTarea";
import DetalleTarea from "./DetalleTarea";
import CalificarTarea from "./CalificarTarea";
import API_URL from "../../../../Config";

function GestionarTareas({ curso, onClose }) {
    const [tareas, setTareas] = useState([]);
    const [filteredTareas, setFilteredTareas] = useState([]);
    const [criterios, setCriterios] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const [tareaEditar, setTareaEditar] = useState(null);
    const [modo, setModo] = useState("lista"); // 'lista', 'crear', 'editar', 'detalles', 'calificar'

    useEffect(() => {
        fetchTareas();
        fetchCriterios();
    }, [curso]);

    const fetchTareas = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("authToken");
            const response = await fetch(`${API_URL}/Cursos/listar_tareas_curso/${curso.id_curso}/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Error al cargar tareas");

            setTareas(data.tareas);
            setFilteredTareas(data.tareas);
        } catch (error) {
            api.error({
                message: "Error",
                description: error.message || "No se pudieron cargar las tareas"
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchCriterios = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`${API_URL}/Cursos/listar_criterios_curso/${curso.id_curso}/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Error al cargar criterios");

            setCriterios(data || []);
        } catch (error) {
            api.error({
                message: "Error",
                description: error.message || "No se pudieron cargar los criterios"
            });
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);
        if (value === "") {
            setFilteredTareas(tareas);
        } else {
            const filtered = tareas.filter(t =>
                t.titulo.toLowerCase().includes(value) ||
                (t.descripcion && t.descripcion.toLowerCase().includes(value))
            );
            setFilteredTareas(filtered);
        }
    };

    const handleAgregarTarea = () => {
        setModo("crear");
        setMostrarFormularioAgregar(true);
        setTareaEditar(null);
    };

    const handleVerDetalles = (tarea) => {
        setTareaEditar(tarea);
        setModo("detalles");
    };

    const handleEditarTarea = (tarea) => {
        setTareaEditar(tarea);
        setModo("editar");
    };

    const handleCalificarTarea = (tarea) => {
        setTareaEditar(tarea);
        setModo("calificar");
    };

    const volverALista = () => {
        setModo("lista");
        setMostrarFormularioAgregar(false);
        setTareaEditar(null);
    };

    return (
        <div>
            {contextHolder}

            {/* Encabezado común */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Tareas del Curso: {curso.nombre}</h4>
                <Button onClick={modo === "lista" ? onClose : volverALista} className="btn-cancelar">
                    {modo === "lista" ? "Volver" : "Volver a la lista"}
                </Button>
            </div>

            {modo === "lista" && (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <Input
                            placeholder="Buscar tareas..."
                            value={search}
                            onChange={handleSearch}
                            style={{ maxWidth: 300 }}
                        />
                        <Button type="primary" onClick={handleAgregarTarea}>
                            <i className="bi bi-plus-circle me-1"></i> Añadir Tarea
                        </Button>
                    </div>

                    {loading ? (
                        <div className="text-center">Cargando tareas...</div>
                    ) : (
                        <TablaTareas
                            tareas={tareas}
                            filteredTareas={filteredTareas}
                            onRefreshData={fetchTareas}
                            onVerDetalles={handleVerDetalles}
                            onEditarTarea={handleEditarTarea}
                            onCalificarTarea={handleCalificarTarea}
                        />
                    )}
                </>
            )}

            {modo === "crear" && (
                <FormularioCrearTarea
                    idCurso={curso.id_curso}
                    criterios={criterios}
                    onClose={volverALista}
                    onSuccess={() => {
                        fetchTareas();
                        volverALista();
                    }}
                />
            )}

            {modo === "detalles" && tareaEditar && (
                <DetalleTarea
                    tarea={tareaEditar}
                    onClose={volverALista}
                    onEdit={() => setModo("editar")}
                />
            )}

            {modo === "editar" && tareaEditar && (
                <FormularioEditarTarea
                    tarea={tareaEditar}
                    criterios={criterios}
                    onClose={volverALista}
                    onSuccess={() => {
                        fetchTareas();
                        volverALista();
                    }}
                />
            )}

            {modo === "calificar" && tareaEditar && (
                <CalificarTarea
                    tarea={tareaEditar}
                    idCurso={curso.id_curso}
                    onClose={volverALista}
                    onSuccess={() => {
                        fetchTareas();
                        volverALista();
                    }}
                />
            )}
        </div>
    );
}

export default GestionarTareas;