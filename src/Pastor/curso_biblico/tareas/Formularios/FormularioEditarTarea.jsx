import { useState, useEffect } from "react";
import { notification } from "antd";
import API_URL from "../../../../../Config";
import "../../../../Styles/Formulario.css";

function FormularioEditarTarea({ tarea, criterios, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        titulo: tarea.titulo || "",
        descripcion: tarea.descripcion || "",
        fecha_entrega: tarea.fecha_entrega || "",
        id_criterio: tarea.id_criterio?.id_rubrica || ""
    });

    const [loading, setLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();

    // Actualizar formData cuando cambie la tarea prop
    useEffect(() => {
        if (tarea) {
            setFormData({
                titulo: tarea.titulo || "",
                descripcion: tarea.descripcion || "",
                fecha_entrega: tarea.fecha_entrega?.split('T')[0] || "",
                id_criterio: tarea.id_criterio?.id_rubrica || tarea.id_criterio || ""
            });
        }
    }, [tarea]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validaciones básicas
            if (!formData.titulo || !formData.fecha_entrega || !formData.id_criterio) {
                throw new Error("Todos los campos obligatorios deben estar completos");
            }

            const token = localStorage.getItem("authToken");

            // Enviar como JSON
            const response = await fetch(`${API_URL}/Cursos/editar_tarea/${tarea.id_tarea}/`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || "Error al actualizar la tarea");
            }

            api.success({
                message: "Tarea actualizada exitosamente",
                description: `La tarea "${responseData.titulo}" ha sido actualizada.`,
            });

            if (onSuccess) onSuccess();

        } catch (error) {
            api.error({
                message: "Error",
                description: error.message || "No se pudo actualizar la tarea",
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
                    <i className="bi bi-journal-plus"></i> Editar Tarea
                </h5>
            </div>
            <div className="formulario-body">
                <form onSubmit={handleSubmit}>
                    <div className="row mb-3 g-3">
                        <div className="formulario-campo">
                            <label htmlFor="titulo" className="formulario-label">
                                Título de la Tarea <span className="text-danger">*</span>
                            </label>
                            <div className="formulario-input-group">
                                <span className="formulario-input-group-text">
                                    <i className="bi bi-card-text"></i>
                                </span>
                                <input
                                    type="text"
                                    id="titulo"
                                    name="titulo"
                                    className="formulario-input"
                                    value={formData.titulo}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row mb-3 g-3">
                        <div className="formulario-campo">
                            <label htmlFor="descripcion" className="formulario-label">
                                Descripción
                            </label>
                            <div className="formulario-input-group">
                                <span className="formulario-input-group-text">
                                    <i className="bi bi-file-text"></i>
                                </span>
                                <textarea
                                    id="descripcion"
                                    name="descripcion"
                                    className="formulario-input descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    rows="3"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row mb-3 g-3">
                        <div className="col-md-6">
                            <div className="formulario-campo">
                                <label htmlFor="fecha_entrega" className="formulario-label">
                                    Fecha de Entrega <span className="text-danger">*</span>
                                </label>
                                <div className="formulario-input-group">
                                    <span className="formulario-input-group-text">
                                        <i className="bi bi-calendar-event"></i>
                                    </span>
                                    <input
                                        type="date"
                                        id="fecha_entrega"
                                        name="fecha_entrega"
                                        className="formulario-input"
                                        value={formData.fecha_entrega}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="formulario-campo">
                                <label htmlFor="id_criterio" className="formulario-label">
                                    Criterio de Evaluación <span className="text-danger">*</span>
                                </label>
                                <div className="formulario-input-group">
                                    <span className="formulario-input-group-text">
                                        <i className="bi bi-list-check"></i>
                                    </span>
                                    <select
                                        id="id_criterio"
                                        name="id_criterio"
                                        className="formulario-input"
                                        value={formData.id_criterio}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Seleccione un criterio</option>
                                        {criterios.map((criterio) => (
                                            <option
                                                key={criterio.id_rubrica}
                                                value={criterio.id_rubrica}
                                                selected={criterio.id_rubrica === formData.id_criterio}
                                            >
                                                {criterio.nombre_criterio} ({criterio.porcentaje}%)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="formulario-acciones">
                        <button
                            type="button"
                            className="btn-cancelar"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn-guardar"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Guardando...
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