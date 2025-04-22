import React, { useState, useEffect } from "react";
import { notification } from "antd";
import TablaTiposEvento from "./Tabla/TablaTiposEvento";
import FormularioTipoEvento from "./Formularios/FormularioTipoEvento";
import FormularioEditarTipoEvento from "./Formularios/FormularioEditarTipoEvento";
import API_URL from "../../../../Config";

function AdministrarTiposEvento() {
  const [tiposEvento, setTiposEvento] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedTipoEvento, setSelectedTipoEvento] = useState(null);
  const [api, contextHolder] = notification.useNotification();

  const fetchTiposEvento = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/Eventos/tipos_evento/listar/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) throw new Error('Error al obtener los tipos de evento');

      const data = await response.json();
      setTiposEvento(data.data);
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

  useEffect(() => {
    fetchTiposEvento();
  }, []);

  const handleSuccess = () => {
    fetchTiposEvento();
    setMostrarFormulario(false);
    api.success({
      message: 'Éxito',
      description: 'Operación realizada correctamente',
      duration: 3,
    });
  };

  const handleEditClick = (tipoEvento) => {
    setSelectedTipoEvento(tipoEvento);
    setShowEditForm(true);
  };

  const handleCambiarEstado = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/Eventos/tipos_evento/cambiar_estado/${id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) throw new Error('Error al cambiar estado');

      fetchTiposEvento();
      api.success({
        message: 'Éxito',
        description: 'Estado cambiado correctamente',
        duration: 3,
      });
    } catch (err) {
      api.error({
        message: 'Error',
        description: err.message,
        duration: 5,
      });
    }
  };

  return (
    <div className="container-fluid mt-3">
      {contextHolder}
      <div className="row">
        <div className="col-12">
          <h2 className="mb-3">Administrar Tipos de Evento</h2>
          <hr />
        </div>
      </div>

      {showEditForm ? (
        <div className="row">
          <div className="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
            <FormularioEditarTipoEvento
              tipoEvento={selectedTipoEvento}
              onClose={() => setShowEditForm(false)}
              onSuccess={handleSuccess}
            />
          </div>
        </div>
      ) : mostrarFormulario ? (
        <div className="row">
          <div className="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
            <FormularioTipoEvento
              onClose={() => setMostrarFormulario(false)}
              onSuccess={handleSuccess}
            />
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-end mb-3">
              <button
                className="btn btn-primary"
                onClick={() => setMostrarFormulario(true)}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Nuevo Tipo
              </button>
            </div>

            <div className="table-responsive">
              <TablaTiposEvento
                data={tiposEvento}
                loading={loading}
                onEdit={handleEditClick}
                onCambiarEstado={handleCambiarEstado}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdministrarTiposEvento;