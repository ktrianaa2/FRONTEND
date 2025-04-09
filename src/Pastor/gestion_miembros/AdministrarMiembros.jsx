import React, { useState, useEffect } from "react";
import { notification } from "antd";
import TablaMiembros from "./Tabla/TablaMiembros";
import FormularioMiembro from "./Formularios/FormularioMiembro";
import FormularioEditarMiembro from "./Formularios/FormularioEditarMiembro";
import DetalleMiembro from "./DetalleMiembro";
import API_URL from "../../../Config";

function AdministrarMiembros() {
  const [search, setSearch] = useState("");
  const [personas, setPersonas] = useState([]);
  const [miembroSeleccionadoId, setMiembroSeleccionadoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedMiembro, setSelectedMiembro] = useState(null);
  const [api, contextHolder] = notification.useNotification();

  const fetchPersonas = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');

      if (!token) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch(`${API_URL}/Miembros/personas/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener los datos');
      }

      const data = await response.json();
      setPersonas(data.personas);
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
    fetchPersonas();
  }, []);

  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
  };

  const handleSuccess = () => {
    fetchPersonas();
    toggleFormulario();
    api.success({
      message: 'Éxito',
      description: 'Miembro registrado correctamente',
      duration: 3,
    });
  };

  const handleEditClick = (persona) => {
    setSelectedMiembro(persona);
    setShowEditForm(true);
  };

  const handleCloseForm = () => {
    setShowEditForm(false);
    setSelectedMiembro(null);
  };

  const handleUpdateSuccess = async () => {
    try {
      api.success({
        message: 'Éxito',
        description: 'Los datos del miembro se actualizaron correctamente',
        duration: 3,
      });

      if (fetchPersonas) {
        await fetchPersonas();
      }

      setShowEditForm(false);
      setSelectedMiembro(null);
    } catch (error) {
      api.error({
        message: 'Error',
        description: 'Ocurrió un error al actualizar los datos',
        duration: 5,
      });
    }
  };

  const filteredPersonas = personas.filter((persona) =>
    `${persona.nombres} ${persona.apellidos} ${persona.numero_cedula}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {contextHolder}
      <h2 className="text-black">Administración de Miembros</h2>
      <hr />

      {miembroSeleccionadoId ? (
        <DetalleMiembro
          idMiembro={miembroSeleccionadoId}
          onClose={() => setMiembroSeleccionadoId(null)}
        />
      ) : showEditForm ? (
        <FormularioEditarMiembro
          miembro={selectedMiembro}
          onClose={handleCloseForm}
          onUpdateSuccess={handleUpdateSuccess}
        />
      ) : mostrarFormulario ? (
        <FormularioMiembro
          onClose={toggleFormulario}
          onSuccess={handleSuccess}
        />
      ) : (
        <div>
          <div className="d-flex justify-content-between mb-4">
            <input
              type="text"
              placeholder="Buscar miembro"
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
              {mostrarFormulario ? "Cancelar" : "Nuevo Miembro"}
            </button>
          </div>

          {loading ? (
            <div className="text-center my-4">Cargando miembros...</div>
          ) : (
            <TablaMiembros
              personas={personas}
              filteredPersonas={filteredPersonas}
              loading={loading}
              onRefreshData={fetchPersonas}  
              onVerDetalle={(id) => setMiembroSeleccionadoId(id)} 
              onEditar={handleEditClick}  
            />
          )}
        </div>
      )}
    </div>
  );
}


export default AdministrarMiembros;