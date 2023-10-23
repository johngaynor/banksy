import { useEffect } from "react";
import axios from "axios";

import { assignCategories } from "./processorFunctions";
import { categoryKeys } from "@/app/(main)/processor/components/userData";

import { useGlobalState } from "@/app/context";
import { useProcessorState } from "../context";

export default function Categories() {
  const { user } = useGlobalState();
  const {
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
        setUserBanks(response.data.banks.rows);
        console.log("got banks", response.data.banks.rows);
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
        setUserCategories(response.data.categories.rows);
        console.log("got categories", response.data.categories.rows);
      } else {
        console.log("something failed");
      }
    } catch (error) {
      console.log("error:", error);
    }
    setCategoriesLoading(false);
  };

  useEffect(() => {
    if (!banksLoading && !userBanks && user) {
      console.log("getting banks");
      getBanks(user.user_id);
    }

    if (!categoriesLoading && !userCategories && user) {
      console.log("getting categories");
      getCategories(user.user_id);
    }
  });

  return <h1>next step</h1>;
}
