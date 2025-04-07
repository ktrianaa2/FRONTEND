import React, { useState } from "react";
import '../../../Styles/CalendarioSemana.css';

const SemanaEventos = ({ date, eventos, onEventoClick }) => {
  // Configuración de la semana comenzando en domingo
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - startOfWeek.getDay()); // Domingo como primer día
  startOfWeek.setHours(0, 0, 0, 0);

  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    return day;
  });

  // Estado para múltiples días abiertos
  const [openDays, setOpenDays] = useState(new Set());

  // Formateador de días
  const dayFormatter = new Intl.DateTimeFormat("es-ES", {
    weekday: "long"
  });

  // Obtener eventos del día
  const getEventsForDay = (day) => {
    return eventos.filter(evento => {
      const eventoDate = new Date(evento.fecha + 'T00:00:00'); // Añadimos 'T00:00:00' para corregir posibles problemas de zona horaria
      return (
        eventoDate.getUTCDate() === day.getUTCDate() &&
        eventoDate.getUTCMonth() === day.getUTCMonth() &&
        eventoDate.getUTCFullYear() === day.getUTCFullYear()
      );
    });
  };

  // Manejar clic en día (toggle)
  const handleDayClick = (day) => {
    const dayTime = day.getTime();
    setOpenDays(prev => {
      const newOpenDays = new Set(prev);
      if (newOpenDays.has(dayTime)) {
        newOpenDays.delete(dayTime);
      } else {
        newOpenDays.add(dayTime);
      }
      return newOpenDays;
    });
  };

  return (
    <div className="semana-lista-container">
      <h2 className="semana-titulo">
        Semana del {startOfWeek.toLocaleDateString("es-ES", { day: 'numeric', month: 'long' })}
      </h2>

      <div className="dias-lista">
        {daysOfWeek.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const isOpen = openDays.has(day.getTime());
          const dayName = dayFormatter.format(day);

          return (
            <div key={index} className="dia-item-container">
              <div
                className={`dia-header ${isOpen ? 'dia-seleccionado' : ''}`}
                onClick={() => handleDayClick(day)}
              >
                <span className="dia-nombre">
                  {dayName.charAt(0).toUpperCase() + dayName.slice(1)} {day.getUTCDate()}
                </span>
                {dayEvents.length > 0 && (
                  <span className="evento-contador">[{dayEvents.length}]</span>
                )}
              </div>

              {isOpen && (
                <div className="eventos-lista">
                  {dayEvents.length > 0 ? (
                    dayEvents.map((evento, idx) => (
                      <button
                        key={idx}
                        className="evento-item"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventoClick(evento.id_evento);
                        }}
                      >
                        <div className="evento-nombre">{evento.nombre}</div>
                        <div className="evento-ministerio">
                          <span>Ministerio:</span> {evento.ministerio}
                        </div>
                        {evento.descripcion && (
                          <div className="evento-descripcion">{evento.descripcion}</div>
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="sin-eventos">No hay eventos programados</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SemanaEventos;