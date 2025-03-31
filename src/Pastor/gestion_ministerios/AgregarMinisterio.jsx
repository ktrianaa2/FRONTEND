import React from "react";
import AgregarMinisterioFormulario from "./formularios/AgregarMinisterioFormulario"; // Asegúrate de importar el formulario de agregar

function AgregarMinisterio({ onClose }) {
  return (
    <div className="bg-light p-4 border rounded">
      <h5>Agregar Ministerio</h5>
      <AgregarMinisterioFormulario onClose={onClose} />
    </div>
  );
}

export default AgregarMinisterio;
