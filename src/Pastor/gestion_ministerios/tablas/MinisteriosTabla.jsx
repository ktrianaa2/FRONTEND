import React from "react";

function MinisteriosTabla({ filteredMinisterios, handleEdit, handleDisable }) {
  return (
    <div>
      <table className="table table-striped table-hover shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Logo</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Líder(es)</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredMinisterios.map((ministerio, index) => (
            <tr key={index}>
              <td>
                <img
                  src={ministerio.logo}
                  alt={ministerio.nombre}
                  style={{
                    maxWidth: "50px",
                    objectFit: "contain",
                    borderRadius: "5px",
                  }}
                />
              </td>
              <td>{ministerio.nombre}</td>
              <td>{ministerio.descripcion}</td>
              <td>{ministerio.lideres.join(", ")}</td>
              <td>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleEdit(ministerio)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDisable(ministerio)}
                  >
                    Deshabilitar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MinisteriosTabla;
