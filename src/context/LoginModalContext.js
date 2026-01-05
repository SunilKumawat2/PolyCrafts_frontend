import React, { createContext, useState, useContext } from "react";

const LoginModalContext = createContext();

export const useLoginModal = () => useContext(LoginModalContext);

export const LoginModalProvider = ({ children }) => {
  const [Loginshow, setLoginShow] = useState(false);
  console.log("f,dnbdfg", Loginshow);

  return (
    <LoginModalContext.Provider value={{ Loginshow, setLoginShow }}>
      {children}
    </LoginModalContext.Provider>
  );
};
