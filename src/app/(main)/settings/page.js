"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Grid, Typography, Button, Box, Tabs, Tab } from "@mui/material";

import { useGlobalState } from "@/app/components/context";

export default function Settings() {
  const { addMsg, user } = useGlobalState();
  const [tab, setTab] = useState(1);
  //   const []

  const TabPanel = (props) => {
    const { children, value, index } = props;
    // console.log(value, index);
    return (
      <Box
        sx={{
          padding: "5px",
          backgroundColor: "red",
          display: value == index ? "block" : "none",
        }}
      >
        {children}
      </Box>
    );
  };

  const ProfileTab = <Typography variant="h3">Profile</Typography>;
  const BanksTab = <Typography variant="h3">Banks</Typography>;

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
      <Grid item sx={{ width: "90%" }}>
        <Grid container>
          <Grid
            item
            xs={4}
            sx={{
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <Link href="/history/categories">
              <Button
                component="label"
                variant="contained"
                sx={{ marginTop: "20px" }}
              >
                Category View
              </Button>
            </Link>
          </Grid>
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
          <Grid
            item
            xs={4}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              marginBottom: "-10px",
            }}
          >
            <Typography variant="subtitle1" sx={{ marginRight: "10px" }}>
              Compare Period:
            </Typography>
          </Grid>
        </Grid>
        <Box
          sx={{
            backgroundColor: "#242424",
            border: "2px solid white",
            margin: "20px 0",
            color: "white",
            // display: "flex",
            // justifyContent: "center",
            // alignItems: "center",
            // flexDirection: "column",
          }}
        >
          <Tabs
            value={tab}
            onChange={(e, v) => setTab(v)}
            textColor="primary"
            indicatorColor="primary"
            sx={{
              backgroundColor: "blue",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Tab value={1} label="Profile" sx={{ color: "white" }} />
            <Tab value={2} label="Banks" sx={{ color: "white" }} />
            <Tab value={3} label="Keywords" sx={{ color: "white" }} />
            <Tab value={4} label="Budget" sx={{ color: "white" }} />
          </Tabs>
          <TabPanel value={tab} index={1}>
            {ProfileTab}
          </TabPanel>
          <TabPanel value={tab} index={2}>
            {BanksTab}
          </TabPanel>
        </Box>
      </Grid>
    </Box>
  );
}
