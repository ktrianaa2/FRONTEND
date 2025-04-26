import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Select,
  Input,
  Space,
  notification,
  Tooltip
} from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import API_URL from "../../../../Config";
import moment from "moment";

const { Option } = Select;

const HistorialDevocionales = ({ onClose }) => {
  const [devocionales, setDevocionales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({ mes: null, año: "" });
  const [api, contextHolder] = notification.useNotification();
  const token = localStorage.getItem("authToken");

  const fetchDevocionales = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/Devocionales/historial/?page=${pagination.current}&page_size=${pagination.pageSize}`;
      if (filters.mes) url += `&mes=${filters.mes}`;
      if (filters.año) url += `&año=${filters.año}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("authToken");
          window.location.href = "/login";
          return;
        }
        throw new Error("Error al cargar el historial");
      }
      const data = await res.json();
      setDevocionales(data.results);
      setPagination((p) => ({ ...p, total: data.count }));
    } catch (err) {
      api.error({ message: "Error", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevocionales();
  }, [pagination.current, filters]);

  const handleTableChange = (pag) => {
    setPagination(pag);
  };

  const handleFilterChange = (name, value) => {
    setFilters((f) => ({ ...f, [name]: value }));
    setPagination((p) => ({ ...p, current: 1 }));
  };

  const clearFilters = () => {
    setFilters({ mes: null, año: "" });
  };

  const meses = [
    { value: "enero", label: "Enero" },
    { value: "febrero", label: "Febrero" },
    { value: "marzo", label: "Marzo" },
    { value: "abril", label: "Abril" },
    { value: "mayo", label: "Mayo" },
    { value: "junio", label: "Junio" },
    { value: "julio", label: "Julio" },
    { value: "agosto", label: "Agosto" },
    { value: "septiembre", label: "Septiembre" },
    { value: "octubre", label: "Octubre" },
    { value: "noviembre", label: "Noviembre" },
    { value: "diciembre", label: "Diciembre" },
  ];

  const columns = [
    {
      title: "Mes",
      dataIndex: "mes",
      key: "mes",
      render: (t) => t.charAt(0).toUpperCase() + t.slice(1),
    },
    {
      title: "Año",
      dataIndex: "año",
      key: "año",
    },
    {
      title: "Título",
      dataIndex: "titulo",
      key: "titulo",
      render: (text) => (
        <div
          dangerouslySetInnerHTML={{ __html: text }}
          className="line-clamp-1"
        />
      ),
    },
    {
      title: "Fecha Creación",
      dataIndex: "fecha_creacion",
      key: "fecha_creacion",
      render: (d) => moment(d).format("DD/MM/YYYY HH:mm"),
      sorter: (a, b) => new Date(a.fecha_creacion) - new Date(b.fecha_creacion),
    },
    {
      title: "Acciones",
      key: "acciones",
      align: "center",
      width: 100,
      render: (_, record) => (
        <Tooltip title="Exportar PDF">
          <FilePdfOutlined
            style={{ fontSize: 18, cursor: "pointer" }}
            onClick={() =>
              window.open(
                `${API_URL}/Devocionales/devocionales_pdf/${record.id_devocional}/`,
                "_blank"
              )
            }
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Historial de Devocionales</h2>
        <Button onClick={onClose}>Cerrar</Button>
      </div>

      {/* Filtros */}
      <Space className="mb-6">
        <Select
          placeholder="Filtrar por mes"
          allowClear
          value={filters.mes}
          onChange={(v) => handleFilterChange("mes", v)}
          style={{ minWidth: 150 }}
        >
          {meses.map((m) => (
            <Option key={m.value} value={m.value}>
              {m.label}
            </Option>
          ))}
        </Select>

        <Input
          placeholder="Año"
          value={filters.año}
          onChange={(e) => handleFilterChange("año", e.target.value)}
          style={{ width: 80 }}
        />

        <Button onClick={clearFilters}>Limpiar</Button>
      </Space>

      <Table
        columns={columns}
        dataSource={devocionales}
        rowKey="id_devocional"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default HistorialDevocionales;
