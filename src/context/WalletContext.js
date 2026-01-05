import { createContext, useContext, useState, useEffect } from "react";
import { User_Get_Profile } from "../api/profile/Profile";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletBalance, setWalletBalance] = useState(0);

  // Initial fetch balance on app load
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await User_Get_Profile();
        localStorage.setItem("user_id",res?.data?.user?.id)
        setWalletBalance(res?.data?.user || 0);
      } catch (err) {
        console.error("Error fetching wallet balance:", err);
      }
    };
    fetchBalance();
  }, []);

  return (
    <WalletContext.Provider value={{ walletBalance, setWalletBalance }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
