"use client";

import React, { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

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
            <Button type="submit">Submit</Button>
          </form>

          <Button onClick={onClose}>Cancel</Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
}
