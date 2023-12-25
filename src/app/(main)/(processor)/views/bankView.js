import { useEffect, useState } from "react";
import { Grid, Typography, LinearProgress, Box, Button } from "@mui/material";

import {
  processFile,
  assignCategories,
} from "../components/processorFunctions";
import { getCategories } from "../actions";
import { useGlobalState } from "@/app/components/context";
import { useProcessorState } from "../context";
import Spinner from "@/app/components/spinner";

export default function BankView({ setFormStep }) {
  const {
    addMsg,
    userBanks,
    userCategories,
    user,
    setUserCategories,
    categoriesLoading,
    setCategoriesLoading,
  } = useGlobalState();
  const { rawFile, data, setData } = useProcessorState();
  const [headers, setHeaders] = useState({
    amount: null,
    date: null,
    description: null,
    csv: null,
  });

  useEffect(() => {
    if (!userCategories && !categoriesLoading) {
      getCategories(
        setUserCategories,
        setCategoriesLoading,
        addMsg,
        user ? user.user_id : 0
      );
    }
  }, [userCategories]);

  useEffect(() => {
    if (userCategories) {
      const initProcess = async () => {
        try {
          const result = await processFile(rawFile, userBanks);

          if (result.csv) {
            // handle workflow process for assigning new bank
            const transactions = assignCategories(
              result.csv,
              result.bank,
              userCategories
            );
            setData(transactions);
            setFormStep(2);
          } else {
            setHeaders({
              ...headers,
              fileHeaders: result.headers,
              csv: result.csv,
            });
          }
        } catch (error) {
          addMsg("error", `error: ${error}`);
        }
      };
      initProcess();
    }
  }, [userCategories]);

  const headerWorkflow = () => {
    if (headers.amount && headers.date && headers.description && headers.csv) {
      console.log("FINISHED ASSIGNING HEADERS, PROCESSING DATA");
      const bankHeaders = {
        amount: headers.amount,
        date: headers.date,
        description: headers.description,
      };
      const transactions = assignCategories(
        headers.csv,
        bankHeaders,
        userCategories
      );
      setData(transactions);
      setFormStep(2);
    }

    const missingHeaders = Object.keys(headers).filter(
      (f) => f !== "csv" && headers[f] === null
    );

    console.log(missingHeaders);

    const shiftArr = (h) => {
      const newHeader = { ...headers };
      newHeader[h] = true;
      setHeaders(newHeader);
    };

    while (missingHeaders.length) {
      return (
        <Box sx={{ color: "white" }}>
          missing header: {missingHeaders[0]}
          <Button onClick={() => shiftArr(missingHeaders[0])}>
            Click me to move on
          </Button>
        </Box>
      );
    }
  };

  if (!userCategories || categoriesLoading) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          padding: 4,
          backgroundColor: "#121212",
          minHeight: "100vh",
          display: "flex",
          color: "white",
        }}
      >
        <Spinner />
        <h3>Loading categories...</h3>
      </Box>
    );
  }

  if (!data && (!headers.amount || !headers.date || !headers.description)) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          padding: 4,
          backgroundColor: "#121212",
          minHeight: "100vh",
          display: "flex",
          color: "white",
        }}
      >
        {headerWorkflow()}
      </Box>
    );
  }
}
