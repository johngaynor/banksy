"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CreditCardOffIcon from "@mui/icons-material/CreditCardOff";
import Link from "next/link";

import LoginForm from "@/app/components/auth/login";
import CustomizedSnackbars from "../flashMsg";

export default function Navbar() {
  const [openLogin, setOpenLogin] = useState(false);
  const [openMsg, setOpenMsg] = useState(false);
  const [msgContent, setMsgContent] = useState({});

  return (
    <Box
      // container
      paddingLeft={4}
      paddingRight={4}
      sx={{
        height: "70px",
        display: "flex",
        backgroundColor: "#242424",
      }}
    >
      <Grid container>
        <Grid
          item
          xs={4}
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <CreditCardOffIcon sx={{ fontSize: 40 }} />
        </Grid>
        <Grid item xs={2} />
        <Grid
          item
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
          xs={6}
        >
          <Grid item>
            <Link href="/processor">CSV PROCESSOR</Link>
          </Grid>
          <Grid
            item
            sx={{
              marginLeft: "50px",
            }}
          >
            <Link href="/stats">STATISTICS</Link>
          </Grid>
          <Grid
            item
            sx={{
              marginLeft: "50px",
            }}
          >
            <Link href="/db">DATABASE</Link>
          </Grid>
          <Grid
            item
            sx={{
              marginLeft: "50px",
            }}
          >
            <Link href="#" onClick={() => setOpenLogin(true)}>
              LOGIN
            </Link>
          </Grid>
        </Grid>
      </Grid>
      <LoginForm
        openLogin={openLogin}
        setOpenLogin={setOpenLogin}
        setMsgContent={setMsgContent}
        setOpenMsg={setOpenMsg}
      />
      <CustomizedSnackbars
        open={openMsg}
        setOpenMsg={setOpenMsg}
        msgContent={msgContent}
      />
    </Box>
  );
}
