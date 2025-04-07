import React from "react";
import { notification, Tag, Badge } from "antd";

function TablaMiembros({ personas, onRefreshData, onVerDetalle, onEditar }) {
  const [api, contextHolder] = notification.useNotification();

  // Función para renderizar los ministerios como tags
  const renderMinisterios = (ministerios) => {
    if (!ministerios || ministerios.length === 0) {
      return <Tag color="default">Sin ministerios</Tag>;
    }

    return ministerios.map((ministerio) => (
      <Tag 
        key={ministerio.id_ministerio} 
        color={ministerio.estado === 'Activo' ? 'green' : 'red'}
        style={{ marginBottom: '4px' }}
      >
        {ministerio.nombre} ({ministerio.rol_lider})
      </Tag>
    ));
  };

  // Función para mostrar el estado (activo/inactivo)
  const renderEstado = (activo) => {
    return activo ? (
      <Badge status="success" text="Activo" />
    ) : (
      <Badge status="error" text="Inactivo" />
    );
  };

  return (
    <div>
      {contextHolder}
      <div className="table-responsive">
        <table className="table table-striped table-hover shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Celular</th>
              <th>Cédula</th>
              <th>Ministerios</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {personas.map((persona) => (
              <tr key={persona.id_persona}>
                <td>{persona.id_persona}</td>
                <td>{persona.nombres}</td>
                <td>{persona.apellidos}</td>
                <td>
                  <Tag color={persona.usuario.rol === 'Pastor' ? 'purple' : 'blue'}>
                    {persona.usuario.rol}
                  </Tag>
                </td>
                <td>
                  {renderEstado(persona.usuario.activo)}
                </td>
                <td>{persona.celular}</td>
                <td>{persona.numero_cedula}</td>
                <td>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {renderMinisterios(persona.ministerios)}
                  </div>
                </td>
                <td>
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onVerDetalle(persona.id_persona)}
                    >
                      Ver Detalles
                    </button>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => onEditar(persona)}
                    >
                      Editar
                    </button>
                    <button className="btn btn-danger btn-sm">
                      {persona.usuario.activo ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TablaMiembros;