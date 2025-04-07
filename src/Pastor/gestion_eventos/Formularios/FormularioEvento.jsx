import { useState } from "react";
import { notification, Select, DatePicker, TimePicker } from "antd";
import API_URL from "../../../../Config";
import dayjs from 'dayjs';

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

    const handleDateChange = (date, dateString) => {
        setFormData({
            ...formData,
            fecha: dateString
        });
    };

    const handleTimeChange = (time, timeString) => {
        setFormData({
            ...formData,
            hora: timeString
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
        <div className="card shadow-lg border-0">
            {contextHolder}
            <div className="card-header bg-dark text-white py-3">
                <h5 className="mb-0 fw-bold"><i className="bi bi-calendar-plus-fill me-2"></i>Crear Nuevo Evento</h5>
            </div>
            <div className="card-body bg-light">
                <form onSubmit={handleSubmit} className="p-2">
                    <div className="row mb-3 g-3">
                        <div className="col-md-12">
                            <label htmlFor="nombre" className="form-label fw-bold text-dark">
                                Nombre del Evento <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-dark text-white"><i className="bi bi-card-heading"></i></span>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="nombre"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row mb-3 g-3">
                        <div className="col-md-6">
                            <label htmlFor="id_ministerio" className="form-label fw-bold text-dark">
                                Ministerio <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-dark text-white"><i className="bi bi-people-fill"></i></span>
                                <Select
                                    className="w-100"
                                    id="id_ministerio"
                                    name="id_ministerio"
                                    value={formData.id_ministerio || null}
                                    onChange={(value) => handleSelectChange(value, 'id_ministerio')}
                                    options={ministerios.map(ministerio => ({
                                        value: ministerio.id_ministerio,
                                        label: ministerio.nombre
                                    }))}
                                    placeholder="Seleccione un ministerio"
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="lugar" className="form-label fw-bold text-dark">
                                Lugar
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-dark text-white"><i className="bi bi-geo-alt-fill"></i></span>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="lugar"
                                    name="lugar"
                                    value={formData.lugar}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row mb-3 g-3">
                        <div className="col-md-6">
                            <label htmlFor="fecha" className="form-label fw-bold text-dark">
                                Fecha <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-dark text-white"><i className="bi bi-calendar-date"></i></span>
                                <DatePicker
                                    className="form-control"
                                    id="fecha"
                                    name="fecha"
                                    value={formData.fecha ? dayjs(formData.fecha) : null}
                                    onChange={handleDateChange}
                                    format="YYYY-MM-DD"
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="hora" className="form-label fw-bold text-dark">
                                Hora <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-dark text-white"><i className="bi bi-clock-fill"></i></span>
                                <TimePicker
                                    className="form-control"
                                    id="hora"
                                    name="hora"
                                    value={formData.hora ? dayjs(formData.hora, 'HH:mm') : null}
                                    onChange={handleTimeChange}
                                    format="HH:mm"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row mb-3 g-3">
                        <div className="col-md-12">
                            <label htmlFor="descripcion" className="form-label fw-bold text-dark">
                                Descripción <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-dark text-white"><i className="bi bi-text-paragraph"></i></span>
                                <textarea
                                    className="form-control"
                                    id="descripcion"
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    rows="3"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="btn btn-success px-4 py-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Creando...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-calendar-plus-fill me-2"></i>
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