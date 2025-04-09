import React from "react";
import { notification } from "antd";
import "../../../Styles/Tabla.css"

function MinisteriosTabla({ ministerios, filteredMinisterios, handleEdit, handleDisable, onVerDetalles }) {
  const [api, contextHolder] = notification.useNotification();

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
      {contextHolder}
      {filteredMinisterios.length > 0 ? (
        <table className="tabla-principal">
          <thead>
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
                      className="tabla-logo"
                    />
                  ) : (
                    <div className="tabla-logo-placeholder">—</div>
                  )}
                </td>
                <td>{ministerio.nombre}</td>
                <td>{ministerio.descripcion || "Sin descripción"}</td>
                <td>{formatLideres(ministerio.lider1, ministerio.lider2)}</td>
                <td>
                  <span className={ministerio.estado === 'Activo' ? 'badge-activo' : 'badge-inactivo'}>
                    {ministerio.estado}
                  </span>
                </td>
                <td>
                  <div className="btn-acciones">
                    <button
                      className="btn-ver"
                      onClick={() => onVerDetalles(ministerio.id_ministerio)}
                    >
                      Ver Detalles
                    </button>
                    <button
                      className="btn-editar"
                      onClick={() => handleEdit(ministerio)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-deshabilitar"
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
      ) : (
        <div className={`sin-contenido-mensaje ${ministerios.length === 0 ? '' : 'filtros'}`}>
          {ministerios.length === 0
            ? "No hay ministerios registrados todavía."
            : "No hay ministerios que coincidan con los filtros aplicados."}
        </div>
      )}
    </div>
  );
}

export default MinisteriosTabla;