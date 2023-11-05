"use client";
import { useEffect } from "react";
import { CircularProgress } from "@mui/material";
import axios from "axios";

import Home from "../components/home";
import Categories from "../components/categories";
import TableView from "../components/tableView";
import SummaryView from "../components/summaryView";
import { useGlobalState } from "../../../components/context";
import { useProcessorState } from "../context";

export default function Processor() {
  const { addMsg, user } = useGlobalState();
  const {
    formStep,
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
  } = useProcessorState();

  const getBanks = async (userId) => {
    setBanksLoading(true);
    try {
      const response = await axios.get(
        `/api/processor?action=getbanks&userId=${userId}`
      );
      if (response.status === 200) {
        setUserBanks(response.data);
        addMsg("success", "Got user banks.");
      } else {
        addMsg("error", "Something failed, please try again later. (banks)");
      }
    } catch (error) {
      addMsg("error", `error getting banks: ${error}`);
    }
    setBanksLoading(false);
  };

  const getCategories = async (userId) => {
    setCategoriesLoading(true);
    try {
      const response = await axios.get(
        `/api/processor?action=getcategories&userId=${userId}`
      );
      if (response.status === 200) {
        setUserCategories(response.data);
        addMsg("success", "Got user categories.");
      } else {
        addMsg(
          "error",
          "Something failed, please try again later. (categories)"
        );
      }
    } catch (error) {
      addMsg("error", `error getting categories: ${error}`);
    }
    setCategoriesLoading(false);
  };

  const getViews = async () => {
    setViewsLoading(true);
    try {
      const response = await axios.get(`/api/processor?action=getviews`);
      if (response.status === 200) {
        setUserViews(response.data);
        addMsg("success", "Got summary views.");
      } else {
        addMsg("error", "Something failed, please try again later. (views)");
      }
    } catch (error) {
      addMsg("error", `error getting views: ${error}`);
    }
    setViewsLoading(false);
  };

  useEffect(() => {
    if (!userBanks && !banksLoading) {
      getBanks(user ? user.userId : 0);
    }

    if (!userCategories && !categoriesLoading) {
      getCategories(user ? user.userId : 0);
    }

    if (!userViews && !viewsLoading) {
      getViews(user ? user.userId : 0);
    }
  }, [userBanks, userCategories, userViews]);

  if (
    banksLoading ||
    categoriesLoading ||
    viewsLoading ||
    submitSummaryLoading
  ) {
    return <CircularProgress />;
  }

  if (formStep === 0) {
    return <Home />;
  } else if (formStep === 1) {
    return <Categories />;
  } else if (formStep === 2) {
    return <TableView />;
  } else if (formStep === 3) {
    return <SummaryView />;
  }
}
