import React, { useState } from "react";
import CalendarioMes from "./calendarios/CalendarioMes";
import { Button, notification } from "antd";
import HistorialDevocionales from "./Tabla/HistorialDevocionales";

const AdministrarDevocional = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [yearInput, setYearInput] = useState(new Date().getFullYear().toString());
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const handleMonthChange = (e) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(parseInt(e.target.value));
    setCurrentDate(newDate);
  };

  const handleYearChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setYearInput(value);
      if (value.length === 4) {
        const newDate = new Date(currentDate);
        newDate.setFullYear(parseInt(value));
        setCurrentDate(newDate);
      }
    }
  };

  const toggleHistorial = () => {
    setMostrarHistorial(!mostrarHistorial);
  };

  return (
    <div className="p-4">
      {contextHolder}
      
      {/* Mostrar solo cuando no esté en el historial */}
      {!mostrarHistorial && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Administrar Devocional</h2>
          <Button 
            type="primary" 
            onClick={toggleHistorial}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Ver Historial
          </Button>
        </div>
      )}

      {mostrarHistorial ? (
        <HistorialDevocionales 
          onClose={() => setMostrarHistorial(false)}
        />
      ) : (
        <>
          <div className="flex gap-4 mb-4">
            <select 
              value={currentDate.getMonth()}
              onChange={handleMonthChange}
              className="p-2 border rounded"
            >
              {meses.map((mes, index) => (
                <option key={index} value={index}>{mes}</option>
              ))}
            </select>
            
            <input
              type="text"
              value={yearInput}
              onChange={handleYearChange}
              className="p-2 border rounded"
              placeholder="Año"
              maxLength={4}
            />
          </div>

          <CalendarioMes currentDate={currentDate} />
        </>
      )}
    </div>
  );
};

export default AdministrarDevocional;