"use client";
import * as React from "react";
import {
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  IconButton,
  Typography,
  Tooltip,
} from "@mui/material";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import CreditCardOffIcon from "@mui/icons-material/CreditCardOff";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const path = usePathname();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
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
        <CreditCardOffIcon sx={{ fontSize: 40 }} />
        <Box>
          <Link
            href="/"
            style={{
              borderBottom: path === "/" ? "1px solid white" : "",
            }}
          >
            CSV PROCESSOR
          </Link>
          <Link
            href="/history"
            style={{
              borderBottom: path === "/history" ? "1px solid white" : "",
              marginLeft: "50px",
            }}
          >
            HISTORY
          </Link>
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2, marginLeft: "50px" }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar sx={{ width: 32, height: 32 }}>X</Avatar>
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
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
        <MenuItem onClick={handleClose}>
          <Avatar /> Profile
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar /> My account
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
