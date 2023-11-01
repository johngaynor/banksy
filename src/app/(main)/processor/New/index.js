"use client";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";

import { useGlobalState } from "../../../context";
import { useProcessorState } from "../context";
import Home from "../components/home";
import Categories from "../components/categories";
import TableView from "../components/tableView";
import SummaryView from "../components/summaryView";

export default function Processor() {
  const { addMsg } = useGlobalState();
  const {
    formStep,
    rawFile,
    userBanks,
    setUserBanks,
    banksLoading,
    setBanksLoading,
    userCategories,
    setUserCategories,
    categoriesLoading,
    setCategoriesLoading,
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

  useEffect(() => {
    if (!userBanks && !banksLoading) {
      getBanks(0);
    }

    if (!userCategories && !categoriesLoading) {
      getCategories(0);
    }
  }, [userBanks, userCategories]);

  if (banksLoading || categoriesLoading) {
    return <CircularProgress />;
  }

  if (formStep === 0) {
    return <Home />;
  } else if (formStep === 1) {
    // removed && rawFile
    return <Categories />;
  } else if (formStep === 2) {
    return <TableView />;
  } else if (formStep === 3) {
    return <SummaryView />;
  }
}
