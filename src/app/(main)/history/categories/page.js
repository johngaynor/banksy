"use client";
import { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Button,
  Select,
  FormGroup,
  FormControlLabel,
  Switch,
  Box,
  CircularProgress,
  MenuItem,
} from "@mui/material";

import { useGlobalState } from "@/app/components/context";
import { getHistory } from "../actions";
import {
  generateCategoryObj,
  generateCategoryStats,
} from "../components/HistoryFunctions";

export default function CategoryView() {
  const {
    addMsg,
    userHistory,
    setUserHistory,
    historyLoading,
    setHistoryLoading,
    user,
  } = useGlobalState();
  const [activeCategory, setActiveCategory] = useState(null);
  const [statsPeriod, setStatsPeriod] = useState(3);

  useEffect(() => {
    if (user && !userHistory && !historyLoading) {
      getHistory(setUserHistory, setHistoryLoading, addMsg, user.user_id);
    }
  }, [userHistory, user]);

  const categoryObj = userHistory
    ? generateCategoryObj(userHistory, setActiveCategory)
    : null;
  const categoryStats = categoryObj
    ? generateCategoryStats(categoryObj, activeCategory, statsPeriod)
    : null;

  console.log(categoryStats);

  if (!user) {
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
        <h3>Please sign in to view categories tab.</h3>
      </Box>
    );
  }

  if (historyLoading || !categoryObj) {
    return <CircularProgress />;
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        padding: 4,
        backgroundColor: "#121212",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Grid
        item
        sx={{
          width: "90%",
        }}
      >
        <Grid container>
          <Grid
            item
            xs={4}
            sx={{
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <Button
              onClick={() =>
                alert("Sorry, this feature is not available yet. (PDF)")
              }
              component="label"
              variant="contained"
              sx={{ marginTop: "20px" }}
            >
              Category View
            </Button>
          </Grid>
          <Grid
            item
            xs={4}
            sx={{
              display: "flex",
              justifyContent: "center",
              backgroundColor: "red",
              //   alignItems: "flex-end",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              Categories (specific category)
            </Typography>
          </Grid>
          <Grid
            item
            xs={4}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
              backgroundColor: "blue",
            }}
          ></Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
