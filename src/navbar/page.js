"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CreditCardOffIcon from "@mui/icons-material/CreditCardOff";
import Button from "@mui/material/Button";

import Link from "next/link";
import Image from "next/image";

import LoginForm from "@/app/components/login";

export default function Navbar() {
  const [openLogin, setOpenLogin] = useState(false);

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

          {/* <Dialog open={openLogin} onClose={handleClose}>
              <DialogTitle>Sign In</DialogTitle>
              <DialogContent>
                <form onSubmit={handleSubmit}>
                  <input type="text" placeholder="Email" />
                  <input type="password" placeholder="Password" />
                </form>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit" variant="contained" onClick={handleClose}>
                  Sign In
                </Button>
              </DialogActions>
            </Dialog> */}
        </Grid>
      </Grid>
      <LoginForm openLogin={openLogin} setOpenLogin={setOpenLogin} />
    </Box>
  );
}
