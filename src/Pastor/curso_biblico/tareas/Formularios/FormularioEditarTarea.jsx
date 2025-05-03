import { useState, useEffect } from "react";
import { notification } from "antd";
import API_URL from "../../../../../Config";
import "../../../../Styles/Formulario.css";

function FormularioEditarTarea({ tarea, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        id_criterio: "",
        titulo: "",
        descripcion: "",
        fecha_entrega: ""
    });

    const [criterios, setCriterios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        // Cargar criterios
        const fetchCriterios = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const res = await fetch(`${API_URL}/Cursos/listar_criterios/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                setCriterios(data.criterios || []);
            } catch (err) {
                api.error({
                    message: "Error al cargar criterios",
                    description: err.message || "No se pudieron cargar los criterios"
                });
            }
        };

        fetchCriterios();

        // Cargar datos de la tarea actual
        if (tarea) {
            setFormData({
                id_criterio: tarea.id_criterio?.id_criterio || "",
                titulo: tarea.titulo || "",
                descripcion: tarea.descripcion || "",
                fecha_entrega: tarea.fecha_entrega || ""
            });
        }
    }, [tarea]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("authToken");

            const response = await fetch(`${API_URL}/Cursos/editar_tarea/${tarea.id_tarea}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Error al actualizar la tarea");
            }

            api.success({
                message: "Tarea actualizada",
                description: "Los datos fueron guardados correctamente"
            });

            onSuccess && onSuccess();

        } catch (error) {
            api.error({
                message: "Error",
                description: error.message
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
                    <i className="bi bi-pencil-square"></i> Editar Tarea
                </h5>
            </div>
            <div className="formulario-body">
                <form onSubmit={handleSubmit}>
                    <div className="row mb-3 g-3">
                        <div className="formulario-campo">
                            <label className="formulario-label">Criterio <span className="text-danger">*</span></label>
                            <select
                                name="id_criterio"
                                className="formulario-input"
                                value={formData.id_criterio}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecciona un criterio</option>
                                {criterios.map(c => (
                                    <option key={c.id_criterio} value={c.id_criterio}>
                                        {c.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="row mb-3 g-3">
                        <div className="formulario-campo">
                            <label className="formulario-label">Título <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                name="titulo"
                                className="formulario-input"
                                value={formData.titulo}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="row mb-3 g-3">
                        <div className="formulario-campo">
                            <label className="formulario-label">Descripción</label>
                            <textarea
                                name="descripcion"
                                className="formulario-input"
                                rows="3"
                                value={formData.descripcion}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="row mb-3 g-3">
                        <div className="formulario-campo">
                            <label className="formulario-label">Fecha de entrega <span className="text-danger">*</span></label>
                            <input
                                type="date"
                                name="fecha_entrega"
                                className="formulario-input"
                                value={formData.fecha_entrega}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="formulario-acciones">
                        <button type="button" className="btn-cancelar" onClick={onClose} disabled={loading}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-guardar" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner"></span> Guardando...
                                </>
                            ) : (
                                <>Guardar Cambios</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FormularioEditarTarea;
