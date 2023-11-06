import React, { createContext, useContext, useState, useCallback } from "react";

const GlobalContext = createContext();

const GlobalContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState([]);
  const [userBanks, setUserBanks] = useState(null);
  const [userCategories, setUserCategories] = useState(null);
  const [userViews, setUserViews] = useState(null);
  const [userHistory, setUserHistory] = useState(null);

  // loading states
  const [banksLoading, setBanksLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [viewsLoading, setViewsLoading] = useState(false);
  const [submitSummaryLoading, setSubmitSummaryLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  const addMsg = useCallback((type, msgContent) => {
    setMsg((prevArr) => [...prevArr, { type, msg: msgContent }]);
  });

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        msg,
        setMsg,
        addMsg,
        userBanks,
        setUserBanks,
        banksLoading,
        setBanksLoading,
        userCategories,
        setUserCategories,
        categoriesLoading,
        setCategoriesLoading,
        userViews,
        setUserViews,
        viewsLoading,
        setViewsLoading,
        submitSummaryLoading,
        setSubmitSummaryLoading,
        userHistory,
        setUserHistory,
        historyLoading,
        setHistoryLoading,
      }}
    >
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
