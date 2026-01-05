
import axios from "axios";
import { API_BASE_URL } from "../../config/Config";


// <----------------  User LOgin Api's ---------------->
export const Admin_Login_post = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/admin/login`, userData);
        return response;
    } catch (error) {
        throw error.response || error;
    }
};


// <----------------  Update Profile API --------------->
export const Admin_Upload_Video_teampletas = async (userData) => {
    try {
        const admin_token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.post(
            `${API_BASE_URL}/admin/video-templates`,
            userData, // { name, company, phone_number }
            {
                headers: {
                    Authorization: `Bearer ${admin_token}`,
                },
            }
        );

        return response;
    } catch (error) {
        throw error.response || error;
    }
};

export const Admin_show_Upload_Video_teampletas = async (page = 1, per_page = 30) => {
    const admin_token = localStorage.getItem("ploycartfts_admin_token");
    const response = await axios.get(
        `${API_BASE_URL}/admin/video-templates?page=${page}&per_page=${per_page}`,
        {
            headers: { Authorization: `Bearer ${admin_token}` },
        }
    );
    return response.data;
};



// <----------------  Admin show Upload Video teampletas API --------------->
export const Admin_Video_Templates_Changeable_Elements_List = async () => {
    try {
        const admin_token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.get(`${API_BASE_URL}/admin/video-templates/changeable-elements-list`, {
            headers: {
                Authorization: `Bearer ${admin_token}`,
            },
        });

        return response;
    } catch (error) {
        throw error.response || error;
    }
};


// <----------------  Admin show FAQ API --------------->
export const Admin_show_Details_Upload_Video_teampletas = async (id) => {
    try {
        const admin_token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.get(`${API_BASE_URL}/admin/video-templates/${id}`, {
            headers: {
                Authorization: `Bearer ${admin_token}`,
            },
        });

        return response;
    } catch (error) {
        throw error.response || error;
    }
};

// <----------------  Update FAQ API --------------->
export const Admin_Update_Video_teampletas = async (id, userData) => {
    try {
        const admin_token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.put(   // ✅ use PUT
            `${API_BASE_URL}/admin/video-templates/${id}`,
            userData,
            {
                headers: {
                    Authorization: `Bearer ${admin_token}`,
                },
            }
        );

        return response;
    } catch (error) {
        throw error.response || error;
    }
};


// <----------------  Admin show Upload Video teampletas API --------------->
export const Admin_Delete_Upload_Video_teampletas = async (id) => {
    try {
        const admin_token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.delete(`${API_BASE_URL}/admin/video-templates/${id}`, {
            headers: {
                Authorization: `Bearer ${admin_token}`,
            },
        });

        return response;
    } catch (error) {
        throw error.response || error;
    }
};

// <----------------  Admin show FAQ API with pagination --------------->
export const Admin_show_FAQ = async (page = 1) => {
    try {
        const admin_token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.get(`${API_BASE_URL}/admin/faqs`, {
            headers: {
                Authorization: `Bearer ${admin_token}`,
            },
            params: { page }, // ✅ pass page number
        });

        return response;
    } catch (error) {
        throw error.response || error;
    }
};


// <----------------  Update Profile API --------------->
export const Admin_Upload_FAQ = async (userData) => {
    try {
        const admin_token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.post(
            `${API_BASE_URL}/admin/faqs`,
            userData, // { name, company, phone_number }
            {
                headers: {
                    Authorization: `Bearer ${admin_token}`,
                },
            }
        );

        return response;
    } catch (error) {
        throw error.response || error;
    }
};

// <----------------  Update Profile API --------------->
export const Admin_Deleted_FAQ = async (id) => {
    try {
        const admin_token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.delete(
            `${API_BASE_URL}/admin/faqs/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${admin_token}`,
                },
            }
        );

        return response;
    } catch (error) {
        throw error.response || error;
    }
};

// <----------------  Update FAQ API --------------->
export const Admin_Updated_FAQ = async (id, userData) => {
    try {
        const admin_token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.put(   // ✅ use PUT
            `${API_BASE_URL}/admin/faqs/${id}`,
            userData,
            {
                headers: {
                    Authorization: `Bearer ${admin_token}`,
                },
            }
        );

        return response;
    } catch (error) {
        throw error.response || error;
    }
};

// <----------------  Admin show Contact API with pagination --------------->
export const Admin_show_Contact = async (page = 1) => {
    try {
        const admin_token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.get(`${API_BASE_URL}/admin/contact-requests`, {
            headers: {
                Authorization: `Bearer ${admin_token}`,
            },
            params: { page }, // ✅ pass page param
        });

        return response.data;
    } catch (error) {
        throw error.response || error;
    }
};


// <----------------  Update Profile API --------------->
export const Admin_Deleted_Contact = async (id) => {
    try {
        const admin_token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.delete(
            `${API_BASE_URL}/admin/contact-requests/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${admin_token}`,
                },
            }
        );

        return response;
    } catch (error) {
        throw error.response || error;
    }
};

// <----------------  Update FAQ API --------------->
export const Admin_Updated_Contact = async (id, userData) => {
    try {
        const admin_token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.put(   // ✅ use PUT
            `${API_BASE_URL}/admin/contact-requests/${id}`,
            userData,
            {
                headers: {
                    Authorization: `Bearer ${admin_token}`,
                },
            }
        );

        return response;
    } catch (error) {
        throw error.response || error;
    }
};

// <---------------- Admin show SEO Contents API --------------->
export const Admin_seo_contents = async (page = 1, per_page = 30) => {
    try {
        const admin_token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.get(`${API_BASE_URL}/admin/seo-contents?page=${page}&per_page=${per_page}`, {
            headers: {
                Authorization: `Bearer ${admin_token}`,
            },
        });

        return response;
    } catch (error) {
        throw error.response || error;
    }
};


// <----------------  Admin show FAQ API --------------->
export const Admin_seo_contents_details = async (id) => {
    try {
        const admin_token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.get(`${API_BASE_URL}/admin/seo-contents/${id}`, {
            headers: {
                Authorization: `Bearer ${admin_token}`,
            },
        });

        return response;
    } catch (error) {
        throw error.response || error;
    }
};

// ✅ Correct update API
export const Admin_seo_contents_update_details = async (id, data) => {
    try {
        const admin_token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.put(
            `${API_BASE_URL}/admin/seo-contents/${id}`, // id in the URL
            data, // data goes in the body/payload
            {
                headers: {
                    Authorization: `Bearer ${admin_token}`,
                },
            }
        );

        return response;
    } catch (error) {
        throw error.response || error;
    }
};

// <----------------  Get Profile API --------------->
export const Get_Admin_Profile = async () => {
    try {
        const token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.get(`${API_BASE_URL}/admin/profile`, {
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
export const Admin_Update_Profile = async (userData) => {
    try {
        const token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.post(
            `${API_BASE_URL}/admin/profile`,
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

// <----------------  Update Profile API --------------->
export const Admin_Update_Password = async (userData) => {
    try {
        const token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.post(
            `${API_BASE_URL}/admin/profile/password`,
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

// <---------------- Logout API --------------->
export const Admin_Logout = async () => {
    try {
        const token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.post(`${API_BASE_URL}/admin/logout`, {},
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

// <---------------- Admin show Subscription Plans API --------------->
export const Admin_show_subscription_plans = async (interval = "month", page = 1, per_page = 30) => {
    try {
        const admin_token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.get(
            `${API_BASE_URL}/admin/subscription-plans?interval=${interval}&page=${page}&per_page=${per_page}`,
            {
                headers: {
                    Authorization: `Bearer ${admin_token}`,
                },
            }
        );

        return response;
    } catch (error) {
        throw error.response || error;
    }
};


// <---------------- Admin Update Subscription Plan API --------------->
export const Admin_Update_subscription_plans = async (id, formData) => {
    try {
        const admin_token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.post(
            `${API_BASE_URL}/admin/subscription-plans/${id}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${admin_token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response;
    } catch (error) {
        throw error.response || error;
    }
};


