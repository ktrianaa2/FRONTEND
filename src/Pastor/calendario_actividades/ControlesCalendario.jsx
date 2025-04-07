import React from "react";
import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";

const ControlesCalendario = ({
  handlePrev,
  handleNext,
  handleToday,
  view,
  setView,
}) => {
  return (
    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mb-4 gap-4">
      <div className="d-flex gap-2">
        <button
          onClick={handlePrev}
          className="d-flex align-items-center btn btn-dark btn-sm font-weight-bold py-2 px-4 border-0 rounded"
        >
          <ArrowLeft className="me-2" />
          Anterior
        </button>
        <button
          onClick={handleToday}
          className="d-flex align-items-center btn btn-dark btn-sm font-weight-bold py-2 px-4 border-0 rounded"
        >
          <CalendarDays className="me-2" />
          Hoy
        </button>
        <button
          onClick={handleNext}
          className="d-flex align-items-center btn btn-dark btn-sm font-weight-bold py-2 px-4 border-0 rounded"
        >
          Siguiente
          <ArrowRight className="ms-2" />
        </button>
      </div>

      <div className="d-flex gap-2">
        {["month", "week", "agenda"].map((mode) => (
          <button
            key={mode}
            onClick={() => setView(mode)}
            className={`px-4 py-2 rounded shadow-sm transition-colors btn btn-sm ${
              view === mode
                ? "btn-success border-0"
                : "btn-dark border-0"
            }`}
          >
            {mode === "month"
              ? "Mes"
              : mode === "week"
              ? "Semana"
              : "Agenda"}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ControlesCalendario;