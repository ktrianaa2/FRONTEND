import React from "react";

function PastorNav({ onNavigate, Usuario }) {
  return (
    <nav className="navbar navbar-dark bg-black fixed-top">
      <div className="container-fluid d-flex align-items-center">
        <p
          className="navbar-brand mb-0 text-white fw-bold"
          style={{ cursor: "pointer" }}
          onClick={() => onNavigate("panel")}  
        >
          CITI URUGUAY
        </p>

        <div className="flex-grow-1 text-center">
          <span className="text-white">Pastor {Usuario}</span>
        </div>

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
    </nav>
  );
}

export default PastorNav;