// <---------------- Admin Update Subscription Plan API --------------->
export const Get_Admin_User_list = async (page = 1, per_page = 30) => {
    try {
        const token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.get(
            `${API_BASE_URL}/admin/users?page=${page}&per_page=${per_page}`,
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

// <---------------- Admin Update Subscription Plan API --------------->
export const Admin_User_Block_Status = async (user_id) => {
    try {
        const token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.post(
            `${API_BASE_URL}/admin/users/${user_id}/update-block-status`,
            {}, // body empty
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

// <---------------- Admin Update Subscription Plan API --------------->
export const Get_Admin_User_Details = async (id) => {
    try {
        const token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.get(
            `${API_BASE_URL}/admin/users/${id}`,
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

// <---------------- Admin Add Credits API --------------->
export const Admin_Add_Credits = async (id, formdata) => {
    try {
        const token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.post(
            `${API_BASE_URL}/admin/users/${id}/add-credits`,
            formdata,
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


// <---------------- Admin Add Credits API --------------->
export const Admin_Deduct_Credits = async (id, formdata) => {
    try {
        const token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.post(
            `${API_BASE_URL}/admin/users/${id}/deduct-credits`,
            formdata,
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

export const Admin_Home_Video_Sections = async (page = 1, per_page = 30) => {
    try {
        const token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.get(
            `${API_BASE_URL}/admin/home-video-sections?page=${page}&per_page=${per_page}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response;
    } catch (error) {
        console.error("API Error:", error.response || error); // 👈 log properly
        throw error.response || error;
    }
};


export const Admin_Home_Video_Details_Sections = async (id) => {
    try {
        const token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.get(
            `${API_BASE_URL}/admin/home-video-sections/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response;
    } catch (error) {
        console.error("API Error:", error.response || error); // 👈 log properly
        throw error.response || error;
    }
};

// <---------------- Admin Home Video Details Sections API ---------------->
export const Admin_Home_Video_Store_Sections = async (formData) => {
    try {
        const token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.post(
            `${API_BASE_URL}/admin/home-video-sections`,
            formData, // 👈 send FormData directly
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response;
    } catch (error) {
        console.error("API Error:", error.response || error);
        throw error.response || error;
    }
};


// <---------------- Admin Home Video Details Sections API ---------------->
export const Admin_Home_Video_Update_Sections = async (id, formData) => {
    try {
        const token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.post(
            `${API_BASE_URL}/admin/home-video-sections/${id}`,
            formData, // 👈 send FormData directly
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response;
    } catch (error) {
        console.error("API Error:", error.response || error);
        throw error.response || error;
    }
};

// Admin Home Video Delete Sections API
export const Admin_Home_Video_Delete_Sections = async (id) => {
    try {
        const token = localStorage.getItem("ploycartfts_admin_token");

        const formData = new FormData();
        formData.append("_method", "DELETE"); // Laravel method spoofing

        const response = await axios.post(
            `${API_BASE_URL}/admin/home-video-sections/${id}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response;
    } catch (error) {
        console.error("API Error:", error.response || error);
        throw error.response || error;
    }
};

// <------------- admin side order list ------------>
export const Admin_Orders_List = async (page = 1, per_page = 30, timespan = "all") => {
    try {
      const token = localStorage.getItem("ploycartfts_admin_token");
  
      const response = await axios.get(
        `${API_BASE_URL}/admin/orders?page=${page}&per_page=${per_page}&timespan=${timespan}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      return response;
    } catch (error) {
      console.error("API Error:", error.response || error);
      throw error.response || error;
    }
  };
  

// <------------- admin side order Details ------------>
export const Admin_Orders_Details = async (id) => {
    try {
        const token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.get(
            `${API_BASE_URL}/admin/orders/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response;
    } catch (error) {
        console.error("API Error:", error.response || error); // 👈 log properly
        throw error.response || error;
    }
};


// <------------- admin side order Details ------------>
export const Admin_Orders_Updates = async (id, formData) => {
    try {
        const token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.post(
            `${API_BASE_URL}/admin/orders/${id}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data", // important!
                },
            }
        );

        return response;
    } catch (error) {
        console.error("API Error:", error.response || error);
        throw error.response || error;
    }
};

// <------------- admin side order Details ------------>
export const Admin_Orders_Upload_demo_videos = async (user_product_label_id, formData) => {
    try {
        const token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.post(
            `${API_BASE_URL}/admin/user-product-labels/${user_product_label_id}/upload-demo-video`,
            formData, // send formData directly
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data", // important!
                },
            }
        );

        return response;
    } catch (error) {
        console.error("API Error:", error.response || error);
        throw error.response || error;
    }
};

// <------------- admin side final order Details ------------>
export const Admin_Orders_Upload_final_videos = async (user_product_label_id, formData) => {
    try {
        const token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.post(
            `${API_BASE_URL}/admin/user-product-labels/${user_product_label_id}/upload-final-video`,
            formData, // send formData directly
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data", // important!
                },
            }
        );

        return response;
    } catch (error) {
        console.error("API Error:", error.response || error);
        throw error.response || error;
    }
};

// <------------- admin side final order Details ------------>
export const Admin_Orders_Show_Label_List = async (order_id) => {
    try {
        const token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.get(
            `${API_BASE_URL}/admin/user-product-labels?order_id=${order_id}`, // send formData directly
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data", // important!
                },
            }
        );

        return response;
    } catch (error) {
        console.error("API Error:", error.response || error);
        throw error.response || error;
    }
};

// ✅ Corrected: Get Admin Label Details
export const Admin_Orders_Show_Label_Details = async (label_id) => {
    try {
        const token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.get(
            `${API_BASE_URL}/admin/user-product-labels/${label_id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response;
    } catch (error) {
        console.error("API Error:", error.response || error);
        throw error.response || error;
    }
};


// <------------- admin side final order Details ------------>
export const Admin_Orders_Label_Update_Status = async (user_product_label_id, formData) => {
    try {
        const token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.post(
            `${API_BASE_URL}/admin/user-product-labels/${user_product_label_id}/update-status`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data", // important!
                },
            }
        );

        return response;
    } catch (error) {
        console.error("API Error:", error.response || error);
        throw error.response || error;
    }
};

// <----------------  Admin Delete Orders API --------------->
export const Admin_Delete_Orders = async (id) => {
    try {
        const admin_token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.delete(`${API_BASE_URL}/admin/orders/${id}`, {
            headers: {
                Authorization: `Bearer ${admin_token}`,
            },
        });

        return response;
    } catch (error) {
        throw error.response || error;
    }
};

// <------------- admin side order Details ------------>
export const Admin_Revision_Requests = async (user_product_label_id) => {
    try {
        const token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.get(
            `${API_BASE_URL}/admin/revision-requests?user_product_label_id=${user_product_label_id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response;
    } catch (error) {
        console.error("API Error:", error.response || error); // 👈 log properly
        throw error.response || error;
    }
};


// <------------- admin side order Details ------------>
export const Admin_Revision_Requests_Details = async (id) => {
    try {
        const token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.get(
            `${API_BASE_URL}/admin/revision-requests/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response;
    } catch (error) {
        console.error("API Error:", error.response || error); // 👈 log properly
        throw error.response || error;
    }
};

// <------------- admin side order Details ------------>
export const Admin_Revision_Requests_Update = async (id, formData) => {
    try {
        const token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.post(
            `${API_BASE_URL}/admin/revision-requests/${id}`,
            formData, // send formData directly
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data", // important!
                },
            }
        );

        return response;
    } catch (error) {
        console.error("API Error:", error.response || error);
        throw error.response || error;
    }
};


export const Admin_Get_consultation_bookings = async (page = 1, per_page = 10) => {
    try {
        const token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.get(
            `${API_BASE_URL}/admin/consultation-bookings?page=${page}&per_page=${per_page}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response;
    } catch (error) {
        console.error("API Error:", error.response || error);
        throw error.response || error;
    }
};

// <------------- admin side order Details ------------>
export const Admin_Get_consultation_bookings_Details = async (id) => {
    try {
        const token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.get(
            `${API_BASE_URL}/admin/consultation-bookings/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response;
    } catch (error) {
        console.error("API Error:", error.response || error); // 👈 log properly
        throw error.response || error;
    }
};

// <----------------  Admin show Upload Video teampletas API --------------->
export const Admin_Delete_consultation_bookings = async (id) => {
    try {
        const admin_token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.delete(`${API_BASE_URL}/admin/consultation-bookings/${id}`, {
            headers: {
                Authorization: `Bearer ${admin_token}`,
            },
        });

        return response;
    } catch (error) {
        throw error.response || error;
    }
};

// <------------- admin side order Details ------------>
export const Admin_Update_consultation_bookings = async (id, formData) => {
    try {
        const token = localStorage.getItem("ploycartfts_admin_token");

        const response = await axios.post(
            `${API_BASE_URL}/admin/consultation-bookings/${id}`,
            formData, // send formData directly
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data", // important!
                },
            }
        );

        return response;
    } catch (error) {
        console.error("API Error:", error.response || error);
        throw error.response || error;
    }
};

// <------- User Orders Send Message ---------------->
export const Admin_Orders_Send_Message = async (id, formData) => {
    try {
        const token = localStorage.getItem("ploycartfts_admin_token");
        const response = await axios.post(
            `${API_BASE_URL}/user_product_labels/${id}/messages`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response;
    } catch (error) {
        throw error.response || error;
    }
};
// <------- User Orders Get Message ---------------->
export const Admin_Orders_Get_Message = async (id) => {
    try {
        const token = localStorage.getItem("ploycartfts_admin_token");
        const response = await axios.get(
            `${API_BASE_URL}/user_product_labels/${id}/messages`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response;
    } catch (error) {
        throw error.response || error;
    }
};

export const Admin_Add_About_Us_Content = async (formData) => {
    try {
      const token = localStorage.getItem("ploycartfts_admin_token");
  
      const response = await axios.post(
        `${API_BASE_URL}/admin/content-add`,
        formData,  // ✔ SEND RAW FORMDATA, NOT {formData}
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          },
        }
      );
  
      return response;
    } catch (error) {
      throw error.response || error;
    }
  };
  
  export const Admin_Update_Our_vision_About_Us_Content = async (formData,key) => {
    try {
      const token = localStorage.getItem("ploycartfts_admin_token");
  
      const response = await axios.post(
        `${API_BASE_URL}/admin/content-update/${key}`,
        formData,  // ✔ SEND RAW FORMDATA, NOT {formData}
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          },
        }
      );
  
      return response;
    } catch (error) {
      throw error.response || error;
    }
  };
  
  export const Admin_Update_Our_mission_About_Us_Content = async (formData,key) => {
    try {
      const token = localStorage.getItem("ploycartfts_admin_token");
  
      const response = await axios.post(
        `${API_BASE_URL}/admin/content-update/${key}`,
        formData,  // ✔ SEND RAW FORMDATA, NOT {formData}
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          },
        }
      );
  
      return response;
    } catch (error) {
      throw error.response || error;
    }
  };
  

  export const Admin_Get_Page_Content = async (page_key) => {
    try {
      const token = localStorage.getItem("ploycartfts_admin_token");
  
      const response = await axios.get(
        `${API_BASE_URL}/admin/page-contents?page_key=${page_key}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          },
        }
      );
  
      return response;
    } catch (error) {
      throw error.response || error;
    }
  };
  

  export const Admin_Get_Details_Page_Content = async (id) => {
    try {
      const token = localStorage.getItem("ploycartfts_admin_token");
  
      const response = await axios.get(
        `${API_BASE_URL}/admin/page-contents/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          },
        }
      );
  
      return response;
    } catch (error) {
      throw error.response || error;
    }
  };
  

  export const Admin_Get_Details_Update_Page_Content = async (formData,id) => {
    try {
      const token = localStorage.getItem("ploycartfts_admin_token");
  
      const response = await axios.post(
        `${API_BASE_URL}/admin/page-contents/${id}`,formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          },
        }
      );
  
      return response;
    } catch (error) {
      throw error.response || error;
    }
  };
  
  export const Admin_Get_Subscription_plan = async (interval) => {
    try {
      const token = localStorage.getItem("ploycartfts_admin_token");
  
      const response = await axios.get(
        `${API_BASE_URL}/admin/subscription-plan-features`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            interval: interval, // month or year
          },
        }
      );
  
      return response;
    } catch (error) {
      throw error.response || error;
    }
  };
  
  export const Admin_Post_Subscription_plan = async ({ id, interval, membership, creative }) => {
    try {
      const token = localStorage.getItem("ploycartfts_admin_token");
  
      const formData = new FormData();
      formData.append("_method", "PATCH"); // PATCH method
      formData.append("interval", interval);
  
      membership.forEach((m) => formData.append("membership[]", m));
      creative.forEach((c) => formData.append("creative[]", c));
  
      const response = await axios.post(
        `${API_BASE_URL}/admin/subscription-plan-features/${id}`,
        formData,
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
  
  export const Admin_Get_Details_Subscription_plan = async (plan_id) => {
    try {
      const token = localStorage.getItem("ploycartfts_admin_token");
  
      const response = await axios.get(
        `${API_BASE_URL}/admin/subscription-plan-features/${plan_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
  
      return response;
    } catch (error) {
      throw error.response || error;
    }
  };
  
  export const Admin_Update_Subscription_plan = async (formData,plan_id) => {
    try {
      const token = localStorage.getItem("ploycartfts_admin_token");
  
      const response = await axios.post(
        `${API_BASE_URL}/admin/subscription-plan-features/${plan_id}`,formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
  
      return response;
    } catch (error) {
      throw error.response || error;
    }
  };
  