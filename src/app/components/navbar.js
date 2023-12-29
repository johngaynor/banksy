"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import CreditCardOffIcon from "@mui/icons-material/CreditCardOff";
import axios from "axios";
import Link from "next/link";
import { usePathname } from "next/navigation";

import LoginForm from "@/app/components/auth/login";
import RegisterForm from "@/app/components/auth/register";
import { useGlobalState } from "./context";

export default function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const { user, setUser, addMsg } = useGlobalState();

  const open = Boolean(anchorEl); // used to manage state of profile dropdown
  const path = usePathname();

  useEffect(() => {
    // check to see if there are cookies for a current user and, if so, log them in
    if (!user) {
      const checkCookies = async () => {
        try {
          const response = await axios.get("/api/auth?action=autologin");
          if (response.status === 200) {
            if (response.data.user_id) {
              const { user_id, first_name, last_name, email } = response.data;
              setUser({ user_id, first_name, last_name, email });
            } else {
            }
          }
        } catch (error) {
          addMsg("error", `error checking cookies for user: ${error}`);
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
        addMsg("error", `error logging out: ${response.data.error}`);
      }
    } catch (error) {
      addMsg("error", `error logging out: ${error}`);
    }
  };

  const handleClickUser = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloserUser = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <RegisterForm
        openRegister={openRegister}
        setOpenRegister={setOpenRegister}
      />
      <LoginForm openLogin={openLogin} setOpenLogin={setOpenLogin} />
      <Box
        paddingLeft={4}
        paddingRight={4}
        sx={{
          height: "70px",
          display: "flex",
          backgroundColor: "#121212",
          alignItems: "center",
          textAlign: "center",
          justifyContent: "space-between",
        }}
      >
        <CreditCardOffIcon sx={{ fontSize: 40, color: "white" }} />
        <Box>
          <Link
            href="/"
            style={{
              borderBottom: path === "/" ? "1px solid white" : "",
              color: "white",
            }}
          >
            CSV PROCESSOR
          </Link>
          <Link
            href="/history"
            style={{
              borderBottom: path === "/history" ? "1px solid white" : "",
              color: "white",
              marginLeft: "50px",
            }}
          >
            HISTORY
          </Link>
          {user ? (
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleClickUser}
                size="small"
                sx={{ ml: 2, marginLeft: "50px" }}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <Avatar sx={{ width: 32, height: 32 }}>
                  {user.first_name[0]}
                </Avatar>
              </IconButton>
            </Tooltip>
          ) : (
            <>
              <Link
                href="#"
                style={{
                  marginLeft: "50px",
                  color: "white",
                }}
                onClick={() => setOpenLogin(true)}
              >
                LOGIN
              </Link>
              <Link
                href="#"
                style={{
                  marginLeft: "50px",
                  color: "white",
                }}
                onClick={() => setOpenRegister(true)}
              >
                REGISTER
              </Link>
            </>
          )}
        </Box>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleCloserUser}
        onClick={handleCloserUser}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Typography
          variant="subtitle1"
          sx={{ padding: "5px", marginLeft: "10px" }}
        >
          Welcome, {user?.first_name}
        </Typography>
        <MenuItem
          onClick={() =>
            alert("Sorry, the profile feature is not available yet.")
          }
        >
          <Avatar />
          My Profile
        </MenuItem>
        <Divider />
        <Link href="/settings">
          <MenuItem>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
        </Link>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
