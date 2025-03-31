import React, { useState } from "react";
import MinisteriosTabla from "./tablas/MinisteriosTabla";
import AgregarMinisterio from "./AgregarMinisterio"; // Importa el componente de agregar ministerio
import EditarMinisterio from "./EditarMinisterio"; // Importa el componente para editar ministerio
import ModalDeshabilitar from "./modales/ModalDeshabilitar"; // Importa el modal de deshabilitar

const ministeriosData = [
    {
        logo: "/path-to-logo1.png",
        nombre: "Ministerio de Jóvenes",
        descripcion: "Ministerio para jóvenes de la iglesia",
        lideres: ["Juan Pérez", "María González"],
    },
    {
        logo: "/path-to-logo2.png",
        nombre: "Ministerio de Música",
        descripcion: "Ministerio de alabanza y música",
        lideres: ["Carlos Ramírez"],
    },
];

function AdministrarMinisterios() {
    const [search, setSearch] = useState("");
    const [isAgregarOpen, setIsAgregarOpen] = useState(false); // Controlar si se abre el formulario de agregar
    const [isEditarOpen, setIsEditarOpen] = useState(false); // Controlar si se abre el formulario de editar
    const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);
    const [selectedMinisterio, setSelectedMinisterio] = useState(null);

    const filteredMinisterios = ministeriosData.filter((ministerio) =>
        ministerio.nombre.toLowerCase().includes(search.toLowerCase())
    );

    const handleEdit = (ministerio) => {
        setSelectedMinisterio(ministerio); // Establece el ministerio que se va a editar
        setIsEditarOpen(true); // Abre el formulario de editar
    };

    const handleDisable = (ministerio) => {
        setSelectedMinisterio(ministerio); // Establece el ministerio a deshabilitar
        setIsDisableModalOpen(true); // Abre el modal de deshabilitar
    };

    const confirmDisable = (ministerio) => {
        console.log("Ministerio deshabilitado:", ministerio);
    };

    const handleAgregarClose = () => {
        setIsAgregarOpen(false); // Cierra el formulario de agregar
    };

    const handleEditarClose = () => {
        setIsEditarOpen(false); // Cierra el formulario de editar
    };

    return (
        <div>
            <h2 className="text-black">
                Administración de Ministerios
            </h2>
            <hr />

            {!isAgregarOpen && !isEditarOpen && (
                <div>
                    <div className="d-flex justify-content-between mb-4">
                        <input
                            type="text"
                            placeholder="Buscar ministerio"
                            className="form-control w-50 shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button
                            className="btn btn-success text-white shadow-sm"
                            onClick={() => setIsAgregarOpen(true)} // Abre el formulario de agregar
                        >
                            Agregar Ministerio
                        </button>
                    </div>

                    {/* Tabla de ministerios */}
                    <MinisteriosTabla
                        filteredMinisterios={filteredMinisterios}
                        handleEdit={handleEdit}
                        handleDisable={handleDisable}
                    />
                </div>
            )}

            {/* Formulario de agregar ministerio */}
            {isAgregarOpen && <AgregarMinisterio onClose={handleAgregarClose} />}

            {/* Formulario de editar ministerio */}
            {isEditarOpen && (
                <EditarMinisterio
                    ministerio={selectedMinisterio}
                    onClose={handleEditarClose} // Asegúrate de pasar la función para cerrar el formulario
                />
            )}

            {/* Modal de deshabilitar */}
            {isDisableModalOpen && (
                <ModalDeshabilitar
                    ministerio={selectedMinisterio}
                    onClose={() => setIsDisableModalOpen(false)}
                    onConfirm={confirmDisable}
                />
            )}
        </div>
    );
}

export default AdministrarMinisterios;
