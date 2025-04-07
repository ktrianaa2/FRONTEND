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
    const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
    const [mostrarCalendario, setMostrarCalendario] = useState(true);
    const [mostrarAgenda, setMostrarAgenda] = useState(false);
    const [vistaAnterior, setVistaAnterior] = useState(null);
    const eventos = [
        {
            id_evento: 1,
            nombre: "Evangelismo en la plaza",
            ministerio: "Juventudes",
            descripcion: "Actividad evangelística con dinámicas y oración",
            fecha: "2025-04-07",
            hora: "16:00"
        },
        {
            id_evento: 2,
            nombre: "Ensayo coreográfico",
            ministerio: "Danza",
            descripcion: "Práctica para presentación del domingo",
            fecha: "2025-04-08",
            hora: "18:30"
        },
        {
            id_evento: 3,
            nombre: "Reunión RIO",
            ministerio: "RIO",
            descripcion: "Encuentro de intercesión y oración",
            fecha: "2025-04-09",
            hora: "20:00"
        },
        {
            id_evento: 4,
            nombre: "Ensayo general de alabanza",
            ministerio: "Alabanza",
            descripcion: "Revisión de repertorio completo",
            fecha: "2025-04-10",
            hora: "19:00"
        },
        {
            id_evento: 5,
            nombre: "Tarde de juegos y merienda",
            ministerio: "Juventudes",
            descripcion: "Actividad recreativa con los adolescentes",
            fecha: "2025-04-11",
            hora: "17:00"
        },
        {
            id_evento: 6,
            nombre: "Taller de danza profética",
            ministerio: "Danza",
            descripcion: "Capacitación sobre danza espiritual",
            fecha: "2025-04-12",
            hora: "15:00"
        },
        {
            id_evento: 7,
            nombre: "Vigilia RIO",
            ministerio: "RIO",
            descripcion: "Oración nocturna con toda la iglesia",
            fecha: "2025-04-12",
            hora: "22:00"
        },
        {
            id_evento: 8,
            nombre: "Ministración profética",
            ministerio: "Alabanza",
            descripcion: "Tiempo de adoración y palabra profética",
            fecha: "2025-04-13",
            hora: "18:00"
        },
        {
            id_evento: 9,
            nombre: "Tarde creativa",
            ministerio: "Juventudes",
            descripcion: "Taller de escritura y expresión artística",
            fecha: "2025-04-14",
            hora: "16:30"
        },
        {
            id_evento: 10,
            nombre: "Conexión RIO",
            ministerio: "RIO",
            descripcion: "Espacio de comunión, adoración y palabra",
            fecha: "2025-04-15",
            hora: "19:30"
        }
    ];

    // Obtener usuario y token desde localStorage
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
            setIdUsuario(storedUser.usuario.id_usuario);
            setToken(storedToken);
        }
    }, []);

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
        setFechaSeleccionada(fecha);
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
                        eventosAprobados={eventos}
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
