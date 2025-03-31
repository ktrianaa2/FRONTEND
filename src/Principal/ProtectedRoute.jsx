import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
    const location = useLocation();
    const userData = JSON.parse(localStorage.getItem('userData'));
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        const handlePopState = () => {
            if (!token || !userData || userData.rol !== requiredRole) {
                window.history.pushState(null, '', '/');
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [token, userData, requiredRole]);


    return children;
};

export default ProtectedRoute;