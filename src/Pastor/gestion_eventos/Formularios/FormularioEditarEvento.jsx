import React, { useState, useEffect } from "react";
import { Select, notification } from "antd";
import API_URL from "../../../../Config";

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
        <div className="card shadow-lg border-0">
            {contextHolder}
            <div className="card-header bg-dark text-white py-3">
                <h5 className="mb-0 fw-bold">
                    <i className="bi bi-calendar2-event me-2"></i>Editar Evento
                </h5>
            </div>
            <div className="card-body bg-light">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Nombre del Evento</label>
                        <input
                            type="text"
                            className="form-control"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold">Ministerio</label>
                        <Select
                            className="w-100"
                            id="id_ministerio"
                            name="id_ministerio"
                            value={formData.id_ministerio ||  ''}
                            onChange={(value) => handleSelectChange(value, 'id_ministerio')}
                            options={ministerios.map(min => ({
                                value: min.id_ministerio,
                                label: min.nombre
                            }))}
                            placeholder="Seleccione un ministerio"
                            required
                        />
                    </div>


                    <div className="mb-3">
                        <label className="form-label fw-bold">Descripción</label>
                        <textarea
                            className="form-control"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            rows="3"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold">Fecha</label>
                        <input
                            type="date"
                            className="form-control"
                            name="fecha"
                            value={formData.fecha}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold">Hora</label>
                        <input
                            type="time"
                            className="form-control"
                            name="hora"
                            value={formData.hora}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold">Lugar</label>
                        <input
                            type="text"
                            className="form-control"
                            name="lugar"
                            value={formData.lugar}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Guardando...
                                </>
                            ) : (
                                "Guardar Cambios"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FormularioEditarEvento;
