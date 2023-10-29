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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import InputAdornment from "@mui/material/InputAdornment";
import moment from "moment";

import { useProcessorState } from "../context";
import { useGlobalState } from "@/app/context";

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
  const { userCategories, setData, data } = useProcessorState();
  const { addMsg } = useGlobalState();
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState("withdrawal");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(moment());

  // console.log(`clicked on transaction #${transaction?.id}`, transaction);

  const onClose = () => {
    setOpenEdit(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const updatedData = { ...data };
    updatedData.filtered[transaction.id] = {
      date: date.format("MM/DD/YYYY"),
      amount,
      type,
      description,
      category,
    };
    setData(updatedData);
    addMsg(
      "success",
      `Successfully updated transaction #${transaction.id + 1}`
    );
    setOpenEdit(false);
  };

  const categories = ["income", ...Object.keys(userCategories)];

  useEffect(() => {
    if (transaction) {
      setCategory(transaction.category);
      setAmount(transaction.amount.toFixed(2));
      setType(transaction.type);
      setDescription(transaction.description);
      setDate(moment(transaction.date, "MM/DD/YYYY"));
    }
  }, [transaction]);

  // if (!transaction) {
  //   return;
  // }

  return (
    <React.Fragment>
      <LocalizationProvider dateAdapter={AdapterMoment}>
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
              <Grid container spacing={0}>
                <Grid item xs={4}>
                  <InputLabel sx={{ color: "white" }}>Date</InputLabel>
                  <DatePicker
                    value={date}
                    onChange={(newDate) => setDate(newDate)}
                    sx={{
                      color: "white",
                      border: "1px solid white",
                      borderRadius: "5px",
                      "& input": {
                        height: "15px",
                        color: "white",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <InputLabel sx={{ color: "white" }}>Amount</InputLabel>
                  <TextField
                    variant="outlined"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography variant="h6" sx={{ color: "white" }}>
                            $
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      border: "1px solid white",
                      borderRadius: "5px",
                      "& input": {
                        height: "15px",
                        color: "white",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <InputLabel sx={{ color: "white" }}>Type</InputLabel>
                  <ToggleButtonGroup
                    color={type === "withdrawal" ? "error" : "success"}
                    value={type}
                    exclusive
                    onChange={(e) => setType(e.target.value)}
                    sx={{ height: "50px" }}
                  >
                    <ToggleButton
                      value="withdrawal"
                      style={{
                        border: "1px solid white",
                        color: type === "withdrawal" ? null : "#E0E0E0",
                      }}
                    >
                      Withdrawal
                    </ToggleButton>
                    <ToggleButton
                      value="deposit"
                      style={{
                        border: "1px solid white",
                        color: type === "deposit" ? null : "#E0E0E0",
                      }}
                    >
                      Deposit
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Grid>

                <Grid item xs={9} sx={{ marginTop: "15px" }}>
                  <InputLabel sx={{ color: "white" }}>Description</InputLabel>
                  <TextField
                    variant="outlined"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{
                      border: "1px solid white",
                      borderRadius: "5px",
                      "& input": {
                        height: "15px",
                        color: "white",
                      },
                      width: "85%",
                    }}
                  />
                </Grid>
                <Grid item xs={2} sx={{ marginTop: "15px" }}>
                  <InputLabel sx={{ color: "white" }}>Category</InputLabel>
                  <Select
                    onChange={(e) => setCategory(e.target.value)}
                    value={category}
                    sx={{
                      color: "white",
                      border: "1px solid white",
                      "& .MuiSelect-icon": {
                        color: "white",
                      },
                      height: "50px",
                    }}
                  >
                    {categories.map((cat) => (
                      <MenuItem value={cat} key={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                <Grid
                  item
                  xs={6}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Button
                    type="submit"
                    variant="outlined"
                    color="success"
                    sx={{
                      border: "2px solid",
                      width: "60%",
                      marginTop: "20px",
                    }}
                  >
                    Submit
                  </Button>
                </Grid>
                <Grid
                  item
                  xs={6}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Button
                    onClick={onClose}
                    variant="outlined"
                    color="error"
                    sx={{
                      border: "2px solid",
                      width: "60%",
                      marginTop: "20px",
                    }}
                  >
                    Exit
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Modal>
      </LocalizationProvider>
    </React.Fragment>
  );
}
