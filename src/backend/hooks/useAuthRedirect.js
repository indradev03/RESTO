// hooks/useAuthRedirect.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuthRedirect = (expectedRole = 'user') => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (!token || role !== expectedRole) {
        navigate('/auth/login');
        }
    }, [navigate, expectedRole]);
};

export default useAuthRedirect;
