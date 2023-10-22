import React, { createContext, useContext, useState, useCallback } from "react";

const ProcessorContext = createContext();

const ProcessorContextProvider = ({ children }) => {
  const [file, setFile] = useState(null);

  return (
    <ProcessorContext.Provider value={{ file, setFile }}>
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
