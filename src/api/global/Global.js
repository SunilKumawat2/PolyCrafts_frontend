import axios from "axios";
import { API_BASE_URL } from "../../config/Config";

// <----------------  Register Api's --------------->
export const User_Contact_Requests = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/contact-requests`, userData);
        return response;
    } catch (error) {
        throw error.response || error;
    }
};

// <----------------  Register Api's --------------->
export const User_Consultation_Booking = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/consultation-booking`, userData);
        return response;
    } catch (error) {
        throw error.response || error;
    }
};

// <----------------  Register Api's --------------->
export const Get_FAQ_List = async (userData) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/faqs`, userData);
        return response;
    } catch (error) {
        throw error.response || error;
    }
};

// <----------------  video-templates Api's --------------->
export const Get_video_templates = async (userData) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/video-templates`, userData);
        return response;
    } catch (error) {
        throw error.response || error;
    }
};

// <----------------  video-templates Api's --------------->
export const Get_video_templates_details = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/video-template-detail/${id}`);
        return response;
    } catch (error) {
        throw error.response || error;
    }
};

// <----------------  video-templates Api's --------------->
export const Get_seo_content_details = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/video-template-detail/${id}`);
        return response;
    } catch (error) {
        throw error.response || error;
    }
};

// <----------------  video-templates Api's --------------->
export const Get_Global_seo_content = async (pageKey) => {
  try {
    const url = `${API_BASE_URL}/seo-content/:pageKey`.replace(":pageKey", pageKey);
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error.response || error;
  }
};


// <----------------  video-templates Api's --------------->
export const Get_Global_About_us_content = async (key) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/admin/content-get/${key}`);
        return response;
    } catch (error) {
        throw error.response || error;
    }
};

  
// <----------------  video-templates Api's --------------->
export const Get_Global_Page_content = async (pageKey) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/page-content/${pageKey}`);
        return response;
    } catch (error) {
        throw error.response || error;
    }
};

// <----------------  video-templates Api's --------------->
export const Get_Global_Subscription_Plan = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/subscription-plans?interval=month`);
        return response;
    } catch (error) {
        throw error.response || error;
    }
};

  