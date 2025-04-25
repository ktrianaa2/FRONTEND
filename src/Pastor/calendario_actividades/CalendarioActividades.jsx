import React, { useState, useEffect } from "react";
import API_URL from "../../../Config";
import ControlesCalendario from "./ControlesCalendario";
import VistaCalendario from "./VistaCalendario";
import DetalleEvento from "../gestion_eventos/DetalleEvento";

const CalendarioEventosIglesia = () => {
    const [view, setView] = useState("month");
    const [date, setDate] = useState(new Date());
    const [idUsuario, setIdUsuario] = useState(null);
    const [token, setToken] = useState(null);
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
    const [mostrarCalendario, setMostrarCalendario] = useState(true);
    const [mostrarAgenda, setMostrarAgenda] = useState(false);
    const [vistaAnterior, setVistaAnterior] = useState(null);

    // Obtener usuario y token desde localStorage
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const storedToken = localStorage.getItem("authToken");

        if (storedUser && storedToken) {
            setIdUsuario(storedUser.usuario.id_usuario);
            setToken(storedToken);
        }
    }, []);

    // Obtener eventos de la API
    useEffect(() => {
        const fetchEventos = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/Eventos/eventos_todos/`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setEventos(data.eventos);
                setError(null);
            } catch (err) {
                console.error("Error fetching eventos:", err);
                setError("Error al cargar los eventos. Intente nuevamente.");
                setEventos([]);
            } finally {
                setLoading(false);
            }
        };

        fetchEventos();
    }, []);

    // Formatear eventos para el calendario
    const eventosFormateados = eventos.map(evento => ({
        id_evento: evento.id_evento,
        nombre: evento.nombre,
        ministerio: evento.ministerio || 'Sin ministerio',
        descripcion: evento.descripcion || 'Sin descripción',
        fecha: evento.fecha,
        hora: evento.hora ? evento.hora.substring(0, 5) : '00:00', // Formato HH:MM
        lugar: evento.lugar || 'Sin lugar definido',
        tipo_evento: evento.tipo_evento?.nombre || 'Sin tipo',
        es_mio: evento.es_mio
    }));

    // Funciones de navegación
    const handlePrev = () => {
        const newDate = new Date(date);
        view === "month"
            ? newDate.setMonth(newDate.getMonth() - 1)
            : newDate.setDate(newDate.getDate() - 7);
        setDate(newDate);
    };

    const handleNext = () => {
        const newDate = new Date(date);
        view === "month"
            ? newDate.setMonth(newDate.getMonth() + 1)
            : newDate.setDate(newDate.getDate() + 7);
        setDate(newDate);
    };

    const handleToday = () => setDate(new Date());

    const handleEventoClick = (idEvento) => {
        setEventoSeleccionado(idEvento);
        setVistaAnterior(mostrarAgenda ? "agenda" : "calendario");
        setMostrarCalendario(false);
        setMostrarAgenda(false);
    };

    const handleMostrarAgenda = (fecha) => {
        setVistaAnterior("calendario");
        setMostrarAgenda(true);
        setMostrarCalendario(false);
    };

    const cerrarDetalleEvento = () => {
        setEventoSeleccionado(null);
        if (vistaAnterior === "agenda") {
            setMostrarAgenda(true);
            setMostrarCalendario(false);
        } else {
            setMostrarCalendario(true);
            setMostrarAgenda(false);
        }
        setVistaAnterior(null);
    };

    if (loading) {
        return (
            <div className="p-4 mt-16 flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 mt-16 text-center text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="p-4 mt-16">
            {mostrarCalendario && !mostrarAgenda && !eventoSeleccionado && (
                <>
                    <ControlesCalendario
                        handlePrev={handlePrev}
                        handleNext={handleNext}
                        handleToday={handleToday}
                        view={view}
                        setView={setView}
                    />
                    <VistaCalendario
                        view={view}
                        date={date}
                        eventosAprobados={eventosFormateados}
                        onEventoClick={handleEventoClick}
                        onMostrarAgenda={handleMostrarAgenda}
                    />
                </>
            )}

            {eventoSeleccionado && (
                <DetalleEvento
                    idUsuario={idUsuario}
                    idEvento={eventoSeleccionado}
                    token={token}
                    onClose={cerrarDetalleEvento}
                />
            )}
        </div>
    );
};

export default CalendarioEventosIglesia;