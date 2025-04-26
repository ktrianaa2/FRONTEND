import React, { useState, useEffect } from "react";
import { Table, Button, Select, DatePicker, Space, notification, Dropdown, Menu } from "antd";
import { FilePdfOutlined, DownloadOutlined, MoreOutlined } from '@ant-design/icons';
import API_URL from "../../../../Config";
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

const HistorialDevocionales = ({ onClose }) => {
    const [devocionales, setDevocionales] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [filters, setFilters] = useState({
        mes: null,
        año: null,
        fechaInicio: null,
        fechaFin: null
    });
    const [api, contextHolder] = notification.useNotification();
    const token = localStorage.getItem('authToken');

    // Función para manejar la descarga PDF
    const handleDownloadPdf = (record) => {
        console.log("Se está descargando el PDF para:", record.id_devocional);
        // Aquí iría la lógica real para generar/descargar el PDF
        notification.info({
            message: 'Descarga en progreso',
            description: `Preparando PDF para el devocional de ${record.mes} ${record.año}`,
            placement: 'topRight'
        });
    };

    // Menú de opciones para cada fila
    const menu = (record) => (
        <Menu>
            <Menu.Item
                key="download-pdf"
                icon={<FilePdfOutlined />}
                onClick={() => handleDownloadPdf(record)}
            >
                Descargar PDF
            </Menu.Item>
            <Menu.Item
                key="view-details"
                icon={<DownloadOutlined />}
                onClick={() => console.log("Ver detalles:", record.id_devocional)}
            >
                Exportar Datos
            </Menu.Item>
        </Menu>
    );

    const columns = [
        {
            title: 'Mes',
            dataIndex: 'mes',
            key: 'mes',
            render: (text) => text.charAt(0).toUpperCase() + text.slice(1),
            sorter: (a, b) => meses.findIndex(m => m.value === a.mes) - meses.findIndex(m => m.value === b.mes)
        },
        {
            title: 'Año',
            dataIndex: 'año',
            key: 'año',
            sorter: (a, b) => a.año - b.año
        },
        {
            title: 'Título',
            dataIndex: 'titulo',
            key: 'titulo',
            render: (text) => (
                <div dangerouslySetInnerHTML={{ __html: text }} className="line-clamp-1" />
            )
        },
        {
            title: 'Fecha Creación',
            dataIndex: 'fecha_creacion',
            key: 'fecha_creacion',
            render: (date) => moment(date).format('DD/MM/YYYY HH:mm'),
            sorter: (a, b) => new Date(a.fecha_creacion) - new Date(b.fecha_creacion)
        },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (_, record) => (
                <Dropdown overlay={menu(record)} trigger={['click']}>
                    <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
            ),
            width: 100,
            align: 'center'
        }
    ];

    const meses = [
        { value: 'enero', label: 'Enero' },
        { value: 'febrero', label: 'Febrero' },
        { value: 'marzo', label: 'Marzo' },
        { value: 'abril', label: 'Abril' },
        { value: 'mayo', label: 'Mayo' },
        { value: 'junio', label: 'Junio' },
        { value: 'julio', label: 'Julio' },
        { value: 'agosto', label: 'Agosto' },
        { value: 'septiembre', label: 'Septiembre' },
        { value: 'octubre', label: 'Octubre' },
        { value: 'noviembre', label: 'Noviembre' },
        { value: 'diciembre', label: 'Diciembre' }
    ];

    const fetchDevocionales = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');

            let url = `${API_URL}/Devocionales/historial/?page=${pagination.current}&page_size=${pagination.pageSize}`;

            // Agregar filtros
            if (filters.mes) url += `&mes=${filters.mes}`;
            if (filters.año) url += `&año=${filters.año}`;
            if (filters.fechaInicio) url += `&fecha_inicio=${filters.fechaInicio}`;
            if (filters.fechaFin) url += `&fecha_fin=${filters.fechaFin}`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    // Token inválido o expirado
                    localStorage.removeItem('authToken');
                    window.location.href = '/login';
                    return;
                }
                throw new Error('Error al cargar el historial');
            }

            const data = await response.json();
            setDevocionales(data.results);
            setPagination({
                ...pagination,
                total: data.count
            });
        } catch (error) {
            notification.error({
                message: 'Error',
                description: error.message,
                placement: 'topRight'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDevocionales();
    }, [pagination.current, filters]);

    const handleTableChange = (pagination, filters, sorter) => {
        setPagination(pagination);
    };

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
        setPagination(prev => ({
            ...prev,
            current: 1
        }));
    };

    const clearFilters = () => {
        setFilters({
            mes: null,
            año: null,
            fechaInicio: null,
            fechaFin: null
        });
    };

    return (
        <div>
            {contextHolder}

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Historial de Devocionales</h2>
                <Space>
                    <Button
                        type="primary"
                        icon={<FilePdfOutlined />}
                        onClick={() => {
                            console.log("Descargando todos los devocionales como PDF");
                            notification.info({
                                message: 'Preparando PDF',
                                description: 'Generando documento con todos los devocionales',
                                placement: 'topRight'
                            });
                        }}
                    >
                        Exportar Todo
                    </Button>
                    <Button onClick={onClose}>Cerrar</Button>
                </Space>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Select
                    placeholder="Filtrar por mes"
                    allowClear
                    value={filters.mes}
                    onChange={(value) => handleFilterChange('mes', value)}
                    className="w-full"
                >
                    {meses.map(mes => (
                        <Option key={mes.value} value={mes.value}>{mes.label}</Option>
                    ))}
                </Select>

                <Select
                    placeholder="Filtrar por año"
                    allowClear
                    value={filters.año}
                    onChange={(value) => handleFilterChange('año', value)}
                    className="w-full"
                >
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(año => (
                        <Option key={año} value={año}>{año}</Option>
                    ))}
                </Select>

                <RangePicker
                    className="w-full"
                    onChange={(dates) => {
                        handleFilterChange('fechaInicio', dates?.[0]?.format('YYYY-MM-DD'));
                        handleFilterChange('fechaFin', dates?.[1]?.format('YYYY-MM-DD'));
                    }}
                />

                <Space>
                    <Button onClick={clearFilters}>Limpiar</Button>
                    <Button onClick={onClose}>Cerrar</Button>
                </Space>
            </div>

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