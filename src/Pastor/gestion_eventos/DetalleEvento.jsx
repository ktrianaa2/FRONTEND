import { useEffect, useState } from 'react';
import API_URL from "../../../Config";
import '../../Styles/Detalles.css';

function DetalleEvento({ idEvento, onClose }) {
    const [evento, setEvento] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvento = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`${API_URL}/Eventos/detalle_eventos/${idEvento}/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setEvento(data.evento);
                setError(null);
            } catch (err) {
                console.error("Error fetching evento:", err);
                setError(err.message || 'Error al cargar el evento');
            } finally {
                setLoading(false);
            }
        };

        if (idEvento) {
            fetchEvento();
        }
    }, [idEvento]);

    if (loading) {
        return (
            <div className="detalle-container">
                <div className="loading-spinner"></div>
                <p>Cargando detalles del evento...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="detalle-container">
                <h2 className="titulo">Error</h2>
                <p className="text-danger">{error}</p>
                <button className="btn-volver" onClick={onClose}>
                    Volver
                </button>
            </div>
        );
    }

    if (!evento) {
        return (
            <div className="detalle-container">
                <h2 className="titulo">Evento no encontrado</h2>
                <button className="btn-volver" onClick={onClose}>
                    Volver
                </button>
            </div>
        );
    }

    return (
        <div className="detalle-container">
            <h2 className="titulo">Detalles del Evento</h2>
            
            <div className="detalle-item">
                <label className="detalle-label">Tipo de Evento:</label>
                <span className="detalle-info">
                    {evento.tipo_evento?.nombre || 'No especificado'}
                </span>
            </div>
            
            <div className="detalle-item">
                <label className="detalle-label">Ministerio:</label>
                <span className="detalle-info">{evento.ministerio}</span>
            </div>
            
            <div className="detalle-item">
                <label className="detalle-label">Evento:</label>
                <span className="detalle-info">{evento.nombre}</span>
            </div>
            
            <div className="detalle-item">
                <label className="detalle-label">Fecha:</label>
                <span className="detalle-info">
                    {new Date(evento.fecha).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </span>
            </div>
            
            <div className="detalle-item">
                <label className="detalle-label">Hora:</label>
                <span className="detalle-info">
                    {evento.hora?.substring(0, 5) || '--:--'}
                </span>
            </div>
            
            <div className="detalle-item">
                <label className="detalle-label">Lugar:</label>
                <span className="detalle-info">{evento.lugar || 'No especificado'}</span>
            </div>
            
            <div className="detalle-item">
                <label className="detalle-label">Estado:</label>
                <span className="detalle-info">{evento.estado}</span>
            </div>
            
            <div className="detalle-item">
                <label className="detalle-label">Descripción:</label>
                <p className="detalle-info">{evento.descripcion || 'Sin descripción'}</p>
            </div>
            
            <div className="detalle-item">
                <label className="detalle-label">Creado por:</label>
                <span className="detalle-info">{evento.usuario}</span>
            </div>
            
            {evento.tipo_evento?.descripcion && (
                <div className="detalle-item">
                    <label className="detalle-label">Descripción del Tipo:</label>
                    <p className="detalle-info">{evento.tipo_evento.descripcion}</p>
                </div>
            )}
            
            <button className="btn-volver" onClick={onClose}>
                Volver
            </button>
        </div>
    );
}

export default DetalleEvento;