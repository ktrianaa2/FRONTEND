import { useState } from "react";
import { notification } from "antd";
import API_URL from "../../../../../Config";
import "../../../../Styles/Formulario.css";

function FormularioCrearTarea({ onClose, onSuccess, idCurso }) {
    const [formData, setFormData] = useState({
        titulo: "",
        descripcion: "",
        fecha_entrega: "",
        tipo: "Tarea",
        id_curso: idCurso,
    });

    const [loading, setLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();

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
            const token = localStorage.getItem("authToken");
            const form = new FormData();

            for (const key in formData) {
                form.append(key, formData[key]);
            }

            const response = await fetch(`${API_URL}/Cursos/crear_tarea/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: form,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al crear la tarea");
            }

            api.success({
                message: "Tarea creada",
                description: "La tarea fue creada exitosamente",
            });

            onSuccess();
        } catch (error) {
            api.error({
                message: "Error",
                description: error.message || "No se pudo crear la tarea",
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
                    <i className="bi bi-journal-plus"></i> Crear Nueva Tarea
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
                                <label htmlFor="tipo" className="formulario-label">
                                    Tipo de Tarea <span className="text-danger">*</span>
                                </label>
                                <div className="formulario-input-group">
                                    <span className="formulario-input-group-text">
                                        <i className="bi bi-tags"></i>
                                    </span>
                                    <select
                                        id="tipo"
                                        name="tipo"
                                        className="formulario-input"
                                        value={formData.tipo}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="Tarea">Tarea</option>
                                        <option value="Examen">Examen</option>
                                        <option value="Actuación">Actuación</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="formulario-acciones">
                        <button
                            type="button"
                            className="btn-cancelar"
                            onClick={(e) => {
                                e.preventDefault();
                                if (typeof onClose === "function") onClose();
                            }}
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
                                    Creando...
                                </>
                            ) : (
                                <>Crear Tarea</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FormularioCrearTarea;
