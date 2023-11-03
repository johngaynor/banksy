import React, { createContext, useContext, useState, useCallback } from "react";

const GlobalContext = createContext();

const GlobalContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState([]);

  const addMsg = useCallback((type, msgContent) => {
    setMsg((prevArr) => [...prevArr, { type, msg: msgContent }]);
  });

  return (
    <GlobalContext.Provider value={{ user, setUser, msg, setMsg, addMsg }}>
      {children}
    </GlobalContext.Provider>
  );
};

const useGlobalState = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error(
      "useGlobalState must be used within a globalContextProvider"
    );
  }
  return context;
};

export { GlobalContextProvider, useGlobalState };
