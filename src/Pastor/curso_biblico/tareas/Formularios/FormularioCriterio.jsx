import { useEffect, useState } from "react";
import { notification } from "antd";
import API_URL from "../../../../../Config";
import "../../../../Styles/Formulario.css";

function FormularioCriterio({ Curso, criterios: initialCriterios, onClose, onSuccess }) {
    const [criterios, setCriterios] = useState(initialCriterios || []);
    const [loading, setLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        if (!initialCriterios || initialCriterios.length === 0) {
            fetchCriterios();
        }
    }, [Curso]);

    const fetchCriterios = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(
                `${API_URL}/Cursos/listar_criterios_curso/${Curso.id_curso}/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Error al cargar criterios");

            if (data.length === 0) {
                setCriterios([{ id_rubrica: null, nombre_criterio: "", porcentaje: "" }]);
            } else {
                setCriterios(data);
            }
        } catch (error) {
            api.error({
                message: "Error al cargar criterios",
                description: error.message,
            });
        }
    };

    const handleChange = (index, field, value) => {
        const nuevos = [...criterios];
        nuevos[index][field] = value;
        setCriterios(nuevos);
    };

    const handleAgregar = () => {
        if (criterios.length > 0) {
            const ultimo = criterios[criterios.length - 1];
            if (!ultimo.nombre_criterio || !ultimo.porcentaje || isNaN(ultimo.porcentaje)) {
                api.warning({
                    message: "Campo incompleto",
                    description: "Complete el criterio actual antes de agregar uno nuevo.",
                });
                return;
            }
        }

        setCriterios([...criterios, { id_rubrica: null, nombre_criterio: "", porcentaje: "" }]);
    };

    const handleEliminar = (index) => {
        if (criterios.length <= 1) {
            api.warning({
                message: "No se puede eliminar",
                description: "Debe haber al menos un criterio.",
            });
            return;
        }

        const nuevos = [...criterios];
        nuevos.splice(index, 1);
        setCriterios(nuevos);
    };

    const totalPorcentaje = criterios.reduce((sum, c) => sum + Number(c.porcentaje || 0), 0);
    const porcentajeClase = totalPorcentaje === 100 ? "text-success" : "text-danger";

    const handleGuardar = async () => {
        for (const criterio of criterios) {
            if (!criterio.nombre_criterio || !criterio.porcentaje) {
                api.error({
                    message: "Datos incompletos",
                    description: "Todos los criterios deben tener nombre y porcentaje.",
                });
                return;
            }

            if (isNaN(criterio.porcentaje) || criterio.porcentaje < 0 || criterio.porcentaje > 100) {
                api.error({
                    message: "Porcentaje inválido",
                    description: "Los porcentajes deben ser números entre 0 y 100.",
                });
                return;
            }
        }
        try {
            setLoading(true);
            const token = localStorage.getItem("authToken");

            const response = await fetch(`${API_URL}/Cursos/editar_criterios_curso/${Curso.id_curso}/`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ criterios }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error al actualizar criterios");
            }

            api.success({
                message: "Criterios actualizados",
                description: `${data.criterios_actualizados} criterio(s) guardado(s).`,
            });
            if (onSuccess) onSuccess();

        } catch (error) {
            api.error({
                message: "Error al guardar",
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="formulario-card">
            {contextHolder}
            <div className="formulario-header">
                <h5 className="formulario-titulo">
                    <i className="bi bi-list-task"></i> Editar Criterios de Evaluación
                </h5>
            </div>
            <div className="formulario-body">
                <table className="table table-bordered">
                    <thead className="table-light">
                        <tr>
                            <th>Nombre del Criterio</th>
                            <th>Porcentaje (%)</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {criterios.map((c, i) => (
                            <tr key={i}>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={c.nombre_criterio}
                                        onChange={(e) =>
                                            handleChange(i, "nombre_criterio", e.target.value)
                                        }
                                        required
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={c.porcentaje}
                                        onChange={(e) =>
                                            handleChange(i, "porcentaje", e.target.value)
                                        }
                                        min={0}
                                        max={100}
                                        required
                                    />
                                </td>
                                <td className="text-center">
                                    {i === criterios.length - 1 && (
                                        <button
                                            className="btn btn-outline-success btn-sm me-2"
                                            onClick={handleAgregar}
                                            title="Agregar criterio"
                                        >
                                            <i className="bi bi-plus-circle"></i>
                                        </button>
                                    )}
                                    <button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => handleEliminar(i)}
                                        title="Eliminar criterio"
                                    >
                                        <i className="bi bi-x-circle"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className="text-end fw-bold">Total</td>
                            <td className={`fw-bold ${porcentajeClase}`}>{totalPorcentaje}%</td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div className="formulario-acciones">
                <button
                    className="btn-guardar"
                    onClick={handleGuardar}
                    disabled={loading || totalPorcentaje !== 100}
                >
                    {loading ? "Guardando..." : "Guardar Cambios"}
                </button>
            </div>
        </div>
    );
}

export default FormularioCriterio;
