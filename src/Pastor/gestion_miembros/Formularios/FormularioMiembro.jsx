import { useState } from "react";
import { notification } from "antd";
import API_URL from "../../../../Config";

function FormularioMiembro({ onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        nombres: "",
        apellidos: "",
        numero_cedula: "",
        correo_electronico: "",
        genero: "",
        fecha_nacimiento: "",
        nivel_estudio: "",
        nacionalidad: "",
        profesion: "",
        estado_civil: "",
        lugar_trabajo: "",
        celular: "",
        direccion: ""
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('authToken');

            if (!token) {
                throw new Error('No hay sesión activa');
            }

            // Validar campos obligatorios
            const required_fields = ['nombres', 'apellidos'];
            for (const field of required_fields) {
                if (!formData[field]) {
                    throw new Error(`El campo ${field} es obligatorio`);
                }
            }

            const dataToSend = { ...formData };
            const formDataToSend = new FormData();

            Object.keys(dataToSend).forEach(key => {
                if (dataToSend[key] !== "") {
                    formDataToSend.append(key, dataToSend[key]);
                }
            });

            const response = await fetch(`${API_URL}/Registrar/register/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formDataToSend
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al guardar el miembro');
            }

            // Resetear formulario
            setFormData({
                nombres: "",
                apellidos: "",
                numero_cedula: "",
                correo_electronico: "",
                genero: "",
                fecha_nacimiento: "",
                nivel_estudio: "",
                nacionalidad: "",
                profesion: "",
                estado_civil: "",
                lugar_trabajo: "",
                celular: "",
                direccion: ""
            });

            // Notificar éxito al componente padre
            if (onSuccess) onSuccess();

        } catch (err) {
            // Mostrar error localmente en el formulario
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
                <h5 className="mb-0 fw-bold"><i className="bi bi-person-plus-fill me-2"></i>Registrar Nuevo Miembro</h5>
            </div>
            <div className="card-body bg-light">
                <form onSubmit={handleSubmit} className="p-2">
                    <div className="row mb-3 g-3">
                        <div className="col-md-6">
                            <label htmlFor="nombres" className="form-label fw-bold text-dark">
                                Nombres <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-dark text-white"><i className="bi bi-person-fill"></i></span>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="nombres"
                                    name="nombres"
                                    value={formData.nombres}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="apellidos" className="form-label fw-bold text-dark">
                                Apellidos <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-dark text-white"><i className="bi bi-person-fill"></i></span>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="apellidos"
                                    name="apellidos"
                                    value={formData.apellidos}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row mb-3 g-3">
                        <div className="col-md-6">
                            <label htmlFor="numero_cedula" className="form-label fw-bold text-dark">
                                Número de Cédula
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-dark text-white"><i className="bi bi-card-text"></i></span>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="numero_cedula"
                                    name="numero_cedula"
                                    value={formData.numero_cedula}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="correo_electronico" className="form-label fw-bold text-dark">
                                Correo Electrónico
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-dark text-white"><i className="bi bi-envelope-fill"></i></span>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="correo_electronico"
                                    name="correo_electronico"
                                    value={formData.correo_electronico}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row mb-3 g-3">
                        <div className="col-md-6">
                            <label htmlFor="genero" className="form-label fw-bold text-dark">
                                Género
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-dark text-white"><i className="bi bi-gender-ambiguous"></i></span>
                                <select
                                    className="form-select"
                                    id="genero"
                                    name="genero"
                                    value={formData.genero}
                                    onChange={handleChange}
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Femenino">Femenino</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="fecha_nacimiento" className="form-label fw-bold text-dark">
                                Fecha de Nacimiento
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-dark text-white"><i className="bi bi-calendar-date"></i></span>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="fecha_nacimiento"
                                    name="fecha_nacimiento"
                                    value={formData.fecha_nacimiento}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row mb-3 g-3">
                        <div className="col-md-6">
                            <label htmlFor="nacionalidad" className="form-label fw-bold text-dark">
                                Nacionalidad
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-dark text-white"><i className="bi bi-globe"></i></span>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="nacionalidad"
                                    name="nacionalidad"
                                    value={formData.nacionalidad}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="estado_civil" className="form-label fw-bold text-dark">
                                Estado Civil
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-dark text-white"><i className="bi bi-people-fill"></i></span>
                                <select
                                    className="form-select"
                                    id="estado_civil"
                                    name="estado_civil"
                                    value={formData.estado_civil}
                                    onChange={handleChange}
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="Soltero/a">Soltero/a</option>
                                    <option value="Casado/a">Casado/a</option>
                                    <option value="Divorciado/a">Divorciado/a</option>
                                    <option value="Viudo/a">Viudo/a</option>
                                    <option value="Unión libre">Unión libre</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="row mb-3 g-3">
                        <div className="col-md-6">
                            <label htmlFor="nivel_estudio" className="form-label fw-bold text-dark">
                                Nivel de Estudio
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-dark text-white"><i className="bi bi-book-fill"></i></span>
                                <select
                                    className="form-select"
                                    id="nivel_estudio"
                                    name="nivel_estudio"
                                    value={formData.nivel_estudio}
                                    onChange={handleChange}
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="Primaria">Primaria</option>
                                    <option value="Secundaria">Secundaria</option>
                                    <option value="Técnico">Técnico</option>
                                    <option value="Universidad">Universidad</option>
                                    <option value="Postgrado">Postgrado</option>
                                    <option value="Ninguno">Ninguno</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="profesion" className="form-label fw-bold text-dark">
                                Profesión
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-dark text-white"><i className="bi bi-briefcase-fill"></i></span>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="profesion"
                                    name="profesion"
                                    value={formData.profesion}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row mb-3 g-3">
                        <div className="col-md-6">
                            <label htmlFor="lugar_trabajo" className="form-label fw-bold text-dark">
                                Lugar de Trabajo
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-dark text-white"><i className="bi bi-building"></i></span>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="lugar_trabajo"
                                    name="lugar_trabajo"
                                    value={formData.lugar_trabajo}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="direccion" className="form-label fw-bold text-dark">
                                Dirección
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-dark text-white"><i className="bi bi-house-door-fill"></i></span>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="direccion"
                                    name="direccion"
                                    value={formData.direccion}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row mb-3 g-3">
                        <div className="col-md-6">
                            <label htmlFor="celular" className="form-label fw-bold text-dark">
                                Celular
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-dark text-white"><i className="bi bi-phone-fill"></i></span>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="celular"
                                    name="celular"
                                    value={formData.celular}
                                    onChange={handleChange}
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
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-save-fill me-2"></i>
                                    Guardar
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FormularioMiembro;