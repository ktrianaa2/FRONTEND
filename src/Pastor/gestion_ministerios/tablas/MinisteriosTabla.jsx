import React, { useState } from "react";
import { notification, Modal } from "antd";
import "../../../Styles/Tabla.css"

function MinisteriosTabla({ ministerios, filteredMinisterios, handleEdit, handleDisable, onVerDetalles }) {
  const [api, contextHolder] = notification.useNotification();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

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

  const handlePreview = (imgUrl) => {
    setPreviewImage(imgUrl);
    setPreviewVisible(true);
  };

  const handleCancel = () => setPreviewVisible(false);

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
                  {ministerio.imagen_url ? (
                    <div 
                      className="imagen-container"
                      onClick={() => handlePreview(ministerio.imagen_url)}
                      style={{cursor: 'pointer'}}
                    >
                      <img
                        src={ministerio.imagen_url}
                        alt={ministerio.nombre}
                        className="tabla-logo"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/path/to/default-image.png';
                        }}
                      />
                      <div className="zoom-icon">
                        <i className="fas fa-search-plus"></i>
                      </div>
                    </div>
                  ) : (
                    <div className="tabla-logo-placeholder">
                      <i className="fas fa-church"></i>
                    </div>
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

      {/* Modal para vista ampliada de la imagen */}
      <Modal
        visible={previewVisible}
        footer={null}
        onCancel={handleCancel}
        width="auto"
        style={{ maxWidth: '90vw' }}
        bodyStyle={{ padding: 0, textAlign: 'center' }}
      >
        <img
          alt="Vista previa"
          style={{ maxHeight: '80vh', maxWidth: '100%' }}
          src={previewImage}
        />
      </Modal>
    </div>
  );
}

export default MinisteriosTabla;