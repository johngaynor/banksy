import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

import axios from "axios";
import { useGlobalState } from "../context";

export default function LoginForm({ openLogin, setOpenLogin }) {
  const { setUser, addMsg } = useGlobalState();

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
      if (!response) {
        addMsg("error", "Error signing in, incorrect username or password.");
      } else if (response.status === 200) {
        setOpenLogin(false);
        setUser(response.data.user);
        addMsg("success", "Successfully logged in!");
      } else {
        addMsg("error", `Login failed: ${response.data.error}`);
      }
    } catch (error) {
      addMsg("error", `Login failed: ${error.response.data.error}`);
    }
  };

  return (
    <React.Fragment>
      <Dialog open={openLogin} onClose={onClose}>
        <DialogTitle>Login</DialogTitle>
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
              sx={{ marginBottom: "28px" }}
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
    </React.Fragment>
  );
}
