import React from "react";
import Home_before_login from '../components/pages/home/Home_before_login';
import Home from '../components/pages/home/Home';

const HomeRoute = () => {
    const token = localStorage.getItem("polycarft_user_token");
    return token ? <Home /> : <Home_before_login />;
};

export default HomeRoute;
