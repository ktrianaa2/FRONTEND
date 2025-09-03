import React from "react";
import { useEffect, useState } from "react";
import { notification } from "antd";
import "../../../Styles/Tabla.css";
import API_URL from "../../../../Config";

function TablaTareas({
    tareas,
    filteredTareas,
    onRefreshData,
    onVerDetalles,
    onEditarTarea,
    onCalificarTarea,
    idCurso,
}) {
    const [api, contextHolder] = notification.useNotification();
    const [porcentajes, setPorcentajes] = useState({});
    const [tareasAgrupadas, setTareasAgrupadas] = useState([]);
    const [criterios, setCriterios] = useState([]);

    // Obtener los criterios del curso
    useEffect(() => {
        const fetchCriterios = async () => {
            const token = localStorage.getItem("authToken");
            try {
                const response = await fetch(`${API_URL}/Cursos/listar_criterios_curso/${idCurso}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) throw new Error("Error al obtener criterios");
                const data = await response.json();
                setCriterios(data);
            } catch (error) {
                console.error("Error fetching criterios:", error);
            }
        };

        if (idCurso) {
            fetchCriterios();
        }
    }, [idCurso]);

    useEffect(() => {
        const prepararDatos = (tareas, criterios) => {
            // Crear un mapa para agrupar tareas por criterio
            const agrupadas = {};

            // 1. Inicializar con todos los criterios (incluso sin tareas)
            criterios.forEach(criterio => {
                agrupadas[criterio.nombre_criterio] = {
                    tareas: [],
                    porcentaje: criterio.porcentaje
                };
            });

            // 2. Agrupar las tareas existentes
            tareas.forEach(tarea => {
                const criterioNombre = tarea.criterio || "No especificado";

                // Si la tarea tiene un criterio que no existe en la rubrica, crearlo
                if (!agrupadas[criterioNombre]) {
                    agrupadas[criterioNombre] = {
                        tareas: [],
                        porcentaje: 0
                    };
                }
                agrupadas[criterioNombre].tareas.push(tarea);
            });

            // 3. Convertir a array para renderizar, manteniendo orden de criterios
            const resultado = [];

            // Primero agregar criterios definidos en la rubrica
            criterios.forEach(criterio => {
                const criterioNombre = criterio.nombre_criterio;
                const { tareas: tareasDelCriterio, porcentaje } = agrupadas[criterioNombre];

                // Agregar el criterio
                resultado.push({
                    tipo: "criterio",
                    valor: criterioNombre,
                    porcentaje: porcentaje
                });

                // Agregar sus tareas o mensaje de sin tareas
                if (tareasDelCriterio.length > 0) {
                    tareasDelCriterio.forEach(tarea => {
                        resultado.push({
                            tipo: "tarea",
                            valor: tarea
                        });
                    });
                } else {
                    resultado.push({
                        tipo: "sin-tareas",
                        criterio: criterioNombre
                    });
                }
            });

            // Luego agregar criterios no definidos (como "No especificado")
            Object.entries(agrupadas).forEach(([criterioNombre, { tareas: tareasDelCriterio, porcentaje }]) => {
                // Solo agregar si no es un criterio ya procesado y tiene tareas
                if (!criterios.some(c => c.nombre_criterio === criterioNombre) && tareasDelCriterio.length > 0) {
                    resultado.push({
                        tipo: "criterio",
                        valor: criterioNombre,
                        porcentaje: porcentaje
                    });

                    tareasDelCriterio.forEach(tarea => {
                        resultado.push({
                            tipo: "tarea",
                            valor: tarea
                        });
                    });
                }
            });

            return resultado;
        };

        // Preparar datos cuando tengamos criterios O tareas filtradas
        setTareasAgrupadas(prepararDatos(filteredTareas, criterios));
    }, [filteredTareas, criterios]);

    useEffect(() => {
        const fetchPorcentajes = async () => {
            const token = localStorage.getItem("authToken");
            const nuevosPorcentajes = {};

            for (const tarea of filteredTareas) {
                try {
                    const response = await fetch(`${API_URL}/Cursos/listar_calificaciones_tarea/${tarea.id_tarea}/`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (!response.ok) throw new Error("Error al obtener datos");

                    const data = await response.json();
                    const total = data.participantes.length;
                    const calificados = data.participantes.filter(p => p.nota !== null && p.nota !== undefined).length;
                    const porcentaje = total > 0 ? Math.round((calificados / total) * 100) : 0;

                    nuevosPorcentajes[tarea.id_tarea] = porcentaje;
                } catch (error) {
                    nuevosPorcentajes[tarea.id_tarea] = 0;
                }
            }

            setPorcentajes(nuevosPorcentajes);
        };

        if (filteredTareas.length > 0) {
            fetchPorcentajes();
        }
    }, [filteredTareas]);

    return (
        <div>
            {contextHolder}
            <div className="table-responsive">
                <table className="tabla-principal">
                    <thead>
                        <tr>
                            <th>Titulo</th>
                            <th>Descripcion</th>
                            <th>Fecha de Entrega</th>
                            <th>% Calificado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tareasAgrupadas.length > 0 ? (
                            tareasAgrupadas.map((item, index) => {
                                if (item.tipo === "criterio") {
                                    return (
                                        <tr key={`criterio-${index}`} className="fila-criterio">
                                            <td colSpan="5">
                                                <div className="criterio-header">
                                                    <span className="criterio-nombre">
                                                        {item.valor}
                                                    </span>
                                                    {item.porcentaje > 0 && (
                                                        <span className="porcentaje-criterio">
                                                            {item.porcentaje}%
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                } else if (item.tipo === "sin-tareas") {
                                    return (
                                        <tr key={`sin-tareas-${index}`} className="fila-sin-tareas">
                                            <td colSpan="5">
                                                <div className="mensaje-sin-tareas">
                                                    No hay tareas asignadas a este criterio
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                } else {
                                    const tarea = item.valor;
                                    return (
                                        <tr key={tarea.id_tarea} className="fila-tarea">
                                            <td>{tarea.titulo}</td>
                                            <td>{tarea.descripcion}</td>
                                            <td>{tarea.fecha_entrega}</td>
                                            <td>
                                                <div className="barra-progreso">
                                                    <div
                                                        className="barra-progreso-interna"
                                                        style={{ width: `${porcentajes[tarea.id_tarea] || 0}%` }}
                                                    >
                                                        {porcentajes[tarea.id_tarea] != null ? `${porcentajes[tarea.id_tarea]}%` : "-"}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="btn-acciones">
                                                    <button
                                                        className="btn-ver"
                                                        onClick={() => onVerDetalles(tarea)}
                                                    >
                                                        <i className="bi bi-person-lines-fill me-1"></i> Ver Detalles
                                                    </button>
                                                    <button
                                                        className="btn-editar"
                                                        onClick={() => onEditarTarea(tarea)}
                                                    >
                                                        <i className="bi bi-pencil-square me-1"></i> Editar
                                                    </button>
                                                    <button
                                                        className="btn-guardar"
                                                        onClick={() => onCalificarTarea(tarea)}
                                                    >
                                                        <i className="bi bi-pencil-square me-1"></i> Calificar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }
                            })
                        ) : (
                            // Mostrar criterios aunque no haya tareas
                            criterios.length > 0 ? (
                                criterios.map((criterio, index) => (
                                    <React.Fragment key={`criterio-vacio-${index}`}>
                                        <tr className="fila-criterio">
                                            <td colSpan="5">
                                                <div className="criterio-header">
                                                    <span className="criterio-nombre">
                                                        {criterio.nombre_criterio}
                                                    </span>
                                                    <span className="porcentaje-criterio">
                                                        {criterio.porcentaje}%
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className="fila-sin-tareas">
                                            <td colSpan="5">
                                                <div className="mensaje-sin-tareas">
                                                    No hay tareas asignadas a este criterio
                                                </div>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">
                                        {filteredTareas.length === 0 && tareas.length > 0
                                            ? "No hay tareas que coincidan con los filtros aplicados."
                                            : "No hay tareas registradas todavía."}
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TablaTareas;