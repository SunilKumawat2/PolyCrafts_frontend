import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const AdminRoute = ({ children }) => {
    const token = localStorage.getItem("ploycartfts_admin_token");
    const location = useLocation();

    if (!token) {
        // ❌ Not logged in => redirect to home_before_login but remember where they came from
        // return <Navigate to="/raj-web/polycraft/admin-login" 
        // replace state={{ from: location }} />;
        return <Navigate to="/admin-login" 
        replace state={{ from: location }} />;
    }

    return children;
};

export default AdminRoute;
