import axios from "axios";
import { API_BASE_URL } from "../../config/Config";

// <----------------  Get Profile API --------------->
export const User_Get_Profile = async () => {
  try {
    const token = localStorage.getItem("polycarft_user_token");

    const response = await axios.get(`${API_BASE_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    throw error.response || error;
  }
};

// <----------------  Update Profile API --------------->
export const User_Update_Profile = async (userData) => {
  try {
    const token = localStorage.getItem("polycarft_user_token");

    const response = await axios.post(
      `${API_BASE_URL}/user/profile`,
      userData, // { name, company, phone_number }
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

// <---------------- Change Password API --------------->
export const User_Change_Password = async (passwordData) => {
  try {
    const token = localStorage.getItem("polycarft_user_token");

    const response = await axios.post(
      `${API_BASE_URL}/user/profile/password`,
      passwordData, // { password, password_confirmation }
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





