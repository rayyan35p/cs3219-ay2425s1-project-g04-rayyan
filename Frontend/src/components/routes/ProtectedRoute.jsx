import React from 'react';
import {Navigate} from 'react-router-dom';

// Authenticate user only if they log in once, token is available until they close the tab/browser for now
const isAuthenticated = () => {
    const token = sessionStorage.getItem('jwt_token'); // Get token stored in session storage
    if (!token) {
        return false;
    }

    return true;
};

const ProtectedRoute = ({children}) => {
    return isAuthenticated() ? children : <Navigate to='/login'/>;
};

export default ProtectedRoute;