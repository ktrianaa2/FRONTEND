import React from "react";

function PastorNotificationes() {
  return (
    <div
      className="offcanvas offcanvas-end"
      tabIndex="-1"
      id="offcanvasNotifications"
      aria-labelledby="offcanvasNotificationsLabel"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="offcanvasNotificationsLabel">
          Notificaciones
        </h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div className="offcanvas-body">
        <p>No tienes notificaciones en este momento.</p>
      </div>
    </div>
  );
}

export default PastorNotificationes;
