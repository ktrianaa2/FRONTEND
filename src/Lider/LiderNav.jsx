import React, { useEffect, useState } from "react";
import { Bell } from 'lucide-react';
import API_URL from "../../Config";

function LiderNav({ onNavigate, Usuario }) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_URL}/Eventos/notificaciones/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          const unread = data.notificaciones.filter(n => !n.leida).length;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchUnreadNotifications();
    const interval = setInterval(fetchUnreadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

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
            }} 
          />
          <p
            className="navbar-brand mb-0 text-white fw-bold"
            style={{ cursor: "pointer" }}
            onClick={() => onNavigate("panel")}
          >
            CITI URUGUAY
          </p>
        </div>

        <div className="text-white text-center flex-grow-1">
          Lider {Usuario}
        </div>

        <div className="d-flex align-items-center position-relative">
          <button
            className="btn btn-link text-white me-2 position-relative"
            style={{ fontSize: "0.50rem" }}
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNotifications"
            aria-controls="offcanvasNotifications"
          >
            <Bell size={24} />
            {unreadCount > 0 && (
              <span 
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{
                  fontSize: '0.6rem',
                  padding: '3px 6px',
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {unreadCount}
              </span>
            )}
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

export default LiderNav;