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

  // if (loading) {
  //   return <CircularProgress />;
  // }

  if (formStep === 0) {
    return <Home setFormStep={setFormStep} />;
  } else if (formStep === 1) {
    return <Categories />;
  }
}

// CODE FOR LOADING IN INITIAL PROCESSED DATA
// useEffect(() => {
//   if (file) {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const transactions = await initUpload(file);
//         setData(transactions);
//         // console.log("data set", transactions);
//         addMsg("success", "data set!");
//         setLoading(false);
//       } catch (error) {
//         // console.log("error:", error);
//         addMsg("error", error);
//       }
//     };

//     fetchData();
//   }
// }, [file]);
