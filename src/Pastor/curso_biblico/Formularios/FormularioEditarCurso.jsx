import { useState, useEffect } from "react";
import { notification } from "antd";
import API_URL from "../../../../Config";
import "../../../Styles/Formulario.css";

function FormularioEditarCurso({ curso, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        fecha_inicio: "",
        fecha_fin: "",
        hora_inicio: "",
        hora_fin: "",
        id_ciclo: ""
    });

    const [ciclos, setCiclos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();

    // Cargar ciclos y datos del curso al montar el componente
    useEffect(() => {
        const fetchCiclos = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const res = await fetch(`${API_URL}/Ciclos/listar_ciclos/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                setCiclos(data.ciclos || []);
            } catch (error) {
                api.error({
                    message: "Error al cargar ciclos",
                    description: error.message || "No se pudieron obtener los ciclos",
                });
            }
        };

        fetchCiclos();

        // Si hay un curso, cargar sus datos
        if (curso) {
            setFormData({
                nombre: curso.nombre || "",
                descripcion: curso.descripcion || "",
                fecha_inicio: curso.fecha_inicio || "",
                fecha_fin: curso.fecha_fin || "",
                hora_inicio: curso.hora_inicio || "",
                hora_fin: curso.hora_fin || "",
                id_ciclo: curso.id_ciclo?.id_ciclo || ""
            });
        }
    }, [curso]);

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

            const response = await fetch(`${API_URL}/Cursos/editar_curso/${curso.id_curso}/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: form,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al actualizar el curso");
            }

            api.success({
                message: "Curso actualizado",
                description: "El curso fue actualizado exitosamente",
            });

            onSuccess();
        } catch (error) {
            api.error({
                message: "Error",
                description: error.message || "No se pudo actualizar el curso",
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
                    <i className="bi bi-pencil-square"></i> Editar Curso
                </h5>
            </div>
            <div className="formulario-body">
                <form onSubmit={handleSubmit}>
                    <div className="row mb-3 g-3">
                        <div className="formulario-campo">
                            <label htmlFor="nombre" className="formulario-label">
                                Nombre del Curso <span className="text-danger">*</span>
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

                    <div className="row mb-3 g-3">
                        <div className="col-md-6">
                            <div className="formulario-campo">
                                <label htmlFor="fecha_inicio" className="formulario-label">
                                    Fecha de Inicio <span className="text-danger">*</span>
                                </label>
                                <div className="formulario-input-group">
                                    <span className="formulario-input-group-text">
                                        <i className="bi bi-calendar-date"></i>
                                    </span>
                                    <input
                                        type="date"
                                        id="fecha_inicio"
                                        name="fecha_inicio"
                                        className="formulario-input"
                                        value={formData.fecha_inicio}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="formulario-campo">
                                <label htmlFor="fecha_fin" className="formulario-label">
                                    Fecha Fin <span className="text-danger">*</span>
                                </label>
                                <div className="formulario-input-group">
                                    <span className="formulario-input-group-text">
                                        <i className="bi bi-calendar-date"></i>
                                    </span>
                                    <input
                                        type="date"
                                        id="fecha_fin"
                                        name="fecha_fin"
                                        className="formulario-input"
                                        value={formData.fecha_fin}
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
                                <label htmlFor="hora_inicio" className="formulario-label">
                                    Hora de Inicio <span className="text-danger">*</span>
                                </label>
                                <div className="formulario-input-group">
                                    <span className="formulario-input-group-text">
                                        <i className="bi bi-clock"></i>
                                    </span>
                                    <input
                                        type="time"
                                        id="hora_inicio"
                                        name="hora_inicio"
                                        className="formulario-input"
                                        value={formData.hora_inicio}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="formulario-campo">
                                <label htmlFor="hora_fin" className="formulario-label">
                                    Hora Fin <span className="text-danger">*</span>
                                </label>
                                <div className="formulario-input-group">
                                    <span className="formulario-input-group-text">
                                        <i className="bi bi-clock"></i>
                                    </span>
                                    <input
                                        type="time"
                                        id="hora_fin"
                                        name="hora_fin"
                                        className="formulario-input"
                                        value={formData.hora_fin}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row mb-3 g-3">
                        <div className="formulario-campo">
                            <label htmlFor="id_ciclo" className="formulario-label">
                                Ciclo <span className="text-danger">*</span>
                            </label>
                            <div className="formulario-input-group">
                                <span className="formulario-input-group-text">
                                    <i className="bi bi-diagram-3"></i>
                                </span>
                                <select
                                    id="id_ciclo"
                                    name="id_ciclo"
                                    className="formulario-input"
                                    value={formData.id_ciclo}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecciona un ciclo</option>
                                    {ciclos.map((ciclo) => (
                                        <option key={ciclo.id_ciclo} value={ciclo.id_ciclo}>
                                            {ciclo.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="formulario-acciones">
                        <button
                            type="button"
                            className="btn-cancelar"
                            onClick={() => {
                                onClose && onClose();
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
                                    Guardando...
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

export default FormularioEditarCurso;