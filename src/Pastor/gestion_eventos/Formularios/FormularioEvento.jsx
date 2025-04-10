import { useState } from "react";
import { notification, Select } from "antd";
import API_URL from "../../../../Config";
import "../../../Styles/Formulario.css";

function FormularioCrearEvento({ onClose, onSuccess, ministerios }) {
    const [formData, setFormData] = useState({
        nombre: "",
        id_ministerio: "",
        descripcion: "",
        fecha: "",
        hora: "",
        lugar: ""
    });

    const [loading, setLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSelectChange = (value, name) => {
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

            if (!token) {
                throw new Error('No hay sesión activa');
            }

            const required_fields = ['nombre', 'id_ministerio', 'descripcion', 'fecha', 'hora'];
            for (const field of required_fields) {
                if (!formData[field]) {
                    throw new Error(`El campo ${field.replace('_', ' ')} es obligatorio`);
                }
            }

            const form = new FormData();
            for (const key in formData) {
                if (formData[key]) {
                    form.append(key, formData[key]);
                }
            }

            const response = await fetch(`${API_URL}/Eventos/crear/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: form
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al crear el evento');
            }

            const result = await response.json();

            // Resetear formulario
            setFormData({
                nombre: "",
                id_ministerio: "",
                descripcion: "",
                fecha: "",
                hora: "",
                lugar: ""
            });

            if (onSuccess) onSuccess(result);

            api.success({
                message: 'Éxito',
                description: result.mensaje,
                duration: 3,
            });

        } catch (err) {
            api.error({
                message: 'Error',
                description: err.message,
                duration: 5,
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
                    <i className="bi bi-calendar-plus-fill"></i> Crear Nuevo Evento
                </h5>
            </div>
            <div className="formulario-body">
                <form onSubmit={handleSubmit}>
                    <div className="row mb-3 g-3">
                        <div className="col-md-6">
                            <div className="formulario-campo">
                                <label htmlFor="nombre" className="formulario-label">
                                    Nombre del Evento <span className="text-danger">*</span>
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

                        <div className="col-md-6">
                            <div className="formulario-campo">
                                <label htmlFor="id_ministerio" className="formulario-label">
                                    Ministerio <span className="text-danger">*</span>
                                </label>
                                <div className="formulario-input-group">

                                    <span className="formulario-input-group-text">
                                        <i className="bi bi-people-fill"></i>
                                    </span>
                                    <Select
                                        className="formulario-select"
                                        id="id_ministerio"
                                        name="id_ministerio"
                                        value={formData.id_ministerio || null}
                                        onChange={(value) => handleSelectChange(value, 'id_ministerio')}
                                        options={ministerios.map(ministerio => ({
                                            value: ministerio.id_ministerio,
                                            label: ministerio.nombre
                                        }))}
                                        placeholder="Seleccione un ministerio"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

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

                    <div className="row mb-3 g-3">
                        <div className="col-md-6">
                            <div className="formulario-campo">
                                <label htmlFor="fecha" className="formulario-label">
                                    Fecha <span className="text-danger">*</span>
                                </label>
                                <div className="formulario-input-group">
                                    <span className="formulario-input-group-text">
                                        <i className="bi bi-calendar-date"></i>
                                    </span>
                                    <input
                                        type="date"
                                        id="fecha"
                                        name="fecha"
                                        className="formulario-input"
                                        value={formData.fecha}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="formulario-campo">
                                <label htmlFor="hora" className="formulario-label">
                                    Hora <span className="text-danger">*</span>
                                </label>
                                <div className="formulario-input-group">
                                    <span className="formulario-input-group-text">
                                        <i className="bi bi-clock"></i>
                                    </span>
                                    <input
                                        type="time"
                                        id="hora"
                                        name="hora"
                                        className="formulario-input"
                                        value={formData.hora}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="formulario-campo">
                        <label htmlFor="lugar" className="formulario-label">
                            Lugar
                        </label>
                        <div className="formulario-input-group">
                            <span className="formulario-input-group-text">
                                <i className="bi bi-geo-alt-fill"></i>
                            </span>
                            <input
                                type="text"
                                id="lugar"
                                name="lugar"
                                className="formulario-input"
                                value={formData.lugar}
                                onChange={handleChange}
                            />
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
                                <>
                                    Crear Evento
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FormularioCrearEvento;