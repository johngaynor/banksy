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
import ReportModal from "./components/ReportModal";

export default function History() {
  const {
    addMsg,
    userHistory,
    setUserHistory,
    historyLoading,
    setHistoryLoading,
    deleteHistoryLoading,
    setDeleteHistoryLoading,
    user,
  } = useGlobalState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showPercents, setShowPercents] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [comparePeriod, setComparePeriod] = useState(3);

  useEffect(() => {
    if (user && !userHistory && !historyLoading) {
      getHistory(setUserHistory, setHistoryLoading, addMsg, user.user_id);
    }
  }, [userHistory, user]);
  const handleDelete = async (date) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this report? This action cannot be undone."
    );

    if (isConfirmed) {
      await deleteHistory(date, addMsg, setDeleteHistoryLoading, user.user_id);
      await getHistory(setUserHistory, setHistoryLoading, addMsg, user.user_id);
    }
  };

  const handleChangePage = (e, newPage) => {
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
      savings: row.income - row.spending,
      index,
    }));

  const generateComparativePeriod = (currentRow) => {
    let prevIncome = 0;
    let prevSpending = 0;
    let prevSavings = 0;

    let validRows = 0;

    for (let i = 1; i <= comparePeriod; i++) {
      const row = filteredHistory[currentRow.index + i];
      if (row) {
        validRows += 1;
        prevIncome += row.income;
        prevSpending += row.spending;
        prevSavings += row.income - row.spending;
      }
    }

    prevIncome = validRows ? prevIncome / validRows : prevIncome;
    prevSpending = validRows ? prevSpending / validRows : prevSpending;
    prevSavings = validRows ? prevSavings / validRows : prevSavings;

    const income = validRows
      ? showPercents
        ? ((currentRow.income - prevIncome) / prevIncome) * 100
        : currentRow.income - prevIncome
      : 0;
    const spending = validRows
      ? showPercents
        ? ((currentRow.spending - prevSpending) / prevSpending) * 100
        : currentRow.spending - prevSpending
      : 0;
    const savings = validRows
      ? showPercents
        ? ((currentRow.savings - prevSavings) / prevSavings) * 100
        : currentRow.savings - prevSavings
      : 0;

    return { income, spending, savings };
    // return { prevIncome, prevSpending, prevSavings, income, spending, savings };
  };

  const viewReport = (report) => {
    setOpenReport(report);
  };

  if (historyLoading || deleteHistoryLoading) {
    return <CircularProgress />;
  }

  if (!user) {
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
        <h3>Please sign in to view history tab.</h3>
      </Box>
    );
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
      <ReportModal
        openReport={openReport ? true : false}
        setOpenReport={setOpenReport}
        report={openReport}
        userHistory={userHistory}
        showPercents={showPercents}
      />
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
                  alert("Sorry, this feature is not available yet. (PDF)")
                }
                component="label"
                variant="contained"
                sx={{ marginTop: "20px" }}
              >
                Yearly Summary
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
              rest content at the top
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
                {filteredHistory && filteredHistory.length !== 0 ? (
                  filteredHistory
                    .map((row, index) => ({ ...row, index }))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const comparativeStats = generateComparativePeriod(row);
                      // const {
                      //   prevIncome,
                      //   prevSpending,
                      //   prevSavings,
                      //   income,
                      //   spending,
                      //   savings,
                      // } = comparativeStats;
                      // console.log(
                      //   row.index,
                      //   "prev",
                      //   prevIncome,
                      //   "calc",
                      //   income
                      // );
                      return (
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
                                  comparativeStats.income === 0
                                    ? "white"
                                    : comparativeStats.income > 0
                                    ? "#2E7D32"
                                    : "#D32E2E",
                                fontWeight: "bold",
                                fontSize: "14px",
                              }}
                            >
                              {comparativeStats.income === 0
                                ? comparativeStats.income.toFixed(2)
                                : comparativeStats.income > 0
                                ? "+" +
                                  (showPercents ? "" : "$") +
                                  comparativeStats.income.toFixed(2) +
                                  (showPercents ? "%" : "")
                                : "-" +
                                  (showPercents ? "" : "$") +
                                  Math.abs(comparativeStats.income.toFixed(2)) +
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
                                  comparativeStats.spending === 0
                                    ? "white"
                                    : comparativeStats.spending < 0
                                    ? "#2E7D32"
                                    : "#D32E2E",
                                fontWeight: "bold",
                                fontSize: "14px",
                              }}
                            >
                              {comparativeStats.spending === 0
                                ? comparativeStats.spending.toFixed(2)
                                : comparativeStats.spending > 0
                                ? "+" +
                                  (showPercents ? "" : "$") +
                                  comparativeStats.spending.toFixed(2) +
                                  (showPercents ? "%" : "")
                                : "-" +
                                  (showPercents ? "" : "$") +
                                  Math.abs(
                                    comparativeStats.spending.toFixed(2)
                                  ) +
                                  (showPercents ? "%" : "")}
                            </span>
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            ${row.savings.toFixed(2)}
                            &nbsp;&nbsp;&nbsp;
                            <span
                              style={{
                                color:
                                  comparativeStats.savings === 0
                                    ? "white"
                                    : comparativeStats.savings > 0
                                    ? "#2E7D32"
                                    : "#D32E2E",
                                fontWeight: "bold",
                                fontSize: "14px",
                              }}
                            >
                              {comparativeStats.savings === 0
                                ? comparativeStats.savings.toFixed(2)
                                : comparativeStats.savings > 0
                                ? "+" +
                                  (showPercents ? "" : "$") +
                                  comparativeStats.savings.toFixed(2) +
                                  (showPercents ? "%" : "")
                                : "-" +
                                  (showPercents ? "" : "$") +
                                  Math.abs(
                                    comparativeStats.savings.toFixed(2)
                                  ) +
                                  (showPercents ? "%" : "")}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button
                              component="label"
                              variant="contained"
                              sx={{ width: "25px", height: "30px" }}
                              onClick={() => viewReport(row)}
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
                      );
                    })
                ) : (
                  <TableRow
                    sx={{
                      borderBottom: "2px solid #5d5d5d",
                    }}
                  >
                    <TableCell sx={{ color: "white" }}>
                      You have not submitted any reports yet.
                    </TableCell>
                  </TableRow>
                )}
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
          <Grid
            container
            spacing={0}
            sx={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "flex-end",
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
      </Grid>
    </Box>
  );
}
