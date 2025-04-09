import React, { useState, useEffect } from "react";
import { notification } from "antd";
import TablaEventos from "./Tabla/TablaEventos";
import FormularioEvento from "./Formularios/FormularioEvento";
import FormularioEditarEvento from "./Formularios/FormularioEditarEvento";
import DetalleEvento from "./DetalleEvento"
import API_URL from "../../../Config";

function AdministrarEventos() {
  const [search, setSearch] = useState("");
  const [eventos, setEventos] = useState([]);
  const [ministerios, setMinisterios] = useState([]);
  const [eventoSeleccionadoId, setEventoSeleccionadoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState(null);
  const [api, contextHolder] = notification.useNotification();

  const fetchEventos = async () => {
    try {
        setLoading(true);
        const token = localStorage.getItem('authToken');

        if (!token) {
            throw new Error('No hay sesión activa');
        }

        const response = await fetch(`${API_URL}/Eventos/eventos/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al obtener los eventos');
        }

        const data = await response.json();
        setEventos(data.eventos);
    } catch (err) {
        api.error({
            message: 'Error',
            description: err.message,
            duration: 5,
        });
    } finally {
        setLoading(false);
    }
};


  // Función para obtener ministerios
  const fetchMinisterios = async () => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('No se encontró token de autenticación');
        }

        const response = await fetch(`${API_URL}/Ministerio/listarministerios/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al obtener los ministerios');
        }

        const data = await response.json();
        setMinisterios(data.ministerios);
        setLoading(false); // Asegurarse de desactivar el loading
    } catch (err) {
        api.error({
            message: 'Error',
            description: err.message,
            duration: 5,
        });
        setLoading(false); // Asegurarse de desactivar el loading incluso en errores
    }
};

  useEffect(() => {
    fetchEventos();
    fetchMinisterios();
  }, []);

  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
  };

  const handleSuccess = () => {
    fetchEventos();
    toggleFormulario();
    api.success({
      message: 'Éxito',
      description: 'Evento registrado correctamente',
      duration: 3,
    });
  };

  const handleEditClick = (evento) => {
    setSelectedEvento(evento);
    setShowEditForm(true);
  };

  const handleCloseForm = () => {
    setShowEditForm(false);
    setSelectedEvento(null);
  };

  const handleUpdateSuccess = async () => {
    try {
      api.success({
        message: 'Éxito',
        description: 'Los datos del evento se actualizaron correctamente',
        duration: 3,
      });

      if (fetchEventos) {
        await fetchEventos();
      }

      setShowEditForm(false);
      setSelectedEvento(null);
    } catch (error) {
      api.error({
        message: 'Error',
        description: 'Ocurrió un error al actualizar los datos',
        duration: 5,
      });
    }
  };

  const filteredEventos = eventos.filter((evento) =>
    `${evento.nombre}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {contextHolder}
      <h2 className="text-black">Administración de Eventos</h2>
      <hr />

      {eventoSeleccionadoId ? (
        <DetalleEvento
          idEvento={eventoSeleccionadoId}
          onClose={() => setEventoSeleccionadoId(null)}
        />
      ) : showEditForm ? (
        <FormularioEditarEvento
          evento={selectedEvento}
          ministerios={ministerios} 
          onClose={handleCloseForm}
          onUpdateSuccess={handleUpdateSuccess}
        />
      ) : mostrarFormulario ? (
        <FormularioEvento
          onClose={toggleFormulario}
          onSuccess={handleSuccess}
          ministerios={ministerios} 
        />
      ) : (
        <div>
          <div className="d-flex justify-content-between mb-4">
            <input
              type="text"
              placeholder="Buscar evento"
              className="form-control w-50 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="btn btn-success text-white shadow-sm"
              onClick={toggleFormulario}
              disabled={loading}
            >
              <i
                className={`bi ${mostrarFormulario ? "bi-x-circle" : "bi-plus-circle"
                  } me-1`}
              ></i>
              {mostrarFormulario ? "Cancelar" : "Nuevo Evento"}
            </button>
          </div>

          {loading ? (
            <div className="text-center my-4">Cargando eventos...</div>
          ) : (
            <TablaEventos
              eventos={eventos}
              filteredEventos={filteredEventos}
              loading={loading}
              onRefreshData={fetchEventos}  
              onVerDetalle={(id) => setEventoSeleccionadoId(id)} 
              onEditar={handleEditClick}  
            />
          )}
        </div>
      )}
    </div>
  );
}


export default AdministrarEventos;