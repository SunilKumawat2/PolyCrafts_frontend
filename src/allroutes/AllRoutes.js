import React from "react";
import { Route, Routes } from "react-router-dom";
import HomeRoute from "../../src/utils/HomeRoute";
import User_Profile from "../components/pages/user_profile/User_Profile";
import FAQ from "../components/pages/faq/FAQ";
import Choose_Video from "../components/pages/choose_video/Choose_Video";
import Upload_Products from "../components/pages/upload_products/Upload_Products";
import About from "../components/pages/about/About";
import Upload_3d_Modals from "../components/pages/upload_modals/Upload_3d_Modals";
import Upload_Modals from "../components/pages/upload_modals/Upload_Modals";
import Pricing from "../components/pages/pricing/Pricing";
import My_Orders from "../components/pages/my_orders/My_Orders";
import Change_Password from "../components/pages/change_password/Change_Password";
import Admin_Dashboard from "../components/pages/admin/admin_dashboard/Admin_Dashboard";
import ProtectedRoute from "../../src/utils/ProtectedRoute";
import PublicRoute from "../../src/utils/PublicRoute";
import Admin_Upload_Video from "../components/pages/admin/admin_upload_video/Admin_Upload_Video";
import Admin_Login from "../components/pages/admin/admin_login/Admin_Login";
import Admin_Show_Upload_Videos from "../components/pages/admin/admin_show_upload_video/Admin_Show_Upload_Videos";
import Admin_FAQ from "../components/pages/admin/admin_faq/Admin_FAQ";
import Admin_Contact_Request from "../components/pages/admin/admin_contact_request/Admin_Contact_Request";
import Admin_Seo_Contents from "../components/pages/admin/admin_seo_contents/Admin_Seo_Contents";
import Admin_Profile from "../components/pages/admin/admin_profile/Admin_Profile";
import Admin_Password_Change from "../components/pages/admin/admin_password_change/Admin_Password_Change";
import AdminRoute from "../utils/AdminRoutes";
import Admin_Subscription_Plans from "../components/pages/admin/admin_subscriptions_plans/Admin_Subscription_Plans";
import Admin_User_List from "../components/pages/admin/admin_user_list/Admin_User_List";
import Admin_Home_Videos_Sections from "../components/pages/admin/admin_home_video_sections/Admin_Home_Videos_Sections";
import PayNowButton from "../payment_gateway/PayNowButton";
import Admin_Orders from "../components/pages/admin/admin_orders/Admin_Orders";
import Admin_Consultation_Bookings from "../components/pages/admin/admin_contact_request/Admin_Consultation_Bookings";
import Terms_Conditions from "../components/pages/terms_conditions/Terms_Conditions";
import Privacy_Policy from "../components/pages/privacy_policy/Privacy_Policy";
import My_Order_Details from "../components/pages/my_orders/My_Order_Details";
import Admin_Order_Details from "../components/pages/admin/admin_orders/Admin_Order_Details";
import Pricing_Details from "../components/pages/pricing/Pricing_Details";
import Current_Subscrption from "../components/pages/pricing/Current_Subscrption";
import PaymentSuccess from "../payment_gateway/PaymentSuccess";
import PaymentCancel from "../payment_gateway/PaymentCancel";
import Pricing_PaymentCancel from "../components/pages/pricing/Pricing_PaymentCancel";
import Payment_Transctions from "../payment_gateway/Payment_Transctions";
import Admin_About_Us_Page from "../components/pages/admin/admin_about_us_page/Admin_About_Us_Page";
import Admin_Global_Page_Contents from "../components/pages/admin/admin_global_page_content/Admin_Global_Page_Contents";
import Admin_Subscription_Features from "../components/pages/admin/admin_subscription_features/Admin_Subscription_Features";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />

      <Route path="about" element={<About />} />
       <Route path="terms-conditions" element={<Terms_Conditions />} />
         <Route path="privacy-policy" element={<Privacy_Policy />} />
      <Route path="pricing" element={
        // <PublicRoute>
        <Pricing />
      // </PublicRoute>
    } />
      <Route path="faq" element={<FAQ />} />

      <Route path="user-profile" element={<ProtectedRoute><User_Profile /></ProtectedRoute>} />
      <Route path="choose-video/:id" element={<ProtectedRoute><Choose_Video /></ProtectedRoute>} />
      <Route path="upload-products" element={<ProtectedRoute><Upload_Products /></ProtectedRoute>} />
      <Route path="upload-3d-modal" element={<ProtectedRoute><Upload_3d_Modals /></ProtectedRoute>} />
      <Route path="upload-modal" element={<ProtectedRoute><Upload_Modals /></ProtectedRoute>} />
      <Route path="my-orders" element={<ProtectedRoute><My_Orders /></ProtectedRoute>} />
      <Route path="my-orders-details/:id" element={<ProtectedRoute><My_Order_Details /></ProtectedRoute>} />
      <Route path="change-password" element={<ProtectedRoute><Change_Password /></ProtectedRoute>} />
      <Route path="admin-dashboard" element={<ProtectedRoute><Admin_Dashboard /></ProtectedRoute>} />
      <Route path="purchase" element={<ProtectedRoute><PayNowButton /></ProtectedRoute>} />
      <Route path="pricing-details/:id" element={<ProtectedRoute><Pricing_Details />
      </ProtectedRoute>} />
      <Route path="current-subscrption" element={<ProtectedRoute><Current_Subscrption />
        </ProtectedRoute>} />
        <Route path="payment-success" element={<ProtectedRoute><PaymentSuccess />
        </ProtectedRoute>} />
        <Route path="payment-cancel" element={<ProtectedRoute><PaymentCancel />
          </ProtectedRoute>} />
          <Route path="pricing-payment-cancel" element={<ProtectedRoute><Pricing_PaymentCancel />
            </ProtectedRoute>} />
            <Route path="payment-transctions" element={<ProtectedRoute><Payment_Transctions />
              </ProtectedRoute>} />
      <Route path="admin-uplaod-video" element={<AdminRoute><Admin_Upload_Video /></AdminRoute>} />
      <Route path="admin-show-upload-video" element={<AdminRoute><Admin_Show_Upload_Videos /></AdminRoute>} />
      <Route path="admin-faq" element={<AdminRoute><Admin_FAQ /></AdminRoute>} />
      <Route path="admin-contact-request" element={<AdminRoute><Admin_Contact_Request /></AdminRoute>} />
      <Route path="admin-seo-contents" element={<AdminRoute><Admin_Seo_Contents /></AdminRoute>} />
      <Route path="admin-profile" element={<AdminRoute><Admin_Profile /></AdminRoute>} />
      <Route path="admin-password-change" element={<AdminRoute><Admin_Password_Change /></AdminRoute>} />
      <Route path="admin-subscription-plans" element={<AdminRoute><Admin_Subscription_Plans /></AdminRoute>} />
      <Route path="admin-user-list" element={<AdminRoute><Admin_User_List /></AdminRoute>} />
      <Route path="admin-home-video-sections" element={<AdminRoute><Admin_Home_Videos_Sections /></AdminRoute>} />
      <Route path="admin-orders" element={<AdminRoute><Admin_Orders /></AdminRoute>} />
      <Route path="Admin-order-details/:id" element={<AdminRoute><Admin_Order_Details /></AdminRoute>} />
      <Route path="admin-consultation-booking" element={<AdminRoute><Admin_Consultation_Bookings /></AdminRoute>} />
      <Route path="admin-about-us-page" element={<AdminRoute><Admin_About_Us_Page /></AdminRoute>} />
      <Route path="admin-global-page-content" element={<AdminRoute>
        <Admin_Global_Page_Contents /></AdminRoute>} />
        <Route path="admin-subscription-features" element={<AdminRoute>
          <Admin_Subscription_Features /></AdminRoute>} />
      <Route path="admin-login" element={<Admin_Login />} />
    </Routes>
  );
};

export default AllRoutes;
