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
                const token = localStorage.getItem('token'); // o desde contexto si lo usas
                const response = await fetch(`${API_URL}/Eventos/eventos/${idEvento}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    setEvento(data.evento);
                } else {
                    setError(data.error || 'Error al cargar evento');
                }
            } catch (err) {
                setError('Error de red o del servidor');
            } finally {
                setLoading(false);
            }
        };

        fetchEvento();
    }, [idEvento]);

    if (loading) return <p>Cargando detalles del evento...</p>;
    if (error) return <p className="text-danger">Error: {error}</p>;
    if (!evento) return null;

    return (
        <div className="detalle-evento-container p-4 bg-white rounded-lg shadow-lg">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="titulo">Detalles del Evento</h2>
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
                <span className="detalle-info">{evento.fecha}</span>
            </div>
            <div className="detalle-item">
                <label className="detalle-label">Hora:</label>
                <span className="detalle-info">{evento.hora}</span>
            </div>
            <div className="detalle-item">
                <label className="detalle-label">Lugar:</label>
                <span className="detalle-info">{evento.lugar}</span>
            </div>
            <div className="detalle-item">
                <label className="detalle-label">Estado:</label>
                <span className="detalle-info">{evento.estado}</span>
            </div>
            <div className="detalle-item">
                <label className="detalle-label">Descripción:</label>
                <p className="detalle-info">{evento.descripcion}</p>
            </div>
            <div className="detalle-item">
                <label className="detalle-label">Creado por:</label>
                <span className="detalle-info">{evento.usuario}</span>
            </div>
            <button className="btn btn-secondary mt-3" onClick={onClose}>
                Volver
            </button>
        </div>
    );
}

export default DetalleEvento;
