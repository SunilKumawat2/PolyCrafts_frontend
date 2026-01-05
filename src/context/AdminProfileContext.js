import { createContext, useContext, useState, useEffect } from "react";
import { Get_Admin_Profile } from "../api/admin/Admin";

const AdminProfileContext = createContext();

export const AdminProfileProvider = ({ children }) => {
  const [AdminProfile, setAdminProfile] = useState(0);

  // Initial fetch balance on app load
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const res = await Get_Admin_Profile();
        localStorage.setItem("admin_id",res?.data?.user?.id)
        setAdminProfile(res?.data?.user);
      } catch (err) {
        console.error("Error fetching wallet balance:", err);
      }
    };
    fetchAdminProfile();
  }, []);

  return (
    <AdminProfileContext.Provider value={{ AdminProfile, setAdminProfile }}>
      {children}
    </AdminProfileContext.Provider>
  );
};

export const useAdminProfile = () => useContext(AdminProfileContext);
