"use client";
import { useState, useEffect } from "react";
import { Grid, Typography, Box, Tabs, Tab } from "@mui/material";
import Spinner from "@/app/components/spinner";

import { useGlobalState } from "@/app/components/context";
import { getCategories } from "../(processor)/actions";
import ProfileTab from "./tabs/ProfileTab";
import KeywordTab from "./tabs/KeywordTab";

export default function Settings() {
  const {
    addMsg,
    user,
    updateProfileLoading,
    userCategories,
    setUserCategories,
    categoriesLoading,
    setCategoriesLoading,
    addKeywordLoading,
    deleteKeywordLoading,
    editUseDefaultKeywordsLoading,
  } = useGlobalState();
  const [tab, setTab] = useState(1);

  useEffect(() => {
    if (!userCategories && !categoriesLoading && user) {
      getCategories(
        setUserCategories,
        setCategoriesLoading,
        addMsg,
        user.user_id
      );
    }
  }, [userCategories, user]);

  if (!user) {
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
        <h3>Please sign in to view your settings.</h3>
      </Box>
    );
  }

  if (!userCategories) {
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
        {categoriesLoading ? <Spinner /> : null}
        <h3>User categories and keywords loading...</h3>
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
        justifyContent: "center",
        color: "white",
      }}
    >
      {updateProfileLoading ||
      addKeywordLoading ||
      deleteKeywordLoading ||
      editUseDefaultKeywordsLoading ? (
        <Spinner />
      ) : null}
      <Grid item sx={{ width: "90%" }}>
        <Grid container>
          <Grid item xs={4}></Grid>
          <Grid
            item
            xs={4}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              User Settings
            </Typography>
          </Grid>
          <Grid item xs={4}></Grid>
        </Grid>
        <Box
          sx={{
            backgroundColor: "#242424",
            border: "2px solid white",
            color: "white",
            width: "60%",
            margin: "20px auto",
          }}
        >
          <Tabs
            value={tab}
            onChange={(e, v) => setTab(v)}
            textColor="primary"
            indicatorColor="primary"
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Tab value={1} label="Profile" sx={{ color: "white" }} />
            <Tab value={2} label="Banks" sx={{ color: "white" }} />
            <Tab value={3} label="Keywords" sx={{ color: "white" }} />
            <Tab value={4} label="Budget" sx={{ color: "white" }} />
            <Tab value={5} label="Advanced" sx={{ color: "white" }} />
          </Tabs>
          <Box
            sx={{
              padding: "5px",
              height: "50vh",
            }}
          >
            <ProfileTab tab={tab} index={1} />
            <KeywordTab tab={tab} index={3} />
          </Box>
        </Box>
      </Grid>
    </Box>
  );
}
