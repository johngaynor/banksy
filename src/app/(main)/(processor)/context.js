import React, { createContext, useContext, useState } from "react";

const ProcessorContext = createContext();

const ProcessorContextProvider = ({ children }) => {
  const [rawFile, setRawFile] = useState(null);
  const [data, setData] = useState(null);
  const [addBankLoading, setAddBankLoading] = useState(false);
  const [submitSummaryLoading, setSubmitSummaryLoading] = useState(false);

  return (
    <ProcessorContext.Provider
      value={{
        rawFile,
        setRawFile,
        data,
        setData,
        addBankLoading,
        setAddBankLoading,
        submitSummaryLoading,
        setSubmitSummaryLoading,
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
