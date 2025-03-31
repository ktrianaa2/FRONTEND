import React, { useState, useEffect } from "react";
import EditarMinisterioFormulario from "./formularios/EditarMinisterioFormulario"; // Asegúrate de importar el formulario de editar

function EditarMinisterio({ ministerio, onClose }) {
  return (
    <div className="bg-light p-4 border rounded">
      <h5>Editar Ministerio</h5>
      <EditarMinisterioFormulario ministerio={ministerio} onClose={onClose} />
    </div>
  );
}

export default EditarMinisterio;
