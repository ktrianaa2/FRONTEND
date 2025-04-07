import '../../Styles/Detalles.css';

function DetalleEvento({ idEvento, onClose }) {
    // Aquí podrías cargar los detalles del evento usando el idEvento
    return (
        <div className="detalle-evento-container p-4 bg-white rounded-lg shadow-lg">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="titulo">Detalles del Evento</h2>
            </div>
            <div className="detalle-item">
                <label className="detalle-label">Ministerio:</label>
                <span className="detalle-info">Juventudes</span>
            </div>
            <div className="detalle-item">
                <label className="detalle-label">Evento:</label>
                <span className="detalle-info">Evangelismo en la Plaza</span>
            </div>
            <div className="detalle-item">
                <label className="detalle-label">Fecha:</label>
                <span className="detalle-info">7 abril 2025</span>
            </div>
            <div className="detalle-item">
                <label className="detalle-label">Hora:</label>
                <span className="detalle-info">16:00</span>
            </div>
            <div className="detalle-item">
                <label className="detalle-label">Descripción:</label>
                <p className="detalle-info">Actividad evangelística con dinámicas y oración.</p>
            </div>
            <button className="btn btn-secondary mt-3" onClick={onClose}>
                Volver
            </button>
        </div>
    );
}

export default DetalleEvento;
