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
import moment from "moment";

import { getHistory } from "./actions";
import { useGlobalState } from "@/app/components/context";
import { width } from "@mui/system";

export default function History() {
  const {
    addMsg,
    userHistory,
    setUserHistory,
    historyLoading,
    setHistoryLoading,
  } = useGlobalState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    if (!userHistory && !historyLoading) {
      getHistory(setUserHistory, setHistoryLoading, addMsg, 0);
    }
  }, [userHistory]);

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
        ? row.income - userHistory[index + 1].income
        : 0,
      prevSpending: userHistory[index + 1]
        ? userHistory[index + 1].spending
        : 0,
      prevSavings: userHistory[index + 1] ? userHistory[index + 1].savings : 0,
    }));

  if (historyLoading) {
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
                // onClick={() => setOpenEdit(true)}
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
                  control={<Switch />}
                  label="Show difference?"
                  //   onChange={(e) => setShowIgnore(e.target.checked)}
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
                    sx={{ color: "white", fontSize: "18px", width: "30%" }}
                  >
                    Date
                  </TableCell>
                  <TableCell sx={{ color: "white", fontSize: "18px" }}>
                    Income
                  </TableCell>
                  <TableCell sx={{ color: "white", fontSize: "18px" }}>
                    Spending
                  </TableCell>
                  <TableCell sx={{ color: "white", fontSize: "18px" }}>
                    Savings
                  </TableCell>
                  <TableCell></TableCell>
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
                            {row.month_year}
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            ${row.income.toFixed(2)}{" "}
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
                                ? "+$" + row.prevIncome.toFixed(2)
                                : "-$" + Math.abs(row.prevIncome.toFixed(2))}
                            </span>
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "white",
                            }}
                          >
                            ${row.spending.toFixed(2)}
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            ${row.savings.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Button
                              component="label"
                              variant="contained"
                              sx={{ width: "25px", height: "30px" }}
                              onClick={() => console.log("hi")}
                            >
                              {/* <EditNoteIcon /> */}
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
              count={userHistory?.length}
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
