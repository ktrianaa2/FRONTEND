import React, { useState, useEffect } from "react";

function EditarMinisterioFormulario({ ministerio, onClose }) {
  const [nombre, setNombre] = useState(ministerio.nombre || "");
  const [descripcion, setDescripcion] = useState(ministerio.descripcion || "");
  const [lideres, setLideres] = useState(ministerio.lideres || []);
  const [selectedLider, setSelectedLider] = useState(""); 
  const [logo, setLogo] = useState(ministerio.logo || null);

  const [availableLideres] = useState([
    "Juan Pérez",
    "María González",
    "Carlos Ramírez",
    "Ana López",
    "José Martínez",
  ]); // Lista de líderes disponibles

  useEffect(() => {
    setNombre(ministerio.nombre);
    setDescripcion(ministerio.descripcion);
    setLideres(ministerio.lideres || []);
    setLogo(ministerio.logo);
  }, [ministerio]);

  const handleAddLider = () => {
    if (selectedLider && !lideres.includes(selectedLider)) {
      setLideres([...lideres, selectedLider]);
      setSelectedLider(""); // Limpiar selección después de añadir
    }
  };

  const handleRemoveLider = (lider) => {
    setLideres(lideres.filter((item) => item !== lider));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para editar el ministerio
    console.log({ nombre, descripcion, lideres, logo });
    // Cerrar el formulario después de enviar
    onClose();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre del Ministerio</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            className="form-control"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>

        {/* Líder(es) */}
        <div className="mb-3">
          <label className="form-label">Líder(es)</label>
          <div className="d-flex justify-content-between">
            <select
              className="form-select w-75"
              value={selectedLider}
              onChange={(e) => setSelectedLider(e.target.value)}
            >
              <option value="">Seleccionar líder</option>
              {availableLideres.map((lider, index) => (
                <option key={index} value={lider}>
                  {lider}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-primary ms-2"
              onClick={handleAddLider}
              disabled={!selectedLider}
            >
              +
            </button>
          </div>
          {/* Mostrar los líderes seleccionados */}
          <div className="mt-2">
            {lideres.length > 0 && (
              <ul className="list-group">
                {lideres.map((lider, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {lider}
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemoveLider(lider)}
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Logo */}
        <div className="mb-3">
          <label className="form-label">Logo (opcional)</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setLogo(e.target.files[0])}
          />
        </div>

        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-success text-white">
            Editar
          </button>
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={onClose} // Llama a onClose para cancelar
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarMinisterioFormulario;
