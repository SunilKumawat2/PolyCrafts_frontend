import axios from "axios";
import { API_BASE_URL } from "../../config/Config";

// <----------------  video-templates Api's --------------->
export const Get_video_templates = async () => {
    const token = localStorage.getItem("polycarft_user_token");
    try {
      const response = await axios.get(`${API_BASE_URL}/video-templates`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      throw error.response || error;
    }
  };
  