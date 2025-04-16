import { useState, useEffect } from "react";
import { notification } from "antd";
import API_URL from "../../../../Config";
import "../../../Styles/Formulario.css";

function FormularioEditarCurso({ curso, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        fecha_inicio: "",
        fecha_fin: "",
        hora_inicio: "",
        hora_fin: ""
    });

    const [loading, setLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        if (curso) {
            setFormData({
                nombre: curso.nombre || "",
                descripcion: curso.descripcion || "",
                fecha_inicio: curso.fecha_inicio || "",
                fecha_fin: curso.fecha_fin || "",
                hora_inicio: curso.hora_inicio || "",
                hora_fin: curso.hora_fin || ""
            });
        }
    }, [curso]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_URL}/Cursos/editar/${curso.id_curso}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Error al actualizar el curso");
            }

            api.success({
                message: "Curso actualizado",
                description: "Los cambios fueron guardados correctamente.",
            });

            onSuccess();
        } catch (error) {
            api.error({
                message: "Error",
                description: error.message || "No se pudo actualizar el curso",
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
                    <i className="bi bi-pencil-square me-2"></i>Editar Curso
                </h5>
            </div>
            <div className="formulario-body">
                <form onSubmit={handleSubmit}>
                    <div className="row mb-3 g-3">
                        <div className="formulario-campo">
                            <label htmlFor="nombre" className="formulario-label">
                                Nombre del Curso <span className="text-danger">*</span>
                            </label>
                            <div className="formulario-input-group">
                                <span className="formulario-input-group-text">
                                    <i className="bi bi-card-heading"></i>
                                </span>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    className="formulario-input"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row mb-3 g-3">
                        <div className="formulario-campo">
                            <label htmlFor="descripcion" className="formulario-label">
                                Descripción <span className="text-danger">*</span>
                            </label>
                            <div className="formulario-input-group">
                                <span className="formulario-input-group-text">
                                    <i className="bi bi-file-earmark-text"></i>
                                </span>
                                <textarea
                                    id="descripcion"
                                    name="descripcion"
                                    className="formulario-input descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    rows="3"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row mb-3 g-3">
                        <div className="col-md-6">
                            <div className="formulario-campo">
                                <label className="formulario-label">Fecha de Inicio <span className="text-danger">*</span></label>
                                <div className="formulario-input-group">
                                    <span className="formulario-input-group-text">
                                        <i className="bi bi-calendar-date"></i>
                                    </span>
                                    <input
                                        type="date"
                                        name="fecha_inicio"
                                        className="formulario-input"
                                        value={formData.fecha_inicio}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="formulario-campo">
                                <label className="formulario-label">Fecha Fin <span className="text-danger">*</span></label>
                                <div className="formulario-input-group">
                                    <span className="formulario-input-group-text">
                                        <i className="bi bi-calendar-date"></i>
                                    </span>
                                    <input
                                        type="date"
                                        name="fecha_fin"
                                        className="formulario-input"
                                        value={formData.fecha_fin}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row mb-3 g-3">
                        <div className="col-md-6">
                            <div className="formulario-campo">
                                <label className="formulario-label">Hora de Inicio <span className="text-danger">*</span></label>
                                <div className="formulario-input-group">
                                    <span className="formulario-input-group-text">
                                        <i className="bi bi-clock"></i>
                                    </span>
                                    <input
                                        type="time"
                                        name="hora_inicio"
                                        className="formulario-input"
                                        value={formData.hora_inicio}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="formulario-campo">
                                <label className="formulario-label">Hora Fin <span className="text-danger">*</span></label>
                                <div className="formulario-input-group">
                                    <span className="formulario-input-group-text">
                                        <i className="bi bi-clock"></i>
                                    </span>
                                    <input
                                        type="time"
                                        name="hora_fin"
                                        className="formulario-input"
                                        value={formData.hora_fin}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
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

export default FormularioEditarCurso;
