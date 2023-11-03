import { useEffect, useState } from "react";
import { Box, Grid, Typography, Button, LinearProgress } from "@mui/material";

import { processFile } from "./processorFunctions";
import { useGlobalState } from "@/app/context";
import { useProcessorState } from "../context";

export default function Categories() {
  const { addMsg } = useGlobalState();

  const { userBanks, userCategories, rawFile, data, setData, setFormStep } =
    useProcessorState();
  const [flaggedIndex, setFlaggedIndex] = useState(0);

  useEffect(() => {
    const initProcess = async () => {
      try {
        const transactions = await processFile(
          rawFile,
          userBanks,
          userCategories
        );

        setData(transactions);
      } catch (error) {
        addMsg("error", `error: ${error}`);
      }
    };
    initProcess();
  }, []);

  const assignCategory = (cat) => {
    const updatedData = { ...data };
    if (updatedData.flagged.length > flaggedIndex) {
      updatedData.flagged[flaggedIndex].category = cat;
      updatedData.filtered.push(updatedData.flagged[flaggedIndex]);
      setFlaggedIndex(flaggedIndex + 1);

      if (flaggedIndex === updatedData.flagged.length - 1) {
        setData([...updatedData.filtered]);
        addMsg("success", "All transactions have been processed!");
        setFormStep(2);
        return;
      }
      setData(updatedData);
    }
  };

  const flaggedPrompts = () => {
    if (!data || !data.flagged) {
      return;
    }

    const current = data.flagged[flaggedIndex];

    return (
      <>
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          On {current.date}, you{" "}
          {current.type === "deposit" ? "received" : "spent"} ${current.amount}{" "}
          {current.type === "deposit" ? "from" : "at"}{" "}
          <i>{current.description}</i>.
        </Typography>
        <Typography
          variant="h5"
          sx={{ textAlign: "center", marginTop: "30px" }}
        >
          Which category does this fall under?
        </Typography>
        <Grid
          container
          sx={{
            width: "70%",
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {Object.keys(userCategories).map((cat, index) => (
            <Button
              component="label"
              variant="contained"
              sx={{ width: "250px", height: "60px", margin: "10px" }}
              key={index}
              onClick={() => assignCategory(cat)}
            >
              <Typography variant="h6">{cat}</Typography>
            </Button>
          ))}
        </Grid>
      </>
    );
  };

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
            display: "flex",
            justifyContent: "center",
            marginTop: "50px",
          }}
        >
          <Grid item>
            <Typography variant="h3" sx={{ textAlign: "center" }}>
              First, let's take a look at some transactions.
            </Typography>

            <LinearProgress
              variant="determinate"
              value={
                (flaggedIndex /
                  (data?.flagged ? data.flagged.length : flaggedIndex)) *
                100
              }
              sx={{ height: "20px", width: "70%", margin: "20px auto" }}
            />
            {flaggedPrompts()}
          </Grid>
        </Grid>
      </Box>
    );
  }
}
