import React from "react";
import { Bell } from 'lucide-react';

function PastorNav({ onNavigate, Usuario }) {
  return (
    <nav className="navbar navbar-dark bg-black fixed-top">
      <div className="container-fluid d-flex align-items-center justify-content-between">

        <div className="d-flex align-items-center">
          <img
            src="/Logo.webp"
            alt="Logo"
            onClick={() => onNavigate("panel")}
            style={{
              width: "80px",
              height: "40px",
              objectFit: "contain",
              marginRight: "10px",
              cursor: "pointer"
            }} />
          <p
            className="navbar-brand mb-0 text-white fw-bold"
            style={{ cursor: "pointer" }}
            onClick={() => onNavigate("panel")}
          >
            CITI URUGUAY
          </p>
        </div>

        <div className="text-white text-center flex-grow-1">
          Pastor {Usuario}
        </div>

        <div className="d-flex align-items-center">
          <button
            className="btn btn-link text-white me-2"
            style={{ fontSize: "0.50rem" }}
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNotifications"
            aria-controls="offcanvasNotifications"
          >
            <Bell />
          </button>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

      </div>
    </nav>
  );
}

export default PastorNav;
