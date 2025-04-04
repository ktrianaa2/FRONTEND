import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../Config';

const Login = () => {

    // Agrega esto al inicio del componente Login
    useEffect(() => {
        // Limpiar historial al cargar el login
        if (window.history.state !== null) {
            window.history.replaceState(null, '', '/');
        }

        // Limpiar cualquier estado residual
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
    }, []);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Redirige si ya está autenticado
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const userData = JSON.parse(localStorage.getItem('userData'));

        if (token && userData) {
            if (userData.rol === 1) {
                navigate('/pastor', { replace: true });
            } else if (userData.rol === 2) {
                navigate('/lider', { replace: true });
            }
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('usuario', username);
            formData.append('contrasenia', password);

            const response = await fetch(`${API_URL}/Login/login/`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userData', JSON.stringify({
                    nombre_usuario: data.nombre_usuario,
                    id_usuario: data.id_usuario,
                    rol: data.rol,
                    nombres: data.nombres,       
                    apellidos: data.apellidos    
                }));

                // Redirigir según el rol
                if (data.rol === 1) {
                    navigate('/pastor');
                } else if (data.rol === 2) {
                    navigate('/lider');
                }
            } else {
                throw new Error(data.message || 'Error en la autenticación');
            }
        } catch (err) {
            setError(err.message || 'Error al conectar con el servidor');
        } finally {
            setIsLoading(false);
        }
    };

    
    return (
        <div className="container-fluid vh-100 bg-light">
            <div className="row h-100 justify-content-center align-items-center">
                <div className="col-12 col-md-8 col-lg-6 col-xl-4">
                    <div className="card shadow-lg bg-black text-white border-0">
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                <img src="/Logo.webp" alt="Logo" className="mb-3" style={{ maxWidth: '300px', height: 'auto' }} />
                                <h2 className="fw-bold text-white">Iniciar Sesión</h2>
                                <p className="text-secondary">Ingrese sus credenciales</p>
                            </div>

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label text-white">Usuario</label>
                                    <input
                                        type="text"
                                        className="form-control bg-dark text-white border-secondary"
                                        id="username"
                                        placeholder="Nombre de usuario"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="password" className="form-label text-white">Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control bg-dark text-white border-secondary"
                                        id="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-danger w-100 py-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Verificando...
                                        </>
                                    ) : "Iniciar sesión"}
                                </button>
                            </form>

                            <div className="text-center mt-3">
                                <a href="#!" className="text-danger text-decoration-none">
                                    ¿Olvidaste tu contraseña?
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;