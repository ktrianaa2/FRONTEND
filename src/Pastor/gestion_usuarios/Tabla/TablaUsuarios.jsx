import React from "react";
import { notification, Tag, Badge } from "antd";
import "../../../Styles/Tabla.css"

function TablaUsuarios({ usuarios, filteredUsuarios, onRefreshData, onVerDetalle, onEditar }) {
  const [api, contextHolder] = notification.useNotification();
  console.log(filteredUsuarios.map(u => ({ id: u.id_persona, cedula: u.numero_cedula })));


  // En tu componente, antes del return:
  const hasDuplicateIds = new Set(filteredUsuarios.map(u => u.id_persona)).size !== filteredUsuarios.length;
  if (hasDuplicateIds) {
    console.error("¡Hay IDs duplicados en los usuarios!", filteredUsuarios);
  }


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
      {filteredUsuarios.length > 0 ? (
        <div className="table-responsive">
          <table className="tabla-principal">
            <thead>
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
              {filteredUsuarios.map((usuario) => (
                <tr key={usuario.id_persona}>
                  <td>{usuario.id_persona}</td>
                  <td>{usuario.nombres}</td>
                  <td>{usuario.apellidos}</td>
                  <td>
                    <Tag color={usuario.usuario.rol === 'Pastor' ? 'purple' : 'blue'}>
                      {usuario.usuario.rol}
                    </Tag>
                  </td>
                  <td>
                    {renderEstado(usuario.usuario.activo)}
                  </td>
                  <td>{usuario.celular}</td>
                  <td>{usuario.numero_cedula}</td>
                  <td>
                    <div className="ministerios-container">
                      {renderMinisterios(usuario.ministerios)}
                    </div>
                  </td>
                  <td>
                    <div className="btn-acciones">
                      <button
                        className="btn-ver"
                        onClick={() => onVerDetalle(usuario.id_persona)}
                      >
                        Ver Detalles
                      </button>
                      <button
                        className="btn-editar"
                        onClick={() => onEditar(usuario)}
                      >
                        Editar
                      </button>
                      <button className="btn-deshabilitar">
                        {usuario.usuario.activo ? 'Desactivar' : 'Activar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={`sin-contenido-mensaje ${usuarios.length === 0 ? '' : 'filtros'}`}>
          {usuarios.length === 0
            ? "No hay usuarios registrados todavía."
            : "No hay usuarios que coincidan con los filtros aplicados."}
        </div>
      )}
    </div>
  );
}

export default TablaUsuarios;