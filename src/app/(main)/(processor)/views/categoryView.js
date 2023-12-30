import { useState } from "react";
import { Grid, Typography, LinearProgress, Box } from "@mui/material";

import { CategoryForm } from "../components/categoryForm";
import { addKeyword, getCategories } from "../actions";
import { useGlobalState } from "@/app/components/context";
import { useProcessorState } from "../context";
import Spinner from "@/app/components/spinner";

export default function Categories({ setFormStep }) {
  const {
    addMsg,
    userCategories,
    user,
    addKeywordLoading,
    setAddKeywordLoading,
  } = useGlobalState();
  const { data, setData } = useProcessorState();
  const [flaggedIndex, setFlaggedIndex] = useState(0);
  const [openKeyword, setOpenKeyword] = useState(false);
  const [keyword, setKeyword] = useState("");

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
        setFormStep(3);
        return;
      }
      setData(updatedData);
    }
  };

  const flaggedPrompts = () => {
    if (data && data.flagged) {
      const current = data.flagged[flaggedIndex];
      return (
        <CategoryForm
          current={current}
          userCategories={userCategories}
          openKeyword={openKeyword}
          keyword={keyword}
          setOpenKeyword={setOpenKeyword}
          setKeyword={setKeyword}
          assignCategory={assignCategory}
          user={user}
        />
      );
    }
  };

  return (
    <Grid
      container
      spacing={1}
      sx={{
        display: "flex",
        justifyContent: "center",
        marginTop: "50px",
        color: "white",
      }}
    >
      {addKeywordLoading ? <Spinner /> : null}
      <Grid item>
        <Typography variant="h3" sx={{ textAlign: "center" }}>
          Let's take a look at some transactions.
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
