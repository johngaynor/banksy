import React, { createContext, useContext, useState } from "react";

const SettingsContext = createContext();

const SettingsContextProvider = ({ children }) => {
  const [updateProfileLoading, setUpdateProfileLoading] = useState(false);
  return (
    <SettingsContext.Provider
      value={{
        updateProfileLoading,
        setUpdateProfileLoading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

const useSettingsState = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error(
      "useSettingsState must be used within a settingsContextProvider"
    );
  }
  return context;
};

export { SettingsContextProvider, useSettingsState };
