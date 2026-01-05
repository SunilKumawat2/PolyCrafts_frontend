import axios from "axios";
import { API_BASE_URL } from "../../config/Config";


// <----------------  User add the product name  API --------------->
export const User_Add_Product_Name = async (userData, cart_item_id) => {
    try {
        const token = localStorage.getItem("polycarft_user_token");

        const response = await axios.post(
            `${API_BASE_URL}/user/cart-items/${cart_item_id}/user-products/store`,
            userData, // { name: "Product 1" }
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

export const User_Show_Product_Name_List = async ({ }, cart_item_id) => {
    try {
        const token = localStorage.getItem("polycarft_user_token");

        const response = await axios.get(
            `${API_BASE_URL}/user/cart-items/${cart_item_id}/user-products`,
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

export const Upload_3D_file = async (cart_item_id, product_id, formData) => {
    try {
        const token = localStorage.getItem("polycarft_user_token");

        const response = await axios.post(
            `${API_BASE_URL}/user/cart-items/${cart_item_id}/user-products/${product_id}/update`,
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

export const Delete_Modal_file = async (cart_item_id, product_id, formData) => {
    try {
        const token = localStorage.getItem("polycarft_user_token");

        const response = await axios.post(
            `${API_BASE_URL}/user/cart-items/${cart_item_id}/user-products/${product_id}/delete-file`,
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

export const Delete_Product = async (cart_item_id, product_id, formData) => {
    try {
        const token = localStorage.getItem("polycarft_user_token");

        const response = await axios.post(
            `${API_BASE_URL}/user/cart-items/${cart_item_id}/user-products/${product_id}/destroy`,
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

export const upload_product_images = async (cart_item_id, product_id, formData) => {
    try {
        const token = localStorage.getItem("polycarft_user_token");

        const response = await axios.post(
            `${API_BASE_URL}/user/cart-items/${cart_item_id}/user-products/${product_id}/update`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            }
        );

        return response;
    } catch (error) {
        throw error.response || error;
    }
};


export const upload_product_Label = async (cart_item_id, product_id, formData) => {
    try {
        const token = localStorage.getItem("polycarft_user_token");

        const response = await axios.post(
            `${API_BASE_URL}/user/cart-items/${cart_item_id}/user-products/${product_id}/labels/store`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            }
        );

        return response;
    } catch (error) {
        throw error.response || error;
    }
};

export const upload_product_Delete_Label = async (cart_item_id, product_id, label_id, formData) => {
    try {
        const token = localStorage.getItem("polycarft_user_token");

        const response = await axios.post(
            `${API_BASE_URL}/user/cart-items/${cart_item_id}/user-products/${product_id}/labels/${label_id}/destroy`,
            formData, // send _method=DELETE in body
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


export const Show_Uploaded_products_images = async (cart_item_id, product_id) => {
    try {
        const token = localStorage.getItem("polycarft_user_token");

        const response = await axios.get(
            `${API_BASE_URL}/user/cart-items/${cart_item_id}/user-products/${product_id}/show`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json" // GET doesn’t need multipart
                }
            }
        );

        return response;
    } catch (error) {
        throw error.response || error;
    }
};

export const Show_Uploaded_products_Label = async (cart_item_id, product_id) => {
    try {
        const token = localStorage.getItem("polycarft_user_token");

        const response = await axios.get(
            `${API_BASE_URL}/user/cart-items/${cart_item_id}/user-products/${product_id}/labels`,
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

export const Show_User_Order_Label = async (order_id) => {
    try {
        const token = localStorage.getItem("polycarft_user_token");

        const response = await axios.get(
            `${API_BASE_URL}/user/orders/${order_id}/labels`,
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

export const Update_User_Order_Label_Status = async (order_id, label_id, formData) => {
    try {
        const token = localStorage.getItem("polycarft_user_token");

        const response = await axios.post(
            `${API_BASE_URL}/user/orders/${order_id}/labels/${label_id}`,
            formData, // ✅ sending FormData object
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data", // ✅ must use this for FormData
                },
            }
        );

        return response;
    } catch (error) {
        console.error("API Error:", error.response || error);
        throw error.response || error;
    }
};


export const Show_User_Order_Label_Details = async (order_id, label_id) => {
    try {
        const token = localStorage.getItem("polycarft_user_token");

        const response = await axios.get(
            `${API_BASE_URL}/user/orders/${order_id}/labels/${label_id}`,
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


export const User_Purchase_Product = async () => {
    try {
        const token = localStorage.getItem("polycarft_user_token");

        const response = await axios.post(
            `${API_BASE_URL}/user/orders/store`, {},
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


export const User_Payment_order = async (formData) => {
    try {
        const token = localStorage.getItem("polycarft_user_token");

        const response = await axios.post(
            `${API_BASE_URL}/user/payment/purchase`, formData,
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


export const User_subscribe = async (formData) => {
    try {
        const token = localStorage.getItem("polycarft_user_token");

        const response = await axios.post(
            `${API_BASE_URL}/user/subscribe`, formData,
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

export const Current_User_subscribe = async () => {
    try {
        const token = localStorage.getItem("polycarft_user_token");

        const response = await axios.get(
            `${API_BASE_URL}/user/current-subscription`,
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

export const User_wallet_transactions = async (page = 1, per_page = 30) => {
    try {
        const token = localStorage.getItem("polycarft_user_token");

        const response = await axios.get(
            `${API_BASE_URL}/user/wallet/transactions?page=${page}&per_page=${per_page}`,
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


export const User_Orders_List = async () => {
    try {
        const token = localStorage.getItem("polycarft_user_token");

        const response = await axios.get(
            `${API_BASE_URL}/user/orders`,
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

export const User_Orders_Details = async (id) => {
    try {
        const token = localStorage.getItem("polycarft_user_token");

        const response = await axios.get(
            `${API_BASE_URL}/user/orders/${id}/show`,
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

// <------- User Orders Details ---------------->
export const User_Orders_Update = async (id, formData) => {
    try {
        const token = localStorage.getItem("polycarft_user_token");
        const response = await axios.post(
            `${API_BASE_URL}/user/orders/${id}`,
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


// <------- User Orders Details ---------------->
export const User_Orders_Revision_Requests = async (order_id, label_id, formData) => {
    try {
        const token = localStorage.getItem("polycarft_user_token");
        const response = await axios.post(
            `${API_BASE_URL}/user/orders/${order_id}/labels/${label_id}/revison-requests/store`,
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

// <------- User Orders Details ---------------->
export const User_Show_Orders_Revision_Requests = async (order_id, label_id) => {
    try {
        const token = localStorage.getItem("polycarft_user_token");
        const response = await axios.get(
            `${API_BASE_URL}/user/orders/${order_id}/labels/${label_id}/revison-requests`,
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


// <------- User Orders Send Message ---------------->
export const User_Orders_Send_Message = async (id, formData) => {
    try {
        const token = localStorage.getItem("polycarft_user_token");
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
export const User_Orders_Get_Message = async (id) => {
    try {
        const token = localStorage.getItem("polycarft_user_token");
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

// <------- User Related Details ---------------->
export const Get_User_Related_Details = async (id) => {
    try {
        const token = localStorage.getItem("polycarft_user_token");
        const response = await axios.get(
            `${API_BASE_URL}/related-video-templates/${id}`,
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

// <------- User Related Details ---------------->
export const get_subscription_plans = async (interval) => {
    try {
        const token = localStorage.getItem("polycarft_user_token");

        const response = await axios.get(
            `${API_BASE_URL}/subscription-plans?interval=${interval}`,
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

// <------- User Orders Send Message ---------------->
export const User_Cancel_Subscription_Plan = async (formData) => {
    try {
        const token = localStorage.getItem("polycarft_user_token");
        const response = await axios.post(
            `${API_BASE_URL}/user/subscription/cancel`,
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


// <------- User Orders Send Message ---------------->
export const User_Upgrdae_Subscription_Plan = async (formData) => {
    try {
        const token = localStorage.getItem("polycarft_user_token");
        const response = await axios.post(
            `${API_BASE_URL}/user/subscription/upgrade`,
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

// <------- User Orders Send Message ---------------->
export const User_checkout_single_payment = async (formData) => {
    try {
        const token = localStorage.getItem("polycarft_user_token");
        const response = await axios.post(
            `${API_BASE_URL}/user/payment/checkout/one-time`,
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

// <------- Fetch Stripe Session Details ---------------->
export const User_checkout_session_details = async (session_id) => {
    try {
        const token = localStorage.getItem("polycarft_user_token");

        const response = await axios.get(
            `${API_BASE_URL}/user/payment/checkout/session/details?session_id=${session_id}`,
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



// <------- User Orders Send Message ---------------->
export const User_Subscription_CheckOut = async (formData) => {
    try {
        const token = localStorage.getItem("polycarft_user_token");
        const response = await axios.post(
            `${API_BASE_URL}/user/subscription/checkout`,
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



// <------- User Orders Send Message ---------------->
export const User_Payment_Transctions = async () => {
    try {
        const token = localStorage.getItem("polycarft_user_token");
        const response = await axios.get(
            `${API_BASE_URL}/user/stripe/user/payments`,
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


