import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import axios from "axios";

export default function LoginForm({ openLogin, setOpenLogin }) {
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
      } else {
        console.error("Login failed:", response.data.error);
      }
    } catch (error) {
      console.error("Login failed:", error.response.data.error);
    }
  };

  return (
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
  );
}
