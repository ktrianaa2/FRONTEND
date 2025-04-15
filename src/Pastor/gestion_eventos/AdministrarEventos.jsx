import React, { useState, useEffect } from "react";
import { notification } from "antd";
import TablaEventos from "./Tabla/TablaEventos";
import FormularioEvento from "./Formularios/FormularioEvento";
import FormularioEditarEvento from "./Formularios/FormularioEditarEvento";
import DetalleEvento from "./DetalleEvento"
import API_URL from "../../../Config";
import ModalMotivo from "./ModalMotivo";
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
  const [soloMisEventos, setSoloMisEventos] = useState(false); // Nuevo estado para el filtro

  const [modalMotivo, setModalMotivo] = useState({
    visible: false,
    idEvento: null,
    accion: '',
  });

  const handleAbrirModalMotivo = (idEvento, accion) => {
    setModalMotivo({
      visible: true,
      idEvento,
      accion
    });
  };

  const handleConfirmarAccion = (motivo) => {
    handleAccionEvento(modalMotivo.idEvento, modalMotivo.accion, motivo);
    setModalMotivo({ visible: false, idEvento: null, accion: '' });
  };

  const fetchEventos = async (misEventos = false) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');

      if (!token) {
        throw new Error('No hay sesión activa');
      }

      // Determinar la URL según el filtro
      const url = misEventos
        ? `${API_URL}/Eventos/mis_eventos/`
        : `${API_URL}/Eventos/evetos_usuarios/`;

      const response = await fetch(url, {
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
      setEventos(data.eventos || data); // Ajuste según la respuesta de tu API
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
    fetchEventos(soloMisEventos);
    fetchMinisterios();
  }, [soloMisEventos]);

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

  const handleAccionEvento = async (idEvento, accion, motivo = '') => {
    try {
      const token = localStorage.getItem('authToken');
      let response;
      let mensaje = '';
      let url = '';
      let bodyData = {};

      if (soloMisEventos) {
        // Lógica para cancelar/reactivar (tus eventos)
        const evento = eventos.find(e => e.id_evento === idEvento);
        const estaCancelado = evento.estado === 'Cancelado';

        // Mensajes específicos para cada caso
        if (estaCancelado) {
          mensaje = 'Evento reactivado';
          url = `${API_URL}/Eventos/cancelar-reactivar/${idEvento}/`;
          bodyData = {
            motivo: motivo || 'Reactivado por el creador'
          };
        } else {
          mensaje = 'Evento cancelado';
          url = `${API_URL}/Eventos/cancelar-reactivar/${idEvento}/`;
          bodyData = {
            motivo: motivo || 'Cancelado por el creador'
          };
        }
      } else {
        // Lógica para aprobar/rechazar/posponer/cancelar (todos los eventos)
        if (!accion) {
          throw new Error('Acción no especificada');
        }

        // Mensajes específicos para cada acción
        switch (accion) {
          case 'aprobar':
            mensaje = 'Evento aprobado';
            break;
          case 'rechazar':
            mensaje = 'Evento rechazado';
            break;
          case 'posponer':
            mensaje = 'Evento pospuesto';
            break;
          case 'cancelar':
            mensaje = 'Evento cancelado';
            break;
          default:
            mensaje = `Acción ${accion} realizada`;
        }

        url = `${API_URL}/Eventos/aprobar-rechazar/${idEvento}/`;
        bodyData = {
          accion,
          motivo: motivo || `${mensaje} por administrador`
        };
      }

      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData)
      });

      if (!response.ok) throw new Error(`Error al realizar la acción`);

      api.success({
        message: 'Éxito',
        description: mensaje,
        duration: 3,
      });
      fetchEventos(soloMisEventos);
    } catch (error) {
      api.error({
        message: 'Error',
        description: error.message,
        duration: 5,
      });
    }
  };

  const filteredEventos = eventos.filter((evento) =>
    `${evento.nombre}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {contextHolder} {/* Solo mantener esta instancia */}
      <h2 className="text-black">Administración de Eventos</h2>
      <hr />

      <ModalMotivo
        open={modalMotivo.visible}  // Cambiado de 'visible' a 'open'
        onCancel={() => setModalMotivo({ visible: false, idEvento: null, accion: '' })}
        onConfirm={handleConfirmarAccion}
        accion={modalMotivo.accion}
      />

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
            <div className="d-flex align-items-center gap-3">
              <input
                type="text"
                placeholder="Buscar evento"
                className="form-control shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '300px' }}
              />

              {/* Nuevo switch para filtrar */}
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="misEventosSwitch"
                  checked={soloMisEventos}
                  onChange={() => setSoloMisEventos(!soloMisEventos)}
                />
                <label className="form-check-label" htmlFor="misEventosSwitch">
                  Mostrar solo mis eventos
                </label>
              </div>
            </div>

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
              onRefreshData={() => fetchEventos(soloMisEventos)}
              onVerDetalle={(id) => setEventoSeleccionadoId(id)}
              onEditar={handleEditClick}
              onAccionEvento={handleAccionEvento}
              soloMisEventos={soloMisEventos}
              onAbrirModalMotivo={handleAbrirModalMotivo}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default AdministrarEventos;