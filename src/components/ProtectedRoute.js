import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { message } from 'antd';

const ProtectedRoute = ({ children, requireAdmin = false, requireAgent = false }) => {
    const { isAuthenticated, isAdmin, isAgent } = useSelector((state) => state.auth);

    if (!isAuthenticated) {
        message.warning('Please login to access this page');
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && !isAdmin) {
        message.error('Admin access required');
        return <Navigate to="/" replace />;
    }

    if (requireAgent && !isAgent && !isAdmin) {
        message.error('Management access required');
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
