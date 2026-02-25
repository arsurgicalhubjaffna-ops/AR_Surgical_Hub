import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

const AdminRoute = ({ children }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        navigate('/login');
        return null;
    }

    if (user.role !== 'admin') {
        navigate('/');
        return null;
    }

    return children;
};

export default AdminRoute;
