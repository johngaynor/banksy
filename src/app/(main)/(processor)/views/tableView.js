import { useState } from "react";
import {
  Grid,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AddBoxIcon from "@mui/icons-material/AddBox";

import EditTransaction from "../components/editTransaction";
import { generateSummary } from "../components/processorFunctions";
import { useProcessorState } from "../context";
import { useGlobalState } from "@/app/components/context";

export default function TableView({ setFormStep }) {
  const { userViews, userCategories } = useGlobalState();
  const { data, setData } = useProcessorState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openEdit, setOpenEdit] = useState(false);
  const [editedTransaction, setEditedTransaction] = useState(null);
  const [showIgnore, setShowIgnore] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const editMode = (id) => {
    setEditedTransaction({ ...data[id], id });
    setOpenEdit(true);
  };

  const filteredData = data
    .map((row, index) => ({ ...row, index }))
    .filter((row) => showIgnore || row.category !== "ignore");

  const handleSubmit = () => {
    const summary = generateSummary(userViews, data, userCategories);
    setData(summary);
    setFormStep(3);
  };

  return (
    <>
      <Grid
        container
        spacing={1}
        sx={{
          display: "flex",
          alignItems: "center",
          marginTop: "30px",
          flexDirection: "column",
        }}
      >
        <Grid item sx={{ width: "90%", position: "relative" }}>
          <Grid container spacing={0}>
            <Grid
              item
              xs={4}
              sx={{
                display: "flex",
                alignItems: "flex-end",
                paddingBottom: "5px",
              }}
            >
              <Button
                onClick={() => setOpenEdit(true)}
                component="label"
                variant="contained"
                startIcon={<AddBoxIcon />}
                sx={{ marginTop: "20px" }}
              >
                New Transaction
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Typography
                variant="h3"
                sx={{
                  textAlign: "center",
                  marginBottom: "20px",
                  color: "white",
                }}
              >
                Transactions
              </Typography>
            </Grid>
            <Grid
              item
              xs={4}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
              }}
            >
              <FormGroup>
                <FormControlLabel
                  control={<Switch />}
                  label="Show Ignored?"
                  onChange={(e) => setShowIgnore(e.target.checked)}
                  sx={{ color: "white" }}
                />
              </FormGroup>
            </Grid>
          </Grid>
          <TableContainer
            component={Paper}
            sx={{
              backgroundColor: "#333",
              margin: "0 auto",
              border: "2px solid white",
            }}
          >
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ color: "white", fontSize: "18px", width: "10%" }}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontSize: "18px", width: "10%" }}
                  >
                    Amount
                  </TableCell>
                  <TableCell sx={{ color: "white", fontSize: "18px" }}>
                    Type
                  </TableCell>
                  <TableCell sx={{ color: "white", fontSize: "18px" }}>
                    Description
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontSize: "18px", width: "15%" }}
                  >
                    Category
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        borderBottom: "2px solid #5d5d5d",
                        backgroundColor:
                          index % 2 !== 0 ? "#525252" : "#474747",
                      }}
                    >
                      <TableCell sx={{ color: "white" }}>{row.date}</TableCell>
                      <TableCell sx={{ color: "white" }}>
                        ${row.amount.toFixed(2)}
                      </TableCell>
                      <TableCell
                        sx={{
                          color:
                            row.type === "withdrawal" ? "#D32E2E" : "#2E7D32",
                          fontWeight: "bold",
                        }}
                      >
                        {row.type}
                      </TableCell>
                      <TableCell sx={{ color: "white" }}>
                        {row.description}
                      </TableCell>
                      <TableCell sx={{ color: "white" }}>
                        {row.category}
                      </TableCell>
                      <TableCell>
                        <Button
                          component="label"
                          variant="contained"
                          sx={{ width: "25px", height: "30px" }}
                          onClick={() => editMode(row.index)}
                        >
                          <EditNoteIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            <TablePagination
              sx={{
                color: "white",
                "& .MuiSelect-icon": {
                  color: "white",
                },
              }}
              rowsPerPageOptions={[5, 25, 50]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
          <Grid
            container
            spacing={0}
            sx={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              onClick={() => handleSubmit()}
              component="label"
              variant="contained"
              color="success"
              startIcon={<AddBoxIcon />}
            >
              View Summary
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <EditTransaction
        openEdit={openEdit}
        setOpenEdit={setOpenEdit}
        transaction={editedTransaction}
        setTransaction={setEditedTransaction}
      />
    </>
  );
}
