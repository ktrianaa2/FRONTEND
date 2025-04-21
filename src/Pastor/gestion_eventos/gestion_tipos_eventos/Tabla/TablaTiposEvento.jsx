import React from "react";
import { Table, Space, Switch, Button, Tag } from "antd";

const TablaTiposEvento = ({ data, loading, onEdit, onCambiarEstado }) => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id_tipo_evento',
      key: 'id',
      width: 80,
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
    },
    {
      title: 'Estado',
      dataIndex: 'activo',
      key: 'estado',
      render: (activo, record) => (
        <Tag color={activo ? 'green' : 'red'}>
          {activo ? 'Activo' : 'Inactivo'}
        </Tag>
      ),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Space size="middle">
          <Switch
            checked={record.activo}
            onChange={() => onCambiarEstado(record.id_tipo_evento)}
          />
          <Button
            type="link"
            onClick={() => onEdit(record)}
          >
            Editar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id_tipo_evento"
      loading={loading}
      pagination={{ pageSize: 10 }}
      bordered
    />
  );
};

export default TablaTiposEvento;