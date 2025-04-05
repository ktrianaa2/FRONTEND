import React, { useEffect, useState } from "react";
import API_URL from "../../../Config";
import { notification } from "antd";

function DetalleMiembro({ idMiembro, onClose }) {
    const [miembro, setMiembro] = useState(null);
    const [loading, setLoading] = useState(true);
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        const fetchMiembro = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("authToken");
                if (!token) {
                    throw new Error("No hay sesión activa");
                }

                const response = await fetch(`${API_URL}/Miembros/personas/`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Error al obtener los datos");
                }

                const data = await response.json();
                const miembroEncontrado = data.personas.find(p => p.id_persona === idMiembro);

                if (!miembroEncontrado) {
                    throw new Error("Miembro no encontrado");
                }

                setMiembro(miembroEncontrado);

            } catch (error) {
                api.error({
                    message: "Error",
                    description: error.message,
                    duration: 4
                });
            } finally {
                setLoading(false);
            }
        };

        if (idMiembro) {
            fetchMiembro();
        }
    }, [idMiembro]);

    if (loading) return <div className="text-center my-4">Cargando datos del miembro...</div>;

    if (!miembro) return <div className="text-danger">No se encontró al miembro.</div>;

    return (
        <div className="card shadow p-4">
            {contextHolder}
            <h4>Detalle del Miembro</h4>
            <hr />
            <p><strong>Nombre:</strong> {miembro.nombres} {miembro.apellidos}</p>
            <p><strong>Ministerios:</strong> ________ </p>
            <p><strong>Ultima Pastoral:</strong> ________ </p>
            <p><strong>Cédula:</strong> {miembro.numero_cedula}</p>
            <p><strong>Celular:</strong> {miembro.celular}</p>
            <p><strong>Fecha de Nacimiento:</strong> {miembro.fecha_nacimiento}</p>
            <p><strong>Dirección:</strong> {miembro.direccion}</p>
            <p><strong>Email:</strong> {miembro.correo_electronico}</p>
            <p><strong>Género:</strong> {miembro.genero}</p>
            <p><strong>Nivel de Estudio:</strong> {miembro.nivel_estudio}</p>
            <p><strong>Nacionalidad:</strong> {miembro.nacionalidad}</p>
            <p><strong>Profesión:</strong> {miembro.profesion}</p>
            <p><strong>Estado Civil:</strong> {miembro.estado_civil}</p>
            <p><strong>Lugar de Trabajo:</strong> {miembro.lugar_trabajo}</p>

            <button className="btn btn-secondary mt-3" onClick={onClose}>
                Volver
            </button>
        </div>
    );
}

export default DetalleMiembro;
