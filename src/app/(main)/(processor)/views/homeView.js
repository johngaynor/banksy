"use client";
import { useEffect } from "react";
import { Box, Grid, Typography, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import styled from "@emotion/styled";
import Image from "next/image";

import { useGlobalState } from "@/app/components/context";
import { useProcessorState } from "../context";
import { getBanks, getCategories, getViews } from "../actions";

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
    userBanks,
    setUserBanks,
    banksLoading,
    setBanksLoading,
    userCategories,
    setUserCategories,
    categoriesLoading,
    setCategoriesLoading,
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
      getBanks(setUserBanks, setBanksLoading, addMsg, 0);
      // 0 will change to user ? user.user_id : 0 when custom functionality is built
    }
    if (!userCategories && !categoriesLoading) {
      getCategories(setUserCategories, setCategoriesLoading, addMsg, 0);
    }

    if (!userViews && !viewsLoading) {
      getViews(setUserViews, setViewsLoading, addMsg, 0);
    }
  }, [userBanks, userCategories, userViews]);

  return (
    <Grid container spacing={1}>
      <Grid
        item
        xs={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          marginTop: "60px",
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
          sx={{ width: "200px", height: "50px" }}
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
