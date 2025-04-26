import React, { useRef, useState, useEffect } from "react";
import { notification } from 'antd';
import '../../../Styles/CalendarioMes.css';
import API_URL from "../../../../Config";

const CalendarioMes = ({ currentDate }) => {
    const [api, contextHolder] = notification.useNotification();
    const month = currentDate.toLocaleString("es-ES", { month: "long" });
    const year = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const today = new Date();
    const token = localStorage.getItem('authToken');

    // Estados para el editor
    const [editData, setEditData] = useState({});
    const [activeEditor, setActiveEditor] = useState(null);
    const [activeFormats, setActiveFormats] = useState({
        bold: false,
        italic: false,
        underline: false
    });

    // Estados para las secciones adicionales
    const [titulo, setTitulo] = useState("");
    const [texto, setTexto] = useState("");
    const [reflexion, setReflexion] = useState("");
    const [loading, setLoading] = useState(false);

    const editorRef = useRef(null);
    const tituloRef = useRef(null);
    const textoRef = useRef(null);
    const reflexionRef = useRef(null);

    // Generación de días del calendario
    const firstDayOfMonth = new Date(year, currentMonth, 1);
    const lastDayOfMonth = new Date(year, currentMonth + 1, 0);
    const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const daysFromPrevMonth = firstDayOfMonth.getDay();
    const lastDayPrevMonth = new Date(year, currentMonth, 0).getDate();

    const daysArray = [];

    // Días mes anterior
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
        daysArray.push({
            day: lastDayPrevMonth - i,
            isCurrentMonth: false,
            date: new Date(year, currentMonth - 1, lastDayPrevMonth - i)
        });
    }

    // Días mes actual
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        daysArray.push({
            day: i,
            isCurrentMonth: true,
            date: new Date(year, currentMonth, i)
        });
    }

    // Días mes siguiente
    const daysFromNextMonth = 6 - lastDayOfMonth.getDay();
    for (let i = 1; i <= daysFromNextMonth; i++) {
        daysArray.push({
            day: i,
            isCurrentMonth: false,
            date: new Date(year, currentMonth + 1, i)
        });
    }

    const isToday = (someDate) => {
        return (
            someDate.getDate() === today.getDate() &&
            someDate.getMonth() === today.getMonth() &&
            someDate.getFullYear() === today.getFullYear()
        );
    };

    const handleTextChange = (date, html) => {
        setEditData(prev => ({
            ...prev,
            [date.toISOString()]: html
        }));
    };

    const toggleFormat = (format) => {
        document.execCommand(format, false, null);
        updateActiveFormats();
    };

    const updateActiveFormats = () => {
        setActiveFormats({
            bold: document.queryCommandState('bold'),
            italic: document.queryCommandState('italic'),
            underline: document.queryCommandState('underline')
        });
    };

    const handleCellClick = (date) => {
        setActiveEditor(date.toISOString());
    };

    const handleSaveAll = async () => {
        setLoading(true);

        console.log("Datos a enviar - editData:", editData); // <-- Agrega esto

        const dataToSave = {
            mes: month.toLowerCase(),
            año: year,
            titulo: titulo,
            texto_biblico: texto,
            reflexion: reflexion,
            oracion: "",
            contenido_calendario: editData
        };
        try {
            const response = await fetch(`${API_URL}/Devocionales/crear_devocionales/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dataToSave)
            });

            const result = await response.json();

            if (response.ok) {
                api.success({
                    message: 'Guardado exitoso',
                    description: 'El devocional se ha guardado correctamente.',
                    placement: 'topRight',
                    duration: 3
                });
            } else {
                throw new Error(result.error || 'Error al guardar');
            }
        } catch (error) {
            api.error({
                message: 'Error al guardar',
                description: error.message,
                placement: 'topRight',
                duration: 5
            });
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleSelectionChange = () => {
            updateActiveFormats();
        };

        document.addEventListener('selectionchange', handleSelectionChange);
        return () => {
            document.removeEventListener('selectionchange', handleSelectionChange);
        };
    }, []);

    return (
        <div className="container mt-4">
            {contextHolder}

            <h2 className="text-center mb-4 text-capitalize">{`${month} ${year}`}</h2>

            <table className="table table-bordered" style={{ tableLayout: 'fixed' }}>
                <thead>
                    <tr>
                        {daysOfWeek.map((day, index) => (
                            <th key={index} className="text-center p-2 fw-bold" style={{
                                width: '14.28%', backgroundColor: '#000000', color: '#ffffff'
                            }}>
                                {day}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {[...Array(Math.ceil(daysArray.length / 7))].map((_, weekIndex) => (
                        <tr key={weekIndex}>
                            {daysArray.slice(weekIndex * 7, (weekIndex + 1) * 7).map((dayObj, dayIndex) => {
                                const dateKey = dayObj.date.toISOString();
                                const isEditing = activeEditor === dateKey;

                                return (
                                    <td
                                        key={dayIndex}
                                        className={`p-1 ${dayObj.isCurrentMonth ? '' : 'bg-light text-muted'} ${isToday(dayObj.date) ? 'table-primary' : ''}`}
                                        style={{ height: '100px', verticalAlign: 'top', overflow: 'hidden' }}
                                        onClick={() => !isEditing && handleCellClick(dayObj.date)}
                                    >
                                        <div className="d-flex justify-content-between align-items-start">
                                            <span className={`fw-bold ${!dayObj.isCurrentMonth ? 'text-muted' : ''}`}>
                                                {dayObj.day}
                                            </span>
                                            {isToday(dayObj.date) && (
                                                <span className="badge bg-danger rounded-pill">Hoy</span>
                                            )}
                                        </div>

                                        {isEditing ? (
                                            <div className="mt-2">
                                                <div className="btn-group mb-2">
                                                    <button
                                                        type="button"
                                                        className={`btn btn-sm btn-outline-secondary ${activeFormats.bold ? 'btn-dark' : ''}`}
                                                        onClick={() => toggleFormat('bold')}
                                                    >
                                                        <strong>B</strong>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={`btn btn-sm btn-outline-secondary ${activeFormats.italic ? 'btn-dark' : ''}`}
                                                        onClick={() => toggleFormat('italic')}
                                                    >
                                                        <em>I</em>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={`btn btn-sm btn-outline-secondary ${activeFormats.underline ? 'btn-dark' : ''}`}
                                                        onClick={() => toggleFormat('underline')}
                                                    >
                                                        <u>U</u>
                                                    </button>
                                                </div>

                                                <div
                                                    ref={editorRef}
                                                    className="form-control calendario-editor"
                                                    contentEditable
                                                    onInput={(e) => handleTextChange(dayObj.date, e.target.innerHTML)}
                                                    style={{ minHeight: '50px', overflow: 'auto' }}
                                                />

                                                <button
                                                    className="btn btn-sm btn-success mt-2"
                                                    onClick={() => setActiveEditor(null)}
                                                >
                                                    Listo
                                                </button>
                                            </div>
                                        ) : (
                                            <div
                                                className="mt-2 p-1 calendario-contenido"
                                                dangerouslySetInnerHTML={{ __html: editData[dateKey] || '' }}
                                                style={{ minHeight: '50px', overflow: 'hidden' }}
                                            />
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-5">
                <h3>Título del Mes</h3>
                <div className="btn-group mb-2">
                    <button
                        type="button"
                        className={`btn btn-sm btn-outline-secondary ${activeFormats.bold ? 'btn-dark' : ''}`}
                        onClick={() => toggleFormat('bold')}
                    >
                        <strong>B</strong>
                    </button>
                    <button
                        type="button"
                        className={`btn btn-sm btn-outline-secondary ${activeFormats.italic ? 'btn-dark' : ''}`}
                        onClick={() => toggleFormat('italic')}
                    >
                        <em>I</em>
                    </button>
                    <button
                        type="button"
                        className={`btn btn-sm btn-outline-secondary ${activeFormats.underline ? 'btn-dark' : ''}`}
                        onClick={() => toggleFormat('underline')}
                    >
                        <u>U</u>
                    </button>
                </div>
                <div
                    ref={tituloRef}
                    className="form-control mb-3"
                    contentEditable
                    onInput={(e) => setTitulo(e.target.innerHTML)}
                    style={{ minHeight: '50px' }}
                />

                <h3>Texto Principal</h3>
                <div className="btn-group mb-2">
                    <button
                        type="button"
                        className={`btn btn-sm btn-outline-secondary ${activeFormats.bold ? 'btn-dark' : ''}`}
                        onClick={() => toggleFormat('bold')}
                    >
                        <strong>B</strong>
                    </button>
                    <button
                        type="button"
                        className={`btn btn-sm btn-outline-secondary ${activeFormats.italic ? 'btn-dark' : ''}`}
                        onClick={() => toggleFormat('italic')}
                    >
                        <em>I</em>
                    </button>
                    <button
                        type="button"
                        className={`btn btn-sm btn-outline-secondary ${activeFormats.underline ? 'btn-dark' : ''}`}
                        onClick={() => toggleFormat('underline')}
                    >
                        <u>U</u>
                    </button>
                </div>
                <div
                    ref={textoRef}
                    className="form-control mb-3"
                    contentEditable
                    onInput={(e) => setTexto(e.target.innerHTML)}
                    style={{ minHeight: '100px' }}
                />

                <h3>Reflexión Final</h3>
                <div className="btn-group mb-2">
                    <button
                        type="button"
                        className={`btn btn-sm btn-outline-secondary ${activeFormats.bold ? 'btn-dark' : ''}`}
                        onClick={() => toggleFormat('bold')}
                    >
                        <strong>B</strong>
                    </button>
                    <button
                        type="button"
                        className={`btn btn-sm btn-outline-secondary ${activeFormats.italic ? 'btn-dark' : ''}`}
                        onClick={() => toggleFormat('italic')}
                    >
                        <em>I</em>
                    </button>
                    <button
                        type="button"
                        className={`btn btn-sm btn-outline-secondary ${activeFormats.underline ? 'btn-dark' : ''}`}
                        onClick={() => toggleFormat('underline')}
                    >
                        <u>U</u>
                    </button>
                </div>
                <div
                    ref={reflexionRef}
                    className="form-control mb-3"
                    contentEditable
                    onInput={(e) => setReflexion(e.target.innerHTML)}
                    style={{ minHeight: '100px' }}
                />
            </div>

            <div className="text-center mt-4">
                <button
                    className="btn btn-primary btn-lg"
                    onClick={handleSaveAll}
                    disabled={loading}
                >
                    {loading ? 'Guardando...' : 'Guardar Todo'}
                </button>
            </div>
        </div>
    );
};

export default CalendarioMes;