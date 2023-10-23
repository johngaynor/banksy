import React, { createContext, useContext, useState, useCallback } from "react";

const ProcessorContext = createContext();

const ProcessorContextProvider = ({ children }) => {
  const [file, setFile] = useState(null);
  const [userBanks, setUserBanks] = useState(null);
  const [banksLoading, setBanksLoading] = useState(false);
  const [userCategories, setUserCategories] = useState(null);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  return (
    <ProcessorContext.Provider
      value={{
        file,
        setFile,
        userBanks,
        setUserBanks,
        banksLoading,
        setBanksLoading,
        userCategories,
        setUserCategories,
        categoriesLoading,
        setCategoriesLoading,
      }}
    >
      {children}
    </ProcessorContext.Provider>
  );
};

const useProcessorState = () => {
  const context = useContext(ProcessorContext);
  if (context === undefined) {
    throw new Error(
      "useProcessorState must be used within a processorContextProvider"
    );
  }
  return context;
};

export { ProcessorContextProvider, useProcessorState };
