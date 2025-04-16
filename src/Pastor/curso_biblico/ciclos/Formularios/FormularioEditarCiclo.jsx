import { useState, useEffect } from "react";
import { notification } from "antd";
import API_URL from "../../../../../Config";
import "../../../../Styles/Formulario.css";

function FormularioEditarCiclo({ ciclo, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
    });

    const [loading, setLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        if (ciclo) {
            setFormData({
                nombre: ciclo.nombre || "",
                descripcion: ciclo.descripcion || "",
            });
        }
    }, [ciclo]);

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
            const response = await fetch(`${API_URL}/Ciclos/editar_ciclo/${ciclo.id_ciclo}/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Error al actualizar el ciclo");
            }

            api.success({
                message: "Ciclo actualizado",
                description: "Los cambios fueron guardados correctamente.",
            });

            onSuccess();
        } catch (error) {
            api.error({
                message: "Error",
                description: error.message || "No se pudo actualizar el ciclo",
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
                    <i className="bi bi-pencil-square me-2"></i>Editar Ciclo
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

export default FormularioEditarCiclo;
