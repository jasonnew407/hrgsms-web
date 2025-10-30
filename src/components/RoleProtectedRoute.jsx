import React from 'react';
import { Navigate } from 'react-router-dom';

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role?.toLowerCase();

  // Check authentication
  if (!isAuthenticated) {
    return <Navigate to="/management-portal-login" replace />;
  }

  // Check role authorization
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleProtectedRoute;
