import React from "react";

function LiderMenu({ onNavigate, Usuario, onLogout }) {
  return (
    <div
      className="offcanvas offcanvas-end"
      tabIndex="-1"
      id="offcanvasNavbar"
      aria-labelledby="offcanvasNavbarLabel"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
          Menú de administración
        </h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div className="offcanvas-body">
        <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
          <li className="nav-item">
            <button
              className="nav-link btn"
              onClick={() => onNavigate("panel")}
            >
              Inicio
            </button>
          </li>
          <li className="nav-item dropdown">
            <button
              className="nav-link dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Más opciones
            </button>
            <ul className="dropdown-menu">
              <li>
                <button className="dropdown-item" onClick={() => onNavigate("reportes")}>
                  Reportes
                </button>
              </li>
              <li>
                <button className="dropdown-item" onClick={() => onNavigate("option2")}>
                  Configuración
                </button>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button className="dropdown-item" onClick={onLogout}>
                  Cerrar sesión
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default LiderMenu;
