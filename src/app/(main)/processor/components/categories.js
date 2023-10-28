import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import styled from "@emotion/styled";
import Image from "next/image";

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

  if (userCategories) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          padding: 4,
          backgroundColor: "#242424",
          minHeight: "100vh",
          display: "flex",
        }}
      >
        <Grid
          container
          spacing={1}
          sx={{
            backgroundColor: "blue",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Grid item>
            <Typography variant="h2" sx={{ textAlign: "center" }}>
              Next, let's take a look at some transactions.
            </Typography>

            <Grid
              container
              sx={{
                width: "70%",
                margin: "0 auto",
                display: "flex",
                justifyContent: "center",
                backgroundColor: "green",
              }}
            >
              {Object.keys(userCategories).map((cat, index) => (
                <Button
                  component="label"
                  variant="contained"
                  sx={{ width: "300px", height: "60px", margin: "10px" }}
                  key={index}
                >
                  <Typography variant="h6">{cat}</Typography>
                </Button>
              ))}
            </Grid>

            <Box
              sx={{
                display: "flex",
                marginTop: "20px",
              }}
            ></Box>
          </Grid>
        </Grid>
      </Box>
    );
  }
}
