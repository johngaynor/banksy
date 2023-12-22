import { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Button,
  LinearProgress,
  TextField,
  Box,
} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";

import { processFile } from "../components/processorFunctions";
import { addKeyword, getCategories } from "../actions";
import { useGlobalState } from "@/app/components/context";
import { useProcessorState } from "../context";
import Spinner from "@/app/components/spinner";

export default function Categories({ setFormStep }) {
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
  const [flaggedIndex, setFlaggedIndex] = useState(0);
  const [openKeyword, setOpenKeyword] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [addKeywordLoading, setAddKeywordLoading] = useState(false);

  useEffect(() => {
    if (!userCategories && !categoriesLoading) {
      getCategories(
        setUserCategories,
        setCategoriesLoading,
        addMsg,
        user ? user.user_id : false
      );
    }
  }, [userCategories]);

  useEffect(() => {
    if (userCategories) {
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
    }
  }, [userCategories]);

  const assignCategory = async (cat) => {
    if (openKeyword && keyword !== "") {
      await addKeyword(
        user.user_id,
        userCategories[cat].ref,
        keyword,
        setAddKeywordLoading,
        addMsg
      );
      setOpenKeyword(false);
      setKeyword("");
    }

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

  const handleOpenKeyword = () => {
    if (!user) {
      alert("Please log in before adding keywords for a category.");
    } else {
      setOpenKeyword(!openKeyword);
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
        }}
      >
        <h3>Categories are loading...</h3>
      </Box>
    );
  }

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
          {["income", ...Object.keys(userCategories)].map((cat, index) => (
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
        <Grid
          container
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "25px",
          }}
        >
          <Button
            onClick={handleOpenKeyword}
            component="label"
            variant={openKeyword ? "outlined" : "contained"}
            sx={{
              height: "50px",
              backgroundColor: openKeyword ? "" : "#90caf9",
            }}
            startIcon={<AddBoxIcon />}
          >
            Add Keyword
          </Button>
          {openKeyword ? (
            <TextField
              variant="outlined"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              sx={{
                border: "1px solid white",
                borderRadius: "5px",
                "& input": {
                  height: "15px",
                  color: "white",
                },
              }}
            />
          ) : null}
        </Grid>
      </>
    );
  };

  if (userCategories) {
    return (
      <Grid
        container
        spacing={1}
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "50px",
        }}
      >
        {addKeywordLoading ? <Spinner /> : null}
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
    );
  }
}
