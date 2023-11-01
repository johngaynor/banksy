import { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import EditNoteIcon from "@mui/icons-material/EditNote";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import AddBoxIcon from "@mui/icons-material/AddBox";

import { useProcessorState } from "../context";
import EditTransaction from "./editTransaction";

export default function TableView() {
  const { data, setFormStep, setSummaryViews } = useProcessorState();
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

  const handleFinishTable = () => {
    const testViews = [
      {
        name: "default",
        aggregate: false,
        categories: [
          "gas",
          "grocery",
          "leisure",
          "miscellaneous",
          "recFood",
          "rent",
          "school",
          "travel",
          "income",
        ],
      },
      {
        name: "macros",
        aggregate: true,
        categories: [
          {
            name: "needs",
            aggregate: ["gas", "grocery", "rent", "school", "travel"],
          },
          {
            name: "wants",
            aggregate: ["leisure", "miscellaneous", "recFood"],
          },
        ],
      },
    ];
    setSummaryViews(testViews);
    setFormStep(3);
  };

  const filteredData = data
    .map((row, index) => ({ ...row, index }))
    .filter((row) => showIgnore || row.category !== "ignore");

  return (
    <Box
      sx={{
        flexGrow: 1,
        padding: 4,
        backgroundColor: "#242424",
        minHeight: "100vh",
        display: "flex",
      }}
    >
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
              >
                New Transaction
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Typography
                variant="h3"
                sx={{ textAlign: "center", marginBottom: "20px" }}
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
          <Button
            onClick={handleFinishTable}
            component="label"
            variant="contained"
            startIcon={<AddBoxIcon />}
          >
            View Summary
          </Button>
        </Grid>
      </Grid>
      <EditTransaction
        openEdit={openEdit}
        setOpenEdit={setOpenEdit}
        transaction={editedTransaction}
        setTransaction={setEditedTransaction}
      />
    </Box>
  );
}
