import { useEffect, useState } from "react";
import { Box } from "@mui/material";

import {
  processFile,
  assignCategories,
} from "../components/processorFunctions";
import { BankForm } from "../components/bankForm";
import { getCategories, getBanks, addBank } from "../actions";
import { useGlobalState } from "@/app/components/context";
import { useProcessorState } from "../context";
import Spinner from "@/app/components/spinner";

export default function BankView({ setFormStep }) {
  const {
    addMsg,
    user,
    userCategories,
    setUserCategories,
    categoriesLoading,
    setCategoriesLoading,
    userBanks,
    setUserBanks,
    banksLoading,
    setBanksLoading,
  } = useGlobalState();
  const { rawFile, setData, setAddBankLoading } = useProcessorState();
  const [headers, setHeaders] = useState({
    amount: null,
    date: null,
    description: null,
    csv: null,
  });
  const [openBank, setOpenBank] = useState(false);
  const [bankName, setBankName] = useState("");

  useEffect(() => {
    if (!userCategories && !categoriesLoading) {
      getCategories(
        setUserCategories,
        setCategoriesLoading,
        addMsg,
        user ? user.user_id : 0
      );
    }

    if (!userBanks && !banksLoading) {
      getBanks(setUserBanks, setBanksLoading, addMsg, user ? user.user_id : 0);
    }
  }, [userCategories, userBanks]);

  useEffect(() => {
    if (
      headers.amount &&
      headers.date &&
      headers.description &&
      openBank &&
      bankName !== ""
    ) {
      const submitBank = async () => {
        await addBank(
          user.user_id,
          bankName,
          headers.description,
          headers.date,
          headers.amount,
          setAddBankLoading,
          addMsg
        );
      };
      submitBank();
    }
  }, [headers]);

  useEffect(() => {
    if (userCategories && userBanks) {
      const initProcess = async () => {
        try {
          const result = await processFile(rawFile, userBanks);

          if (result.bank) {
            const transactions = assignCategories(
              result.csv,
              result.bank,
              userCategories
            );
            setData(transactions);
            addMsg("success", `Found "${result.bank.bank_name}" CSV`);
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
    const missingHeaders = Object.keys(headers).filter(
      (f) => f !== "csv" && headers[f] === null
    );

    if (!missingHeaders.length) {
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

    const setHeader = (header, val) => {
      const newHeader = { ...headers };
      newHeader[header] = val;
      setHeaders(newHeader);
    };

    const current = missingHeaders[0];

    return (
      <BankForm
        current={current}
        setHeader={setHeader}
        headers={headers}
        openBank={openBank}
        user={user}
        bankName={bankName}
        setBankName={setBankName}
        setOpenBank={setOpenBank}
      />
    );
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
