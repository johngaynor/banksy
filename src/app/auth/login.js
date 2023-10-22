import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import { useGlobalState } from "../context";

import FlashMsg from "../components/flashMsg";

export default function LoginForm({ openLogin, setOpenLogin }) {
  const { user, setUser, msg, setMsg } = useGlobalState();

  const onClose = () => {
    setOpenLogin(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    try {
      const response = await axios.get(
        `/api/auth?action=login&email=${email}&password=${password}`
      );
      if (response.status === 200) {
        console.log("Login successful:", response.data.user);
        setOpenLogin(false);
        setUser(response.data.user);
        setMsg([...msg, "Successfully set user!"]);
      } else {
        // console.error("Login failed:", response.data.error);
        setMsg([...msg, `Login failed: ${response.data.error}`]);
      }
    } catch (error) {
      // console.error("Login failed:", error.response.data.error);
      setMsg([...msg, `Login failed: ${error.response.data.error}`]);
    }
  };

  return (
    <React.Fragment>
      <Dialog open={openLogin} onClose={onClose}>
        <DialogTitle>Sign In</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button type="submit" variant="contained" fullWidth>
              Sign In
            </Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
      {/* <FlashMsg /> */}
    </React.Fragment>
  );
}
