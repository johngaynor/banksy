import React, { createContext, useContext, useState } from "react";

const ProcessorContext = createContext();

const ProcessorContextProvider = ({ children }) => {
  const [formStep, setFormStep] = useState(0);
  const [rawFile, setRawFile] = useState(null);
  const [userBanks, setUserBanks] = useState(null);
  const [userCategories, setUserCategories] = useState(null);
  const [summaryViews, setSummaryViews] = useState(null);
  const [data, setData] = useState(null);

  // loading states
  const [banksLoading, setBanksLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [summaryViewsLoading, setSummaryViewsLoading] = useState(false);

  return (
    <ProcessorContext.Provider
      value={{
        rawFile,
        setRawFile,
        data,
        setData,
        formStep,
        setFormStep,
        userBanks,
        setUserBanks,
        banksLoading,
        setBanksLoading,
        userCategories,
        setUserCategories,
        categoriesLoading,
        setCategoriesLoading,
        summaryViews,
        setSummaryViews,
        summaryViewsLoading,
        setSummaryViewsLoading,
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
