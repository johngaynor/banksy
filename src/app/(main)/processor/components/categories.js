import { useEffect, useState } from "react";

import Papa from "papaparse";

import { assignCategories } from "./processorFunctions";
import { categoryKeys } from "@/app/(main)/processor/components/userData";

import { parseRawFile } from "./processorFunctions";

import { useGlobalState } from "@/app/context";
import { useProcessorState } from "../context";
import { ConstructionOutlined } from "@mui/icons-material";

export default function Categories() {
  const { user, addMsg } = useGlobalState();

  const { userBanks, userCategories, rawFile } = useProcessorState();
  const [transactions, setTransactions] = useState(null);

  // console.log(userBanks, userCategories);

  const parseFile = async () => {
    try {
      const transactions = await parseRawFile(rawFile);
      setTransactions(transactions);
      console.log("set transactions");
    } catch (error) {
      addMsg("error", `error: ${error}`);
    }
  };

  useEffect(() => {
    const findBank = () => {
      const headers = Object.keys(transactions[0]);
      const bank = userBanks.find(
        (bank) =>
          // looking for a bank that has matching headers
          headers.includes(bank.date) &&
          headers.includes(bank.description) &&
          headers.includes(bank.amount)
      );

      if (!bank) {
        addMsg("error", "unable to find a matching bank");
        return;
      }
    };

    if (transactions) findBank();
  }, [transactions]);

  useEffect(() => {
    parseFile();
    // use the resulting transactions here for processing
  }, []);

  return <h1>next step</h1>;
}
