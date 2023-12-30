import { useState } from "react";
import {
  InputLabel,
  Box,
  Button,
  TextField,
  Grid,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

import { useGlobalState } from "@/app/components/context";
import { updateProfile } from "../actions";

export default function ProfileTab({ tab, index }) {
  const { user, setUser, addMsg, setUpdateProfileLoading } = useGlobalState();
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  const handleSubmit = async () => {
    if (firstName === "" || lastName === "") {
      addMsg("error", "First and last name are required.");
      return;
    }
    const updatedUser = await updateProfile(
      user.user_id,
      firstName,
      lastName,
      oldPassword,
      newPassword,
      setUpdateProfileLoading,
      addMsg,
      setUser
    );

    setNewPassword("");
    setOldPassword("");

    if (updatedUser) {
      console.log(updatedUser);
    }
  };

  if (tab !== index) {
    return;
  }

  return (
    <>
      <Grid container sx={{ padding: "30px 0" }}>
        <Grid item xs={6}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <InputLabel
              sx={{
                color: "white",
                width: "90%",
                margin: "0 auto",
              }}
            >
              First Name
            </InputLabel>
            <TextField
              variant="outlined"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              sx={{
                border: "1px solid white",
                borderRadius: "5px",
                "& input": {
                  height: "15px",
                  color: "white",
                },
                width: "90%",
                margin: "0 auto",
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <InputLabel
              sx={{
                color: "white",
                width: "90%",
                margin: "0 auto",
              }}
            >
              Last Name
            </InputLabel>
            <TextField
              variant="outlined"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              sx={{
                border: "1px solid white",
                borderRadius: "5px",
                "& input": {
                  height: "15px",
                  color: "white",
                },
                width: "90%",
                margin: "0 auto",
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={6} sx={{ paddingTop: "20px" }}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <InputLabel
              sx={{
                color: "white",
                width: "90%",
                margin: "0 auto",
              }}
            >
              Old Password
            </InputLabel>
            <TextField
              type={showPasswords ? "text" : "password"}
              variant="outlined"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              sx={{
                border: "1px solid white",
                borderRadius: "5px",
                "& input": {
                  height: "15px",
                  color: "white",
                },
                width: "90%",
                margin: "0 auto",
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={6} sx={{ paddingTop: "20px" }}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <InputLabel
              sx={{
                color: "white",
                width: "90%",
                margin: "0 auto",
              }}
            >
              New Password
            </InputLabel>
            <TextField
              type={showPasswords ? "text" : "password"}
              variant="outlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{
                border: "1px solid white",
                borderRadius: "5px",
                "& input": {
                  height: "15px",
                  color: "white",
                },
                width: "90%",
                margin: "0 auto",
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={6} sx={{ paddingTop: "20px" }}>
          <Box
            sx={{
              width: "90%",
              display: "flex",
              flexDirection: "column",
              margin: "0 auto",
            }}
          >
            <FormGroup>
              <FormControlLabel
                control={<Switch checked={showPasswords} />}
                label="Show passwords?"
                onChange={(e) => setShowPasswords(e.target.checked)}
              />
            </FormGroup>
          </Box>
        </Grid>
        <Grid
          item
          xs={6}
          sx={{
            paddingTop: "20px",
          }}
        >
          <Box
            sx={{
              width: "90%",
              margin: "0 auto",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              onClick={() => handleSubmit()}
              component="label"
              variant="contained"
              color="success"
              startIcon={<SaveIcon />}
            >
              Save Changes
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
