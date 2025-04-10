import React from "react";
import { Modal } from "react-bootstrap";
import "../../../Styles/Modal.css"

function ModalDeshabilitar({ ministerio, onClose, onConfirm, show }) {
  return (
    <Modal show={show} onHide={onClose} centered className="modal-container">
      <Modal.Header closeButton className="modal-header">
        <Modal.Title className="modal-title">Deshabilitar Ministerio</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <div className="modal-body-content">
          <p>
            ¿Estás seguro de que deseas deshabilitar el ministerio "
            <strong>{ministerio.nombre}</strong>"?
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer className="modal-footer">
        <div className="modal-footer-buttons">
          <button
            className="modal-btn btn-cancelar"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="modal-btn btn-guardar"
            onClick={() => {
              onConfirm(ministerio);
              onClose();
            }}
          >
            Aceptar
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalDeshabilitar;