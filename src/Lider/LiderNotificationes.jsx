import React, { useEffect, useState } from "react";
import { Button, List, Badge, Modal, Input, Descriptions, message, notification } from "antd";
import API_URL from "../../Config";

function LiderNotificationes() {
  const [modalMotivo, setModalMotivo] = useState({
    visible: false,
    idNotificacion: null,
    evento: null,
    ministerio: null
  });
  const [motivo, setMotivo] = useState('');
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    cargarNotificaciones();
  }, []);

  const cargarNotificaciones = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/Eventos/notificaciones/?leida=true`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Error al cargar notificaciones');

      const data = await response.json();
      setNotificaciones(data.notificaciones || []);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
      api.error({
        message: 'Error',
        description: 'No se pudieron cargar las notificaciones'
      });
    } finally {
      setLoading(false);
    }
  };

  const manejarRechazoConMotivo = (notificacion) => {
    setModalMotivo({
      visible: true,
      idNotificacion: notificacion.id_notificacion,
      evento: notificacion.evento?.nombre || 'Evento no disponible',
      ministerio: notificacion.evento?.ministerio || 'Ministerio no disponible'
    });
  };

  const confirmarRechazo = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/Eventos/notificaciones/respuesta/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_notificacion: modalMotivo.idNotificacion,
          aprobada: false,
          motivo_rechazo: motivo
        })
      });

      if (!response.ok) throw new Error('Error al procesar el rechazo');

      api.success({
        message: 'Éxito',
        description: 'Has rechazado la solicitud'
      });

      setModalMotivo({ visible: false, idNotificacion: null, evento: null, ministerio: null });
      setMotivo('');
      await cargarNotificaciones();
    } catch (error) {
      console.error('Error al rechazar:', error);
      api.error({
        message: 'Error',
        description: 'No se pudo procesar el rechazo'
      });
    }
  };

  const manejarAprobacion = async (idNotificacion) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/Eventos/notificaciones/respuesta/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_notificacion: idNotificacion,
          aprobada: true
        })
      });

      if (!response.ok) throw new Error('Error al procesar la aprobación');

      api.success({
        message: 'Éxito',
        description: 'Has aprobado la solicitud'
      });
      await cargarNotificaciones();
    } catch (error) {
      console.error('Error al aprobar:', error);
      api.error({
        message: 'Error',
        description: 'No se pudo procesar la aprobación'
      });
    }
  };

  const manejarCerrarNotificacion = async (idNotificacion) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/Eventos/notificaciones/marcar_leida/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_notificacion: idNotificacion
        })
      });

      if (!response.ok) throw new Error('Error al cerrar notificación');

      // Actualizar el estado local sin recargar todas las notificaciones
      setNotificaciones(prev => prev.map(n => 
        n.id_notificacion === idNotificacion ? {...n, leida: true} : n
      ));
      
      api.success({
        message: 'Notificación cerrada',
        description: 'La notificación ha sido marcada como leída'
      });
    } catch (error) {
      console.error('Error al cerrar notificación:', error);
      api.error({
        message: 'Error',
        description: 'No se pudo cerrar la notificación'
      });
    }
  };

  const renderActions = (notificacion) => {
    // Notificaciones de solicitud pendientes
    if (notificacion.tipo === 'solicitud_cancelacion' && notificacion.accion_tomada === null) {
      return [
        <Button
          key="aprobar"
          type="primary"
          size="small"
          onClick={() => manejarAprobacion(notificacion.id_notificacion)}
          style={{ marginRight: 8 }}
        >
          Aprobar
        </Button>,
        <Button
          key="rechazar"
          danger
          size="small"
          onClick={() => manejarRechazoConMotivo(notificacion)}
        >
          Rechazar
        </Button>
      ];
    }
    
    // Notificaciones ya procesadas o de otro tipo
    return [
      <Button
        key="cerrar"
        type="text"
        size="small"
        onClick={() => manejarCerrarNotificacion(notificacion.id_notificacion)}
      >
        Cerrar
      </Button>
    ];
  };

  const renderTitulo = (notificacion) => {
    switch(notificacion.tipo) {
      case 'solicitud_cancelacion':
        return notificacion.accion_tomada === true 
          ? '✅ Solicitud Aprobada' 
          : notificacion.accion_tomada === false 
            ? '❌ Solicitud Rechazada' 
            : '⚠️ Solicitud de Cancelación';
      case 'respuesta_rechazo':
        return '📄 Respuesta a tu solicitud';
      default:
        return '🔔 Notificación';
    }
  };

  const renderDescripcion = (notificacion) => {
    return (
      <div>
        <p style={{ marginBottom: 8 }}>{notificacion.mensaje}</p>
        {notificacion.motivo_rechazo && (
          <p style={{ marginBottom: 8 }}>
            <strong>Motivo:</strong> {notificacion.motivo_rechazo}
          </p>
        )}
        {notificacion.remitente && (
          <p style={{ marginBottom: 8 }}>
            <strong>Por:</strong> {notificacion.remitente.nombres} {notificacion.remitente.apellidos}
          </p>
        )}
        {notificacion.evento && (
          <p style={{ marginBottom: 0 }}>
            <strong>Evento:</strong> {notificacion.evento.nombre} | 
            <strong> Ministerio:</strong> {notificacion.evento.ministerio}
          </p>
        )}
      </div>
    );
  };

  return (
    <>
      {contextHolder}
      
      <Modal
        title="Rechazar Solicitud de Cancelación"
        open={modalMotivo.visible}
        onOk={confirmarRechazo}
        onCancel={() => setModalMotivo({ visible: false, idNotificacion: null, evento: null, ministerio: null })}
        okText="Confirmar Rechazo"
        cancelText="Cancelar"
        okButtonProps={{ disabled: !motivo.trim() }}
        width={700}
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Evento">{modalMotivo.evento}</Descriptions.Item>
          <Descriptions.Item label="Ministerio">{modalMotivo.ministerio}</Descriptions.Item>
        </Descriptions>
        
        <div style={{ marginTop: 20 }}>
          <h4>Motivo del rechazo:</h4>
          <Input.TextArea
            rows={4}
            placeholder="Explica detalladamente por qué rechazas esta solicitud de cancelación..."
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            autoFocus
          />
        </div>
      </Modal>

      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="offcanvasNotifications"
        aria-labelledby="offcanvasNotificationsLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasNotificationsLabel">
            Notificaciones
            <Badge 
              count={notificaciones.filter(n => !n.leida).length} 
              className="ms-2" 
              style={{ backgroundColor: '#1890ff' }}
            />
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          {loading ? (
            <div style={{ textAlign: 'center', padding: 20 }}>
              <p>Cargando notificaciones...</p>
            </div>
          ) : notificaciones.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 20 }}>
              <p>No tienes notificaciones en este momento.</p>
            </div>
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={notificaciones}
              renderItem={(notificacion) => (
                <List.Item
                  style={{
                    padding: '12px 16px',
                    borderLeft: !notificacion.leida ? '3px solid #1890ff' : '3px solid #f0f0f0',
                    backgroundColor: !notificacion.leida ? '#f6fbff' : 'white'
                  }}
                  actions={renderActions(notificacion)}
                >
                  <List.Item.Meta
                    title={<span style={{ fontWeight: !notificacion.leida ? 600 : 400 }}>{renderTitulo(notificacion)}</span>}
                    description={renderDescripcion(notificacion)}
                  />
                </List.Item>
              )}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default LiderNotificationes;