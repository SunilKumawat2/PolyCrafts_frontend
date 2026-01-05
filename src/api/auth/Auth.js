import axios from "axios";
import { API_BASE_URL } from "../../config/Config";

// <----------------  Register Api's --------------->
export const User_Register = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/user/register`, userData);
        return response;
    } catch (error) {
        throw error.response || error;
    }
};

// <----------------  User LOgin Api's --------------->
export const User_Login = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/user/login`, userData);
        return response;
    } catch (error) {
        throw error.response || error;
    }
};

// <----------------  User LOgin Api's --------------->
export const User_Google_Login = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/user/auth/google`, userData);
        return response;
    } catch (error) {
        throw error.response || error;
    }
};


// <----------------  OTP verify Api's --------------->
export const User_Otp_verify = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/user/verify-email`, userData);
        return response;
    } catch (error) {
        throw error.response || error;
    }
};

// <----------------  OTP verify Api's --------------->
export const User_send_Otp_verify = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/user/send-verify-email-code`, userData);
        return response;
    } catch (error) {
        throw error.response || error;
    }
};


// <----------------  OTP verify Api's --------------->
export const User_reset_password = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/user/reset-password`, userData);
        return response;
    } catch (error) {
        throw error.response || error;
    }
};


// <----------------  OTP verify Api's --------------->
export const User_send_Otp_forgot_password = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/user/send-forgot-password-code`, userData);
        return response;
    } catch (error) {
        throw error.response || error;
    }
};


// <---------------- Logout API --------------->
export const User_Logout = async () => {
    try {
        const token = localStorage.getItem("polycarft_user_token");

        const response = await axios.post(`${API_BASE_URL}/user/logout`, {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response;
    } catch (error) {
        throw error.response || error;
    }
};

