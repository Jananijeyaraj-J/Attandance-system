import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token'); // Check token
  return isAuthenticated ? children : <Navigate to="/" />; // Redirect if not logged in
};

export default PrivateRoute;