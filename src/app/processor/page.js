"use client";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import styled from "@emotion/styled";

import { useEffect, useState } from "react";
import Image from "next/image";

import CustomizedSnackbars from "../components/flashMsg";
import { apiCall } from "../components/api/api";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function Processor() {
  const [file, setFile] = useState(null);
  const [openMsg, setOpenMsg] = useState(false);
  const [msgContent, setMsgContent] = useState({});
  const [data, setData] = useState(null);

  useEffect(() => {
    if (file) {
      console.log("running fn");
      const formData = new FormData();
      formData.append("csv_file", file);

      console.log("getting data");
      const fetchData = async () => {
        try {
          // const jsonFromCsv = await apiCall(
          //   "post",
          //   "http://localhost:8000/api/hello/",
          //   formData
          // );
          const jsonFromCsv = await apiCall(
            "post",
            "http://localhost:8000/api/hello/",
            formData
          );
          setData(jsonFromCsv);
          console.log("data set", jsonFromCsv);
        } catch (error) {
          console.log("error:", error);
        }
      };
      if (data == null) {
        fetchData();
      }
    }
  }, [file]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && file.name.endsWith(".csv")) {
      setFile(file);
      setMsgContent({ type: "success", msg: "CSV uploaded successfully!" });
    } else {
      setMsgContent({ type: "error", msg: "Please select a valid .csv file." });
    }
    setOpenMsg(true);
  };

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
            container
            sx={{
              display: "flex",
              marginTop: "20px",
            }}
          >
            {file ? (
              <>
                <p>selected file: {file.name}</p>
                <Button
                  component="label"
                  variant="contained"
                  sx={{
                    backgroundColor: "#4caf50",
                    "&:hover": {
                      backgroundColor: "#4caf50",
                    },
                    margin: "-7px 0 0 15px",
                  }}
                >
                  Start
                </Button>
              </>
            ) : (
              ""
            )}
          </Box>
        </Grid>
        <Grid item xs={6} sx={{ marginTop: "-40px" }}>
          <Image
            src="/modern1.png"
            alt="Description of the image"
            width={600}
            height={600}
          />
        </Grid>
      </Grid>
      <CustomizedSnackbars
        open={openMsg}
        setOpen={setOpenMsg}
        msgContent={msgContent}
      />
    </Box>
  );
}
