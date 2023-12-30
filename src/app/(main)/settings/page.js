"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Grid, Typography, Button, Box, Tabs, Tab } from "@mui/material";
import Spinner from "@/app/components/spinner";

import { useGlobalState } from "@/app/components/context";
import ProfileTab from "./tabs/ProfileTab";

export default function Settings() {
  const { addMsg, user, updateProfileLoading } = useGlobalState();
  const [tab, setTab] = useState(1);

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
      {updateProfileLoading ? <Spinner /> : null}
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
              //   backgroundColor: "blue",
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
          </Box>
        </Box>
      </Grid>
    </Box>
  );
}
