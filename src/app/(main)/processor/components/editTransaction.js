"use client";

import React, { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import { useProcessorState } from "../context";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "#333",
  border: "2px solid white",
  borderRadius: "5px",
  height: "300px",
  p: 2,
};

export default function EditTransaction({
  openEdit,
  setOpenEdit,
  transaction,
}) {
  const { userCategories } = useProcessorState();
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState("withdrawal");

  const onClose = () => {
    setOpenEdit(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("category", category);
    // handle submit here
  };

  const categories = ["income", ...Object.keys(userCategories)];

  useEffect(() => {
    if (transaction) {
      setCategory(transaction.category);
      setAmount(transaction.amount);
    }
  }, [transaction]);

  if (!transaction) {
    return;
  }

  return (
    <React.Fragment>
      <Modal
        open={openEdit}
        onClose={onClose}
        style={{
          backdropFilter: "blur(1px)",
        }}
        hideBackdrop={true}
      >
        <Box sx={modalStyle}>
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Edit transaction #{transaction?.id + 1}
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <InputLabel>Date</InputLabel>
                {/* Add your date input here */}
              </Grid>
              <Grid item xs={4}>
                <InputLabel>Amount</InputLabel>
                <TextField
                  variant="outlined"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </Grid>
              <Grid item xs={4}>
                <InputLabel sx={{ color: "white" }}>Type</InputLabel>
                <ToggleButtonGroup
                  color={type === "withdrawal" ? "error" : "success"}
                  value={type}
                  exclusive
                  onChange={(e) => setType(e.target.value)}
                >
                  <ToggleButton
                    value="withdrawal"
                    style={{
                      border: "1px solid white",
                      color: type === "withdrawal" ? null : "#C2C2C2",
                    }}
                  >
                    Withdrawal
                  </ToggleButton>
                  <ToggleButton
                    value="deposit"
                    style={{
                      border: "1px solid white",
                      color: type === "deposit" ? null : "#C2C2C2",
                    }}
                  >
                    Deposit
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>

              <Grid item xs={8}>
                <InputLabel>Description</InputLabel>
                {/* Add your description input here */}
              </Grid>
              <Grid item xs={3}>
                <InputLabel>Category</InputLabel>
                <Select
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                  label="Category"
                >
                  {categories.map((cat) => (
                    <MenuItem value={cat} key={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>

            <Button type="submit">Submit</Button>
            {/* <Button onClick={onClose}>Cancel</Button> */}
          </form>

          <Button onClick={onClose}>Cancel</Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
}
