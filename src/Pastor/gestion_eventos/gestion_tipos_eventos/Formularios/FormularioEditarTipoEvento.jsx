import React, { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import API_URL from "../../../../../Config";
const FormularioEditarTipoEvento = ({ tipoEvento, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tipoEvento) {
      form.setFieldsValue({
        nombre: tipoEvento.nombre,
        descripcion: tipoEvento.descripcion,
      });
    }
  }, [tipoEvento, form]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/Eventos/tipos_evento/editar/${tipoEvento.id_tipo_evento}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar');
      }

      message.success('Tipo de evento actualizado');
      onSuccess();
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4">
      <h4>Editar Tipo de Evento</h4>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="nombre"
          label="Nombre"
          rules={[{ required: true, message: 'Este campo es obligatorio' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="descripcion"
          label="Descripción"
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <div className="d-flex justify-content-end gap-2">
          <Button onClick={onClose}>
            Cancelar
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Actualizar
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default FormularioEditarTipoEvento;