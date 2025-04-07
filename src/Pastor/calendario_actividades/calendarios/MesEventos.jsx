import React, { useState, useEffect } from "react";
import '../../../Styles/CalendarioMes.css';

const MesEventos = ({ date, eventos, onEventoClick }) => {
    const [activeTooltip, setActiveTooltip] = useState(null);
    const [tooltipTarget, setTooltipTarget] = useState(null);
    // Obtener información del mes actual
    const month = date.toLocaleString("es-ES", { month: "long" });
    const year = date.getFullYear();
    const currentMonth = date.getMonth();
    const [eventosVisibles] = useState(2);

    // Obtener primer día del mes y último día del mes
    const firstDayOfMonth = new Date(year, currentMonth, 1);
    const lastDayOfMonth = new Date(year, currentMonth + 1, 0);

    // Días de la semana en español
    const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    // Calcular días del mes anterior a mostrar
    const daysFromPrevMonth = firstDayOfMonth.getDay();

    // Calcular días del próximo mes a mostrar
    const daysFromNextMonth = 6 - lastDayOfMonth.getDay();

    // Obtener el último día del mes anterior
    const lastDayPrevMonth = new Date(year, currentMonth, 0).getDate();

    // Crear array de días a mostrar
    const daysArray = [];

    // Agregar días del mes anterior
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
        daysArray.push({
            day: lastDayPrevMonth - i,
            isCurrentMonth: false,
            date: new Date(year, currentMonth - 1, lastDayPrevMonth - i)
        });
    }

    // Agregar días del mes actual
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        daysArray.push({
            day: i,
            isCurrentMonth: true,
            date: new Date(year, currentMonth, i)
        });
    }

    // Agregar días del próximo mes
    for (let i = 1; i <= daysFromNextMonth; i++) {
        daysArray.push({
            day: i,
            isCurrentMonth: false,
            date: new Date(year, currentMonth + 1, i)
        });
    }

    // Verificar si es hoy
    const isToday = (someDate) => {
        const today = new Date();
        return (
            someDate.getDate() === today.getDate() &&
            someDate.getMonth() === today.getMonth() &&
            someDate.getFullYear() === today.getFullYear()
        );
    };

    // Obtener eventos del día
    const eventosDelDia = (dayDate) => {
        return eventos.filter((evento) => {
            const eventoFecha = new Date(evento.fecha + 'T00:00:00'); // Añadir 'T00:00:00' para corregir la zona horaria
            return (
                eventoFecha.getUTCDate() === dayDate.getUTCDate() &&
                eventoFecha.getUTCMonth() === dayDate.getUTCMonth() &&
                eventoFecha.getUTCFullYear() === dayDate.getUTCFullYear()
            );
        });
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (activeTooltip && !e.target.closest('.custom-tooltip-container, .evento-extra')) {
                setActiveTooltip(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeTooltip]);

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4 text-capitalize">{`${month} ${year}`}</h2>

            <table className="table table-bordered" style={{ tableLayout: 'fixed' }}>
                <thead>
                    <tr>
                        {daysOfWeek.map((day, index) => (
                            <th
                                key={index}
                                className="text-center p-2 fw-bold"
                                style={{
                                    width: '14.28%',
                                    backgroundColor: '#000000',
                                    color: '#ffffff'
                                }}
                            >
                                {day}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {[...Array(Math.ceil(daysArray.length / 7))].map((_, weekIndex) => (
                        <tr key={weekIndex}>
                            {daysArray.slice(weekIndex * 7, (weekIndex + 1) * 7).map((dayObj, dayIndex) => {
                                const eventosDia = eventosDelDia(dayObj.date);
                                const dayKey = `${weekIndex}-${dayIndex}`;

                                return (
                                    <td
                                        key={dayIndex}
                                        className={`p-1 ${dayObj.isCurrentMonth ? '' : 'bg-light text-muted'} ${isToday(dayObj.date) ? 'table-primary' : ''}`}
                                        style={{
                                            height: '100px',
                                            verticalAlign: 'top',
                                            overflow: 'hidden',
                                            position: 'relative'
                                        }}
                                    >
                                        <div className="d-flex justify-content-between align-items-start">
                                            <span className={`fw-bold ${!dayObj.isCurrentMonth ? 'text-muted' : ''}`}>
                                                {dayObj.day}
                                            </span>
                                            {isToday(dayObj.date) && (
                                                <span className="badge bg-danger rounded-pill">Hoy</span>
                                            )}
                                        </div>
                                        <div className="mt-1" style={{ maxHeight: '90px' }}>
                                            {eventosDia.slice(0, eventosVisibles).map((evento, idx) => (
                                                <button
                                                    key={idx}
                                                    className="evento-calendario"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        onEventoClick(evento.id_evento);
                                                    }}
                                                    title={`${evento.ministerio}: ${evento.nombre}\n${evento.descripcion}`}
                                                >
                                                    <strong>{evento.ministerio}:</strong> {evento.nombre}
                                                </button>
                                            ))}
                                            {eventosDia.length > eventosVisibles && (
                                                <>
                                                    <button
                                                        className="evento-extra"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            setActiveTooltip(activeTooltip === dayKey ? null : dayKey);
                                                            setTooltipTarget(e.currentTarget);
                                                        }}
                                                        ref={node => dayKey === activeTooltip && setTooltipTarget(node)}
                                                    >
                                                        +{eventosDia.length - eventosVisibles} más...
                                                    </button>

                                                    {activeTooltip === dayKey && tooltipTarget && (
                                                        <div
                                                            className="custom-tooltip-container"
                                                            style={{
                                                                position: 'fixed',
                                                                top: `${tooltipTarget.getBoundingClientRect().bottom + window.scrollY}px`,
                                                                left: `${tooltipTarget.getBoundingClientRect().left + window.scrollX}px`,
                                                                zIndex: 9999,
                                                            }}
                                                            onClick={(e) => e.stopPropagation()} 
                                                        >
                                                            <div className="tooltip-eventos">
                                                                {eventosDia.slice(eventosVisibles).map((evento, idx) => (
                                                                    <button
                                                                        key={idx}
                                                                        className="tooltip-evento"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            onEventoClick(evento.id_evento);
                                                                            setActiveTooltip(null);
                                                                        }}
                                                                    >
                                                                        <strong>{evento.ministerio}:</strong> {evento.nombre}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MesEventos;