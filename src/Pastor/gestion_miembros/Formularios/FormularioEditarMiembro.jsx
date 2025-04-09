import React, { useState, useEffect } from "react";
import { notification } from "antd";
import API_URL from "../../../../Config";
import "../../../Styles/Formulario.css";

function FormularioEditarMiembro({ miembro, onClose, onUpdateSuccess }) {
    const [formData, setFormData] = useState({
        numero_cedula: "",
        nombres: "",
        apellidos: "",
        fecha_nacimiento: "",
        genero: "",
        celular: "",
        direccion: "",
        correo_electronico: "",
        nivel_estudio: "",
        nacionalidad: "",
        profesion: "",
        estado_civil: "",
        lugar_trabajo: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        if (miembro) {
            setFormData({
                numero_cedula: miembro.numero_cedula || "",
                nombres: miembro.nombres || "",
                apellidos: miembro.apellidos || "",
                fecha_nacimiento: miembro.fecha_nacimiento || "",
                genero: miembro.genero || "",
                celular: miembro.celular || "",
                direccion: miembro.direccion || "",
                correo_electronico: miembro.correo_electronico || "",
                nivel_estudio: miembro.nivel_estudio || "",
                nacionalidad: miembro.nacionalidad || "",
                profesion: miembro.profesion || "",
                estado_civil: miembro.estado_civil || "",
                lugar_trabajo: miembro.lugar_trabajo || ""
            });
        }
    }, [miembro]);

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
                throw new Error("No se encontró el token de autenticación");
            }

            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });

            const response = await fetch(`${API_URL}/Miembros/editarpersonas/${miembro.id_persona}/actualizar/`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formDataToSend
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al actualizar el miembro");
            }

            // Solo llama al callback de éxito, no cierres el formulario aquí
            if (onUpdateSuccess) {
                await onUpdateSuccess(); // Añade await
            }

        } catch (error) {
            api.error({
                message: 'Error',
                description: error.message,
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
                    <i className="bi bi-person-plus-fill me-2"></i>Editar Miembro
                </h5>
            </div>
            <div className="formulario-body">
                <form onSubmit={handleSubmit}>
                    <div className="row mb-3 g-3">
                        <div className="col-md-6">
                            <div className="formulario-campo">
                                <label htmlFor="nombres" className="formulario-label">
                                    Nombres <span className="text-danger">*</span>
                                </label>
                                <div className="formulario-input-group">
                                    <span className="formulario-input-group-text">
                                        <i className="bi bi-person-fill"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="formulario-input"
                                        id="nombres"
                                        name="nombres"
                                        value={formData.nombres}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="formulario-campo">
                                <label htmlFor="apellidos" className="formulario-label">
                                    Apellidos <span className="text-danger">*</span>
                                </label>
                                <div className="formulario-input-group">
                                    <span className="formulario-input-group-text">
                                        <i className="bi bi-person-fill"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="formulario-input"
                                        id="apellidos"
                                        name="apellidos"
                                        value={formData.apellidos}
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
                                <label htmlFor="numero_cedula" className="formulario-label">
                                    Número de Cédula
                                </label>
                                <div className="formulario-input-group">
                                    <span className="formulario-input-group-text">
                                        <i className="bi bi-card-text"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="formulario-input"
                                        id="numero_cedula"
                                        name="numero_cedula"
                                        value={formData.numero_cedula}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="formulario-campo">
                                <label htmlFor="correo_electronico" className="formulario-label">
                                    Correo Electrónico
                                </label>
                                <div className="formulario-input-group">
                                    <span className="formulario-input-group-text">
                                        <i className="bi bi-envelope-fill"></i>
                                    </span>
                                    <input
                                        type="email"
                                        className="formulario-input"
                                        id="correo_electronico"
                                        name="correo_electronico"
                                        value={formData.correo_electronico}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row mb-3 g-3">
                        <div className="col-md-6">
                            <div className="formulario-campo">
                                <label htmlFor="genero" className="formulario-label">
                                    Género
                                </label>
                                <div className="formulario-input-group">
                                    <span className="formulario-input-group-text">
                                        <i className="bi bi-gender-ambiguous"></i>
                                    </span>
                                    <select
                                        className="formulario-input formulario-select"
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
                        </div>
                        <div className="col-md-6">
                            <div className="formulario-campo">
                                <label htmlFor="fecha_nacimiento" className="formulario-label">
                                    Fecha de Nacimiento
                                </label>
                                <div className="formulario-input-group">
                                    <span className="formulario-input-group-text">
                                        <i className="bi bi-calendar-date"></i>
                                    </span>
                                    <input
                                        type="date"
                                        className="formulario-input"
                                        id="fecha_nacimiento"
                                        name="fecha_nacimiento"
                                        value={formData.fecha_nacimiento}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row mb-3 g-3">
                        <div className="col-md-6">
                            <div className="formulario-campo">
                                <label htmlFor="nacionalidad" className="formulario-label">
                                    Nacionalidad
                                </label>
                                <div className="formulario-input-group">
                                    <span className="formulario-input-group-text">
                                        <i className="bi bi-globe"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="formulario-input"
                                        id="nacionalidad"
                                        name="nacionalidad"
                                        value={formData.nacionalidad}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="formulario-campo">
                                <label htmlFor="estado_civil" className="formulario-label">
                                    Estado Civil
                                </label>
                                <div className="formulario-input-group">
                                    <span className="formulario-input-group-text">
                                        <i className="bi bi-people-fill"></i>
                                    </span>
                                    <select
                                        className="formulario-input formulario-select"
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
                    </div>

                    <div className="row mb-3 g-3">
                        <div className="col-md-6">
                            <div className="formulario-campo">
                                <label htmlFor="nivel_estudio" className="formulario-label">
                                    Nivel de Estudio
                                </label>
                                <div className="formulario-input-group">
                                    <span className="formulario-input-group-text">
                                        <i className="bi bi-book-fill"></i>
                                    </span>
                                    <select
                                        className="formulario-input formulario-select"
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
                        </div>
                        <div className="col-md-6">
                            <div className="formulario-campo">
                                <label htmlFor="profesion" className="formulario-label">
                                    Profesión
                                </label>
                                <div className="formulario-input-group">
                                    <span className="formulario-input-group-text">
                                        <i className="bi bi-briefcase-fill"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="formulario-input"
                                        id="profesion"
                                        name="profesion"
                                        value={formData.profesion}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row mb-3 g-3">
                        <div className="col-md-6">
                            <div className="formulario-campo">
                                <label htmlFor="lugar_trabajo" className="formulario-label">
                                    Lugar de Trabajo
                                </label>
                                <div className="formulario-input-group">
                                    <span className="formulario-input-group-text">
                                        <i className="bi bi-building"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="formulario-input"
                                        id="lugar_trabajo"
                                        name="lugar_trabajo"
                                        value={formData.lugar_trabajo}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="formulario-campo">
                                <label htmlFor="direccion" className="formulario-label">
                                    Dirección
                                </label>
                                <div className="formulario-input-group">
                                    <span className="formulario-input-group-text">
                                        <i className="bi bi-house-door-fill"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="formulario-input"
                                        id="direccion"
                                        name="direccion"
                                        value={formData.direccion}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row mb-3 g-3">
                        <div className="col-md-6">
                            <div className="formulario-campo">
                                <label htmlFor="celular" className="formulario-label">
                                    Celular
                                </label>
                                <div className="formulario-input-group">
                                    <span className="formulario-input-group-text">
                                        <i className="bi bi-phone-fill"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="formulario-input"
                                        id="celular"
                                        name="celular"
                                        value={formData.celular}
                                        onChange={handleChange}
                                    />
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
                                    <span className="spinner me-2"></span>
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

export default FormularioEditarMiembro;