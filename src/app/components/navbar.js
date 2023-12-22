"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Box, Grid } from "@mui/material";
import CreditCardOffIcon from "@mui/icons-material/CreditCardOff";
import axios from "axios";
import Link from "next/link";

import LoginForm from "@/app/components/auth/login";
import RegisterForm from "@/app/components/auth/register";
import { useGlobalState } from "./context";

export default function Navbar() {
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const { user, setUser, addMsg } = useGlobalState();
  const path = usePathname();

  useEffect(() => {
    // check to see if there are cookies for a current user and, if so, log them in
    if (!user) {
      const checkCookies = async () => {
        try {
          const response = await axios.get("/api/auth?action=autologin");
          if (response.status === 200) {
            if (response.data.user_id) {
              const { user_id, first_name, email } = response.data;
              setUser({ user_id, first_name, email });
            } else {
              // console.log("no user to be set");
            }
          }
        } catch (error) {
          // addMsg("error", `error checking cookies for user: ${error}`);
        }
      };

      checkCookies();
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get("/api/auth?action=logout");
      if (response.status === 200) {
        addMsg("success", "Successfully logged out!");
        setUser(null);
      } else {
        // addMsg("error", `error logging out: ${response.data.error}`);
        console.log(response.data);
      }
    } catch (error) {
      addMsg("error", `error logging out: ${error}`);
    }
  };

  return (
    <Box
      // container
      paddingLeft={4}
      paddingRight={4}
      sx={{
        height: "70px",
        display: "flex",
        backgroundColor: "#121212",
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
            <Link
              href="/"
              style={{
                borderBottom: path === "/" ? "1px solid white" : "",
              }}
            >
              CSV PROCESSOR
            </Link>
          </Grid>
          <Grid
            item
            sx={{
              marginLeft: "50px",
            }}
          >
            <Link
              href="/history"
              style={{
                borderBottom: path === "/history" ? "1px solid white" : "",
              }}
            >
              STATISTICS
            </Link>
          </Grid>
          <Grid
            item
            sx={{
              marginLeft: "50px",
            }}
          >
            <Link href="/db">DATABASE</Link>
          </Grid>
          {user ? (
            <Grid
              item
              sx={{
                marginLeft: "50px",
              }}
            >
              <Link href="#" onClick={handleLogout}>
                LOGOUT
              </Link>
            </Grid>
          ) : (
            <>
              <Grid
                item
                sx={{
                  marginLeft: "50px",
                }}
              >
                <Link href="#" onClick={() => setOpenLogin(true)}>
                  LOGIN
                </Link>
              </Grid>{" "}
              <Grid
                item
                sx={{
                  marginLeft: "50px",
                }}
              >
                <Link href="#" onClick={() => setOpenRegister(true)}>
                  REGISTER
                </Link>
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
      <RegisterForm
        openRegister={openRegister}
        setOpenRegister={setOpenRegister}
      />
      <LoginForm openLogin={openLogin} setOpenLogin={setOpenLogin} />
    </Box>
  );
}
