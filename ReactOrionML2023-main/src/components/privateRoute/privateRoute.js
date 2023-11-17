import React from 'react'
import { Route, Navigate} from 'react-router-dom';
import AuthService from '../../services/auth.service';


const PrivateRoute = ({ children }) => {
    const isAuthenticated = new AuthService().isLoggedIn;
    return (
        isAuthenticated ? children : <Navigate to="/login" />
    );
  };

export default PrivateRoute;
