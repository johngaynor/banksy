import { useEffect } from "react";
import axios from "axios";

import { assignCategories } from "./processorFunctions";
import { categoryKeys } from "@/app/(main)/processor/components/userData";

import { useProcessorState } from "../context";

export default function Categories({ data, setLoading }) {
  const { userBanks, setUserBanks } = useProcessorState();

  console.log(userBanks);

  useEffect(() => {
    if (data) {
      const processData = async () => {
        try {
          setLoading(true);
          const categories = await assignCategories(data, categoryKeys);
          console.log(categories);
          setLoading(false);
        } catch (error) {
          console.log("error:", error);
        }
      };

      processData();
    }
  }, []);

  useEffect(() => {
    const getBanks = async () => {
      const userId = 1;
      try {
        const response = await axios.get(
          `/api/processor?action=getbanks&userId=${userId}`
        );
        if (response.status === 200) {
          setUserBanks(response.data.banks.rows);
          console.log("got data successfully", response.data.banks.rows);
        } else {
          console.log("something failed");
        }
      } catch (error) {
        console.log("error:", error);
      }
    };

    getBanks();
  }, []);

  return <h1>next step</h1>;
}
