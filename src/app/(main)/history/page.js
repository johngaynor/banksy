"use client";
import { useState, useEffect } from "react";
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
  Box,
  CircularProgress,
} from "@mui/material";
import PageviewIcon from "@mui/icons-material/Pageview";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";

import { getHistory, deleteHistory } from "./actions";
import { useGlobalState } from "@/app/components/context";

export default function History() {
  const {
    addMsg,
    userHistory,
    setUserHistory,
    historyLoading,
    setHistoryLoading,
    deleteHistoryLoading,
    setDeleteHistoryLoading,
  } = useGlobalState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showPercents, setShowPercents] = useState(true);

  useEffect(() => {
    if (!userHistory && !historyLoading) {
      getHistory(setUserHistory, setHistoryLoading, addMsg, 0);
    }
  }, [userHistory]);

  const handleDelete = async (date) => {
    await deleteHistory(0, date, addMsg, setDeleteHistoryLoading);
    getHistory(setUserHistory, setHistoryLoading, addMsg, 0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredHistory = userHistory
    ?.sort((a, b) => {
      const dateA = moment(a.month_year, "mm-yyyy").format("yyyymm");
      const dateB = moment(b.month_year, "mm-yyyy").format("yyyymm");
      return dateB - dateA;
    })
    .map((row, index) => ({
      ...row,
      index,
      prevIncome: userHistory[index + 1]
        ? showPercents
          ? ((row.income - userHistory[index + 1].income) /
              userHistory[index + 1].income) *
            100
          : row.income - userHistory[index + 1].income
        : 0,
      prevSpending: userHistory[index + 1]
        ? showPercents
          ? ((row.spending - userHistory[index + 1].spending) /
              userHistory[index + 1].spending) *
            100
          : row.spending - userHistory[index + 1].spending
        : 0,
      prevSavings: userHistory[index + 1]
        ? showPercents
          ? ((row.savings - userHistory[index + 1].savings) /
              userHistory[index + 1].savings) *
            100
          : row.savings - userHistory[index + 1].savings
        : 0,
    }));

  if (historyLoading || deleteHistoryLoading) {
    return <CircularProgress />;
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        padding: 4,
        backgroundColor: "#121212",
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
                onClick={() =>
                  alert("Sorry, this feature is not available yet.")
                }
                component="label"
                variant="contained"
                // startIcon={<AddBoxIcon />}
                sx={{ marginTop: "20px" }}
              >
                Export PDF
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Typography
                variant="h3"
                sx={{ textAlign: "center", marginBottom: "20px" }}
              >
                History
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
                  control={<Switch checked={showPercents} />}
                  label="Show percents?"
                  onChange={(e) => setShowPercents(e.target.checked)}
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
                    sx={{ color: "white", fontSize: "18px", width: "20%" }}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontSize: "18px", width: "20%" }}
                  >
                    Income
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontSize: "18px", width: "20%" }}
                  >
                    Spending
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontSize: "18px", width: "20%" }}
                  >
                    Savings
                  </TableCell>
                  <TableCell sx={{ width: "5%" }}></TableCell>
                  <TableCell sx={{ width: "5%" }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredHistory
                  ? filteredHistory
                      .map((row, index) => ({ ...row, index }))
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            borderBottom: "2px solid #5d5d5d",
                            backgroundColor:
                              index % 2 !== 0 ? "#525252" : "#474747",
                          }}
                        >
                          <TableCell sx={{ color: "white" }}>
                            {moment(row.month_year, "MM-YYYY").format(
                              "MMMM YYYY"
                            )}
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            ${row.income.toFixed(2)}&nbsp;&nbsp;&nbsp;
                            <span
                              style={{
                                color:
                                  row.prevIncome === 0
                                    ? "white"
                                    : row.prevIncome > 0
                                    ? "#2E7D32"
                                    : "#D32E2E",
                                fontWeight: "bold",
                                fontSize: "14px",
                              }}
                            >
                              {row.prevIncome === 0
                                ? row.prevIncome.toFixed(2)
                                : row.prevIncome > 0
                                ? "+" +
                                  (showPercents ? "" : "$") +
                                  row.prevIncome.toFixed(2) +
                                  (showPercents ? "%" : "")
                                : "-" +
                                  (showPercents ? "" : "$") +
                                  Math.abs(row.prevIncome.toFixed(2)) +
                                  (showPercents ? "%" : "")}
                            </span>
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "white",
                            }}
                          >
                            ${row.spending.toFixed(2)}&nbsp;&nbsp;&nbsp;
                            <span
                              style={{
                                color:
                                  row.prevSpending === 0
                                    ? "white"
                                    : row.prevSpending < 0
                                    ? "#2E7D32"
                                    : "#D32E2E",
                                fontWeight: "bold",
                                fontSize: "14px",
                              }}
                            >
                              {row.prevSpending === 0
                                ? row.prevSpending.toFixed(2)
                                : row.prevSpending > 0
                                ? "+" +
                                  (showPercents ? "" : "$") +
                                  row.prevSpending.toFixed(2) +
                                  (showPercents ? "%" : "")
                                : "-" +
                                  (showPercents ? "" : "$") +
                                  Math.abs(row.prevSpending.toFixed(2)) +
                                  (showPercents ? "%" : "")}
                            </span>
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            ${row.savings.toFixed(2)}&nbsp;&nbsp;&nbsp;
                            <span
                              style={{
                                color:
                                  row.prevSavings === 0
                                    ? "white"
                                    : row.prevSavings > 0
                                    ? "#2E7D32"
                                    : "#D32E2E",
                                fontWeight: "bold",
                                fontSize: "14px",
                              }}
                            >
                              {row.prevSavings === 0
                                ? row.prevSavings.toFixed(2)
                                : row.prevSavings > 0
                                ? "+" +
                                  (showPercents ? "" : "$") +
                                  row.prevSavings.toFixed(2) +
                                  (showPercents ? "%" : "")
                                : "-" +
                                  (showPercents ? "" : "$") +
                                  Math.abs(row.prevSavings.toFixed(2)) +
                                  (showPercents ? "%" : "")}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button
                              component="label"
                              variant="contained"
                              sx={{ width: "25px", height: "30px" }}
                              onClick={() =>
                                alert(
                                  "Sorry, this feature is not available yet."
                                )
                              }
                            >
                              <PageviewIcon />
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button
                              component="label"
                              variant="contained"
                              color="error"
                              sx={{ width: "25px", height: "30px" }}
                              onClick={() => handleDelete(row.month_year)}
                            >
                              <DeleteIcon />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  : null}
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
              count={userHistory?.length || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
}
