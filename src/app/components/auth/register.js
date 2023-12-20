import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import axios from "axios";
import { useGlobalState } from "../context";

export default function RegisterForm({ openRegister, setOpenRegister }) {
  const { setUser, addMsg } = useGlobalState();

  const onClose = () => {
    setOpenRegister(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const dataObj = Object.fromEntries(data);
    const {
      email,
      password,
      fname,
      lname,
      "password-confirm": passwordConfirm,
    } = dataObj;

    if (passwordConfirm !== password) {
      addMsg("error", "Passwords do not match. Please try again.");
      return;
    }
    try {
      const payload = { email, password, fname, lname };
      const response = await axios.post(`/api/auth?action=register`, payload);
      if (response.status === 200) {
        setOpenRegister(false);
        setUser(response.data.user);
        addMsg("success", "Successfully registered user!");
      } else {
        console.log("status not 200", response.data);
        addMsg("error", `Register failed: ${response.data.error}`);
      }
    } catch (error) {
      console.log("catch block called", error);
      addMsg("error", `Register failed: ${error.response.data}`);
    }
  };

  return (
    <React.Fragment>
      <Dialog open={openRegister} onClose={onClose}>
        <DialogTitle>Register an Account</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <TextField
                margin="normal"
                required
                id="fname"
                label="First Name"
                name="fname"
                autoFocus
                sx={{ width: "48%" }}
              />
              <TextField
                margin="normal"
                required
                id="lname"
                label="Last Name"
                name="lname"
                autoFocus
                sx={{ width: "48%" }}
              />
            </Box>
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="password-confirm"
              label="Confirm Password"
              type="password"
              id="password-confirm"
              autoComplete="current-password"
              sx={{ marginBottom: "28px" }}
            />
            <Button type="submit" variant="contained" fullWidth>
              Register
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
