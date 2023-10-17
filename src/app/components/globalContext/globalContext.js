import React, { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

const GlobalContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  return (
    <GlobalContext.Provider value={{ user, setUser, error, setError }}>
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
