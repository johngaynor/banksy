"use client";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";

import Home from "../components/home";
import Categories from "../components/categories";
import { initUpload } from "../components/processorFunctions";
import { useGlobalState } from "../../../context";
import { useProcessorState } from "../context";

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
        // console.log("got banks", response.data);
        setUserBanks(response.data);
      } else {
        console.log("something failed");
      }
    } catch (error) {
      console.log("error:", error);
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
        // console.log("got sorted categories", response.data);
        setUserCategories(response.data);
      } else {
        console.log("something failed");
      }
    } catch (error) {
      console.log("error:", error);
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
  }
}
