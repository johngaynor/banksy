import { useEffect, useState } from "react";

import { parseRawFile } from "./processorFunctions";
import { useGlobalState } from "@/app/context";
import { useProcessorState } from "../context";

export default function Categories() {
  const { addMsg } = useGlobalState();

  const { userBanks, userCategories, rawFile } = useProcessorState();
  const [transactions, setTransactions] = useState(null);

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
    if (!transactions) {
      return;
    }

    const initProcess = () => {
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

      for (const transaction of transactions) {
        const desc = transaction[bank.description].toLowerCase();

        for (const categoryName in userCategories) {
          const match = userCategories[categoryName].keys.find((key) =>
            desc.includes(key)
          );

          if (match) {
            transaction["Category"] = userCategories[categoryName].ref;
            break;
          }

          transaction["Category"] = "flag";
        }
      }

      const filteredTransactions = {
        filtered: transactions.filter((t) => t.Category !== "flag"),
        flagged: transactions.filter((t) => t.Category === "flag"),
      };

      console.log(filteredTransactions);
    };
    initProcess();
  }, [transactions]);

  useEffect(() => {
    parseFile();
    // use the resulting transactions here for processing
  }, []);

  return <h1>next step</h1>;
}
