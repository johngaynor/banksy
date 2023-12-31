"use client";
import { useEffect } from "react";
import { Box, Grid, Typography, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import styled from "@emotion/styled";
import Image from "next/image";

import { useGlobalState } from "@/app/components/context";
import { useProcessorState } from "../context";
import { getBanks, getViews } from "../actions";

const VisuallyHiddenInput = styled("input")({
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function Home({ setFormStep }) {
  const {
    addMsg,
    user,
    userBanks,
    setUserBanks,
    banksLoading,
    setBanksLoading,
    userViews,
    setUserViews,
    viewsLoading,
    setViewsLoading,
  } = useGlobalState();
  const { setRawFile } = useProcessorState();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith(".csv")) {
      setRawFile(file);
      setFormStep(1);
      addMsg("success", "CSV uploaded successfully!");
    } else {
      addMsg("error", "Please select a valid .csv file.");
    }
  };

  useEffect(() => {
    if (!userBanks && !banksLoading) {
      getBanks(setUserBanks, setBanksLoading, addMsg, user ? user.user_id : 0);
      // having a problem with this because the user id is not loading in before this action gets called
    }

    if (!userViews && !viewsLoading) {
      getViews(setUserViews, setViewsLoading, addMsg, 0);
    }
  }, [userBanks, userViews]);

  return (
    <Grid container spacing={1}>
      <Grid
        item
        xs={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          marginTop: "60px",
          color: "white",
        }}
      >
        <Typography variant="h2">
          Welcome to Banksy, your analytical finance tool.
        </Typography>
        <Typography
          variant="h6"
          sx={{ marginTop: "10px", marginBottom: "20px" }}
        >
          Upload a .csv file to get started.
        </Typography>
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          disabled={!userViews || !userBanks}
          sx={{
            width: "200px",
            height: "50px",
            "&.Mui-disabled": {
              backgroundColor: "#47759a",
            },
          }}
        >
          Upload file
          <VisuallyHiddenInput type="file" onChange={handleFileChange} />
        </Button>
        <Box
          sx={{
            display: "flex",
            marginTop: "20px",
          }}
        ></Box>
      </Grid>
      <Grid item xs={6} sx={{ marginTop: "-40px" }}>
        <Image
          src="/modern1.png"
          alt="Description of the image"
          width={600}
          height={600}
          priority
        />
      </Grid>
    </Grid>
  );
}
