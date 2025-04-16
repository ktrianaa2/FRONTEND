import { useState } from "react";
import { notification } from "antd";
import API_URL from "../../../../../Config";
import "../../../../Styles/Formulario.css";

function FormularioCrearCiclo({ onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: ""
    });

    const [loading, setLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            const form = new FormData();
            form.append("nombre", formData.nombre);
            form.append("descripcion", formData.descripcion);

            const response = await fetch(`${API_URL}/Ciclos/crear_ciclo/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: form,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "No se pudo crear el ciclo");
            }

            api.success({
                message: "Ciclo creado",
                description: `Ciclo "${data.nombre}" creado exitosamente`,
            });

            onSuccess(); // recarga o cierre
        } catch (error) {
            api.error({
                message: "Error",
                description: error.message || "Error al crear el ciclo",
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
                    <i className="bi bi-calendar-plus-fill"></i> Crear Nuevo Ciclo
                </h5>
            </div>
            <div className="formulario-body">
                <form onSubmit={handleSubmit}>
                    <div className="row mb-3 g-3">
                        <div className="formulario-campo">
                            <label htmlFor="nombre" className="formulario-label">
                                Nombre del Ciclo <span className="text-danger">*</span>
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
                                <>Crear Ciclo</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FormularioCrearCiclo;
