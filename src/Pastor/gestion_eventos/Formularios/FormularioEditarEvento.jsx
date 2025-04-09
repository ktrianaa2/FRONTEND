import React, { useState, useEffect } from "react";
import { Select, notification } from "antd";
import API_URL from "../../../../Config";
import "../../../Styles/Formulario.css";

function FormularioEditarEvento({ evento, ministerios, onClose, onUpdateSuccess }) {
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

    useEffect(() => {
        if (evento) {
            setFormData({
                nombre: evento.nombre || "",
                id_ministerio: evento.id_ministerio || "",
                descripcion: evento.descripcion || "",
                fecha: evento.fecha || "",
                hora: evento.hora || "",
                lugar: evento.lugar || ""
            });
        }
    }, [evento]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
            const token = localStorage.getItem("authToken");
            if (!token) throw new Error("No se encontró el token de autenticación");

            const formDataToSend = new FormData();
            for (let key in formData) {
                formDataToSend.append(key, formData[key]);
            }
            formDataToSend.append("id_evento", evento.id_evento);

            const response = await fetch(`${API_URL}/Eventos/editar/${evento.id_evento}/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formDataToSend
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al actualizar el evento");
            }

            const data = await response.json();

            api.success({
                message: "Evento actualizado",
                description: data.mensaje || "Los cambios fueron guardados correctamente.",
                duration: 5
            });

            if (onUpdateSuccess) await onUpdateSuccess();
        } catch (error) {
            api.error({
                message: "Error",
                description: error.message,
                duration: 5
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
                    <i className="bi bi-calendar2-event me-2"></i>Editar Evento
                </h5>
            </div>
            <div className="formulario-body">
                <form onSubmit={handleSubmit}>
                    <div className="formulario-campo">
                        <label className="formulario-label">Nombre del Evento</label>
                        <div className="formulario-input-group">
                            <span className="formulario-input-group-text">
                                <i className="bi bi-card-heading"></i>
                            </span>
                            <input
                                type="text"
                                className="formulario-input"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="formulario-campo">
                        <label className="formulario-label">Ministerio</label>
                        <div className="formulario-input-group">
                            <span className="formulario-input-group-text">
                                <i className="bi bi-people-fill"></i>
                            </span>
                            <Select
                                className="formulario-select"
                                id="id_ministerio"
                                name="id_ministerio"
                                value={formData.id_ministerio || ""}
                                onChange={(value) => handleSelectChange(value, 'id_ministerio')}
                                options={ministerios.map(min => ({
                                    value: min.id_ministerio,
                                    label: min.nombre
                                }))}
                                placeholder="Seleccione un ministerio"
                                required
                            />
                        </div>
                    </div>

                    <div className="formulario-campo">
                        <label className="formulario-label">Descripción</label>
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
                    <div className="row g-3">
                        <div className="col-md-6">
                            <div className="formulario-campo">
                                <label className="formulario-label">Fecha</label>
                                <div className="formulario-input-group">
                                    <span className="formulario-input-group-text">
                                        <i className="bi bi-calendar-date"></i>
                                    </span>
                                    <input
                                        type="date"
                                        className="formulario-input"
                                        name="fecha"
                                        value={formData.fecha}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="formulario-campo">
                                <label className="formulario-label">Hora</label>
                                <div className="formulario-input-group">
                                    <span className="formulario-input-group-text">
                                        <i className="bi bi-clock"></i>
                                    </span>
                                    <input
                                        type="time"
                                        className="formulario-input"
                                        name="hora"
                                        value={formData.hora}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="formulario-campo">
                        <label className="formulario-label">Lugar</label>
                        <div className="formulario-input-group">
                            <span className="formulario-input-group-text">
                                <i className="bi bi-geo-alt-fill"></i>
                            </span>
                            <input
                                type="text"
                                className="formulario-input"
                                name="lugar"
                                value={formData.lugar}
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
                                    <span className="spinner me-2"></span>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    Guardar Cambios
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FormularioEditarEvento;