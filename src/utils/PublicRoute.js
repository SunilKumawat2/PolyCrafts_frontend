import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
    const token = localStorage.getItem("polycarft_user_token");

    if (token) {
        // ✅ Already logged in → redirect to Home page
        // return <Navigate to="/raj-web/polycraft/" replace />;
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PublicRoute;
