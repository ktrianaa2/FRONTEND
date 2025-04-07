import React, { useState } from "react";
import "../../../Styles/CalendarioAgenda.css";

const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

const formatearFecha = (fechaStr) => {
  const fecha = new Date(fechaStr + 'T00:00:00');  
  const diaSemana = diasSemana[fecha.getUTCDay()];  
  const dia = fecha.getUTCDate();  
  const mes = meses[fecha.getUTCMonth()];  
  return `${diaSemana}, ${dia} ${mes}`;
};

const formatearParaComparar = (fechaStr) => {
  const fecha = new Date(fechaStr);
  return fecha.toISOString().split('T')[0]; 
};

const esHoy = (fechaStr) => {
  const hoy = new Date();
  return formatearParaComparar(fechaStr) === formatearParaComparar(hoy);
};

const esManana = (fechaStr) => {
  const hoy = new Date();
  const manana = new Date(hoy);
  manana.setDate(hoy.getDate() + 1);
  return formatearParaComparar(fechaStr) === formatearParaComparar(manana);
};

const esFutura = (fechaStr) => {
  const hoy = new Date();
  return formatearParaComparar(fechaStr) >= formatearParaComparar(hoy);
};

const esPasada = (fechaStr) => {
  const hoy = new Date();
  return formatearParaComparar(fechaStr) < formatearParaComparar(hoy);
};

const AgendaEventos = ({ eventos, onEventoClick }) => {
  const [vista, setVista] = useState("proximos");
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");

  if (!eventos || eventos.length === 0) {
    return (
      <div className="agenda-vacia">
        <div className="icono-agenda-vacia">📅</div>
        <h3>No hay eventos próximos</h3>
        <p>Actualmente no tienes eventos programados</p>
      </div>
    );
  }

  const eventosAgrupados = eventos.reduce((acc, evento) => {
    const fecha = evento.fecha;
    if (!acc[fecha]) acc[fecha] = [];
    acc[fecha].push(evento);
    return acc;
  }, {});

  const fechas = Object.keys(eventosAgrupados).sort();
  const proximos = fechas.filter(f => esFutura(f));
  const pasados = fechas.filter(f => esPasada(f)).sort((a, b) => new Date(b) - new Date(a));

  const renderDia = (fecha) => {
    const eventosDia = eventosAgrupados[fecha];
    return (
      <div key={fecha} className="dia-agenda">
        <div className="fecha-header">
          <h3 className="dia-titulo">
            {formatearFecha(fecha)}
            {esHoy(fecha) && <span className="badge-hoy">Hoy</span>}
            {esManana(fecha) && <span className="badge-manana">Mañana</span>}
          </h3>
          <span className="eventos-count">
            {eventosDia.length} evento{eventosDia.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="eventos-list">
          {eventosDia
            .sort((a, b) => (a.hora || '').localeCompare(b.hora || ''))
            .map((evento, index) => (
              <div key={index} className="evento-card clickable" onClick={() => onEventoClick(evento.id_evento)}>
                <div className="evento-hora">{evento.hora}</div>
                <div className="evento-info">
                  <h4 className="evento-nombre">{evento.nombre}</h4>
                  <div className="evento-meta">
                    <span className="evento-ministerio">{evento.ministerio}</span>
                    {evento.lugar && <span className="evento-lugar">📍</span>}
                  </div>
                  {evento.descripcion && (
                    <p className="evento-descripcion">{evento.descripcion}</p>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  };

  const eventosDeFecha = fechaSeleccionada
    ? eventosAgrupados[fechaSeleccionada]
    : null;

  return (
    <div className="agenda-container">
      <div className="d-flex gap-2">
        {["proximos", "pasados"].map((mode) => (
          <button
            key={mode}
            onClick={() => setVista(mode)}
            className={`px-4 py-2 rounded shadow-sm transition-colors btn btn-sm ${vista === mode
              ? "btn-success border-0"
              : "btn-dark border-0"
              }`}
          >
            {mode === "proximos" ? "Próximos" : "Pasados"}
          </button>
        ))}
        <div className="input-group">
          <span className="input-group-text">
            <i className="bi bi-calendar-event"></i>
          </span>
          <input
            type="date"
            className="form-control"
            value={fechaSeleccionada}
            onChange={(e) => {
              setVista("fecha");
              setFechaSeleccionada(e.target.value);
            }}
          />
        </div>
      </div>

      {vista === "proximos" && (
        proximos.length > 0 ? (
          <div className="seccion-agenda">
            <h2 className="seccion-titulo">Próximos Eventos</h2>
            {proximos.map(renderDia)}
          </div>
        ) : (
          <div className="agenda-vacia">
            <h4>No hay eventos próximos</h4>
            <p>Actualmente no tienes eventos programados</p>
          </div>
        )
      )}

      {vista === "pasados" && (
        pasados.length > 0 ? (
          <div className="seccion-agenda">
            <h2 className="seccion-titulo">Eventos Anteriores</h2>
            {pasados.map(renderDia)}
          </div>
        ) : (
          <div className="agenda-vacia">
            <h4>No hay eventos anteriores</h4>
            <p>No hay eventos registrados en el pasado</p>
          </div>
        )
      )}

      {vista === "fecha" && (
        <div className="seccion-agenda">
          <h2 className="seccion-titulo">Eventos del {fechaSeleccionada}</h2>
          {eventosDeFecha ? renderDia(fechaSeleccionada) : (
            <div className="agenda-vacia">
              <h4>No hay eventos para esta fecha</h4>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AgendaEventos;