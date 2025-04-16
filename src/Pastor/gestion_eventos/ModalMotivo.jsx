import React, { useState } from 'react';
import { Modal, Input, Button } from 'antd';

const ModalMotivo = ({ open, onCancel, onConfirm, accion }) => {
  const [motivo, setMotivo] = useState('');

  // Definimos todas las acciones posibles, incluyendo "posponer"
  const titulosAccion = {
    aprobar: 'Aprobar',
    rechazar: 'Rechazar',
    cancelar: 'Cancelar',
    reactivar: 'Reactivar',
    posponer: 'Posponer'
  };

  // Mensajes personalizados para cada acción
  const mensajesPlaceholder = {
    aprobar: 'Ingrese el motivo de aprobación (opcional)...',
    rechazar: 'Ingrese el motivo del rechazo...',
    cancelar: 'Ingrese el motivo de la cancelación...',
    reactivar: 'Ingrese el motivo de la reactivación...',
    posponer: 'Ingrese el motivo de la posposición y la nueva fecha si es necesario...'
  };

  return (
    <Modal
      title={`${titulosAccion[accion] || accion} Evento`}
      open={open}
      onCancel={() => {
        onCancel();
        setMotivo('');
      }}
      footer={[
        <Button key="cancel" onClick={() => {
          onCancel();
          setMotivo('');
        }}>
          Cancelar
        </Button>,
        <Button 
          key="confirm" 
          type="primary" 
          onClick={() => {
            onConfirm(motivo);
            setMotivo('');
          }}
          // Hacer obligatorio el motivo solo para rechazar y cancelar
          disabled={!motivo.trim() && ['rechazar', 'cancelar'].includes(accion)}
        >
          Confirmar
        </Button>,
      ]}
      destroyOnClose
    >
      <Input.TextArea
        rows={4}
        placeholder={mensajesPlaceholder[accion] || `Ingrese el motivo para ${titulosAccion[accion] || accion}...`}
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
        autoFocus
      />
    </Modal>
  );
};

export default ModalMotivo;