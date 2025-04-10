import React, { useEffect, useState } from "react";
import API_URL from "../../../Config";
import { notification } from "antd";
import '../../Styles/Detalles.css';

function DetalleMiembro({ idMiembro, onClose }) {
    const [miembro, setMiembro] = useState(null);
    const [loading, setLoading] = useState(true);
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        const fetchMiembro = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error("No hay sesión activa");
                }
    
                const response = await fetch(`${API_URL}/Miembros/personas/${idMiembro}/`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Error al obtener los datos");
                }
    
                const data = await response.json();
                if (!data || !data.persona) {
                    throw new Error("No se encontraron datos del miembro");
                }
                setMiembro(data.persona);
                
            } catch (error) {
                api.error({
                    message: "Error en la API",
                    description: error.response?.data?.error || error.message || "Hubo un problema al obtener los datos del miembro.",
                    duration: 4
                });
            } finally {
                setLoading(false);
            }
        };
    
        if (idMiembro) {
            fetchMiembro();
        }
    }, [idMiembro]);
    
    if (loading) return <div className="text-center my-4">Cargando datos del miembro...</div>;

    if (!miembro) return <div className="text-danger">No se encontró al miembro.</div>;

    return (
        <div className="detalle-container shadow p-4">
            {contextHolder}
            <h4 className="titulo">Detalle del {miembro.rol}</h4>
            <hr />
            <div className="detalle-item">
                <span className="detalle-label"><strong>Nombre:</strong></span>
                <span className="detalle-info">{miembro.nombres} {miembro.apellidos}</span>
            </div>
            <div className="detalle-item">
                <span className="detalle-label"><strong>Ministerios:</strong></span>
                <span className="detalle-info">________</span>
            </div>
            <div className="detalle-item">
                <span className="detalle-label"><strong>Ultima Pastoral:</strong></span>
                <span className="detalle-info">________</span>
            </div>
            <div className="detalle-item">
                <span className="detalle-label"><strong>Cédula:</strong></span>
                <span className="detalle-info">{miembro.numero_cedula}</span>
            </div>
            <div className="detalle-item">
                <span className="detalle-label"><strong>Celular:</strong></span>
                <span className="detalle-info">{miembro.celular}</span>
            </div>
            <div className="detalle-item">
                <span className="detalle-label"><strong>Fecha de Nacimiento:</strong></span>
                <span className="detalle-info">{miembro.fecha_nacimiento}</span>
            </div>
            <div className="detalle-item">
                <span className="detalle-label"><strong>Dirección:</strong></span>
                <span className="detalle-info">{miembro.direccion}</span>
            </div>
            <div className="detalle-item">
                <span className="detalle-label"><strong>Email:</strong></span>
                <span className="detalle-info">{miembro.correo_electronico}</span>
            </div>
            <div className="detalle-item">
                <span className="detalle-label"><strong>Género:</strong></span>
                <span className="detalle-info">{miembro.genero}</span>
            </div>
            <div className="detalle-item">
                <span className="detalle-label"><strong>Nivel de Estudio:</strong></span>
                <span className="detalle-info">{miembro.nivel_estudio}</span>
            </div>
            <div className="detalle-item">
                <span className="detalle-label"><strong>Nacionalidad:</strong></span>
                <span className="detalle-info">{miembro.nacionalidad}</span>
            </div>
            <div className="detalle-item">
                <span className="detalle-label"><strong>Profesión:</strong></span>
                <span className="detalle-info">{miembro.profesion}</span>
            </div>
            <div className="detalle-item">
                <span className="detalle-label"><strong>Estado Civil:</strong></span>
                <span className="detalle-info">{miembro.estado_civil}</span>
            </div>
            <div className="detalle-item">
                <span className="detalle-label"><strong>Lugar de Trabajo:</strong></span>
                <span className="detalle-info">{miembro.lugar_trabajo}</span>
            </div>
    
            <button className="btn-volver" onClick={onClose}>
                Volver
            </button>
        </div>
    );
}

export default DetalleMiembro;
