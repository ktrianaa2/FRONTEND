import { useState } from "react";
import { notification } from "antd";
import API_URL from "../../../../../Config";
import "../../../../Styles/Formulario.css";

function FormularioCrearTarea({ onClose, onSuccess, idCurso, criterios }) {
    const [formData, setFormData] = useState({
        titulo: "",
        descripcion: "",
        fecha_entrega: "",
        id_criterio: "",
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
            // Validaciones básicas
            if (!formData.titulo || !formData.fecha_entrega || !formData.id_criterio) {
                throw new Error("Todos los campos obligatorios deben estar completos");
            }

            const token = localStorage.getItem("authToken");

            // Enviar como JSON
            const response = await fetch(`${API_URL}/Cursos/crear_tarea/`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || "Error al crear la tarea");
            }

            api.success({
                message: "Tarea creada exitosamente",
                description: `La tarea "${responseData.titulo}" ha sido creada.`,
            });

            if (onSuccess) onSuccess();

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
                                            <option key={criterio.id_rubrica} value={criterio.id_rubrica}>
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