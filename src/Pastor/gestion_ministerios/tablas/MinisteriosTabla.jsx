import React from "react";

function MinisteriosTabla({ filteredMinisterios, handleEdit, handleDisable, onVerDetalles }) {
  // Función para formatear los nombres de los líderes
  const formatLideres = (lider1, lider2) => {
    const lideres = [];
    if (lider1) {
      lideres.push(`${lider1.nombres} ${lider1.apellidos}`);
    }
    if (lider2) {
      lideres.push(`${lider2.nombres} ${lider2.apellidos}`);
    }
    return lideres.length > 0 ? lideres.join(", ") : "Sin líderes asignados";
  };

  return (
    <div>
      <table className="table table-striped table-hover shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Logo</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Líder(es)</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredMinisterios.map((ministerio) => (
            <tr key={ministerio.id_ministerio}>
              <td>
                {ministerio.logo ? (
                  <img
                    src={ministerio.logo}
                    alt={ministerio.nombre}
                    style={{
                      maxWidth: "50px",
                      objectFit: "contain",
                      borderRadius: "5px",
                    }}
                  />
                ) : (
                  <div style={{ width: "50px", textAlign: "center" }}>—</div>
                )}
              </td>
              <td>{ministerio.nombre}</td>
              <td>{ministerio.descripcion || "Sin descripción"}</td>
              <td>{formatLideres(ministerio.lider1, ministerio.lider2)}</td>
              <td>
                <span className={`badge ${ministerio.estado === 'Activo' ? 'bg-success' : 'bg-secondary'}`}>
                  {ministerio.estado}
                </span>
              </td>
              <td>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => onVerDetalles(ministerio.id_ministerio)}
                  >
                    Ver Detalles
                  </button>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleEdit(ministerio)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDisable(ministerio)}
                    disabled={ministerio.estado === 'Inactivo'}
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