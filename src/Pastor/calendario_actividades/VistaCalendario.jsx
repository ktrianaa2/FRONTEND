import React from "react";
import VistaMes from "./calendarios/MesEventos";
import VistaSemana from "./calendarios/SemanaEventos";
import VistaAgenda from "./calendarios/AgendaEventos";

const VistaCalendario = ({
  view,
  date,
  eventosAprobados,
  onEventoClick,
}) => {
  return (
    <div>
      {view === "month" && (
        <VistaMes
          date={date}
          eventos={eventosAprobados}
          onEventoClick={onEventoClick}
        />
      )}
      {view === "week" && (
        <VistaSemana
          date={date}
          eventos={eventosAprobados}
          onEventoClick={onEventoClick}
        />
      )}
      {view === "agenda" && (
        <VistaAgenda
          eventos={eventosAprobados}
          onEventoClick={onEventoClick}
        />
      )}
    </div>
  );
};

export default VistaCalendario;