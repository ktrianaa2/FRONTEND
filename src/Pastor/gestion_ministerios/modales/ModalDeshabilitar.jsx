import React from "react";

function ModalDeshabilitar({ ministerio, onClose, onConfirm }) {
  return (
    <div
      className="modal fade show"
      style={{ display: "block" }}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="disableModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header bg-black text-white">
            <h5 className="modal-title" id="disableModalLabel">
              Deshabilitar Ministerio
            </h5>
            <button
              type="button"
              className="btn-close text-white"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onClose}
              style={{
                fontSize: "1.5rem",
                backgroundColor: "black",
                border: "none",
                position: "absolute",
                top: "10px",
                right: "10px",
              }}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p>
              ¿Estás seguro de que deseas deshabilitar el ministerio "
              {ministerio.nombre}"?
            </p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {
                onConfirm(ministerio); // Llamamos a onConfirm con el ministerio
                onClose();
              }}
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalDeshabilitar;
