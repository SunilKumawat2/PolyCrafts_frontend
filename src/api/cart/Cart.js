import axios from "axios";
import { API_BASE_URL } from "../../config/Config";

// <----------------  Update Profile API --------------->
export const User_add_to_cart = async (userData) => {
    try {
        const token = localStorage.getItem("polycarft_user_token");

        const response = await axios.post(
            `${API_BASE_URL}/user/cart-items/store`,
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

// <----------------  Get Profile API --------------->
export const User_Get_Cart_list = async () => {
    try {
        const token = localStorage.getItem("polycarft_user_token");

        const response = await axios.get(`${API_BASE_URL}/user/cart-items`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response;
    } catch (error) {
        throw error.response || error;
    }
};

// <----------------  Get Profile API --------------->
export const User_Delete_Cart_Item = async (id) => {
    try {
      const token = localStorage.getItem("polycarft_user_token");
  
      const response = await axios.post(
        `${API_BASE_URL}/user/cart-items/destroy/${id}`, // id in params
        { _method: "DELETE" }, // body
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      return response;
    } catch (error) {
      throw error.response || error;
    }
  };