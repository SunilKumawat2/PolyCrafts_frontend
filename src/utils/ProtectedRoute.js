// import React from "react";
// import { Navigate, useLocation } from "react-router-dom";

// const ProtectedRoute = ({ children }) => {
//     const token = localStorage.getItem("polycarft_user_token");
//     const location = useLocation();

//     if (!token) {
//         // ❌ Not logged in => redirect to home_before_login but remember where they came from
//         return <Navigate to="/raj-web/polycraft/" replace state={{ from: location }} />;
//     }

//     return children;
// };

// export default ProtectedRoute;


import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("polycarft_user_token");
    const location = useLocation();

    // Allow Stripe redirect pages WITHOUT auth
    const openRoutes = [
        "/payment-success",
        "/payment-cancel"
    ];

    // Stripe adds query params, so we check "startsWith"
    const currentPath = location.pathname;

    if (openRoutes.some((path) => currentPath.startsWith(path))) {
        return children; // bypass protection
    }

    // User not logged in => redirect
    if (!token) {
        // return <Navigate to="/raj-web/polycraft/" replace state={{ from: location }} />;
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    return children;
};

export default ProtectedRoute;
