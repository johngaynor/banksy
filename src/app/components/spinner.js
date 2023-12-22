import React from "react";
import { CircularProgress, Box } from "@mui/material";

const Spinner = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent black background
        zIndex: 9999,
      }}
    >
      <CircularProgress color="primary" />
    </Box>
  );
};

export default Spinner;
