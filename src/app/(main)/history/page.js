"use client";
import { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Button,
  Select,
  FormGroup,
  FormControlLabel,
  Switch,
  Box,
  CircularProgress,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material";
import moment from "moment";

import { getHistory, deleteHistory } from "./actions";
import { generateComparativePeriod } from "./components/HistoryFunctions";
import { useGlobalState } from "@/app/components/context";
import ReportModal from "./components/ReportModal";
import HistoryTable from "./components/HistoryTable";

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
  const [comparePeriod, setComparePeriod] = useState(1);

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

  const headerStatistics = filteredHistory
    ? generateComparativePeriod(
        filteredHistory[0],
        filteredHistory,
        comparePeriod,
        showPercents
      )
    : null;

  const comparePeriodOptions = [
    { text: "Last Month", value: 1 },
    { text: "Last 3 Months", value: 3 },
    { text: "Last 6 Months", value: 6 },
    { text: "Last Year", value: 12 },
  ];

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
          <Grid container>
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
                variant="h4"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "15px",
                }}
              >
                {filteredHistory
                  ? moment(filteredHistory[0].month_year, "MM-YYYY").format(
                      "MMMM YYYY"
                    )
                  : null}
              </Typography>
            </Grid>
            <Grid
              item
              xs={4}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                marginBottom: "-10px",
              }}
            >
              <Typography variant="subtitle1" sx={{ marginRight: "10px" }}>
                Compare Period:
              </Typography>
              <Select
                onChange={(e) => setComparePeriod(e.target.value)}
                value={comparePeriod}
                sx={{
                  color: "white",
                  border: "1px solid white",
                  "& .MuiSelect-icon": {
                    color: "white",
                  },
                  height: "40px",
                }}
              >
                {comparePeriodOptions.map((o, index) => (
                  <MenuItem key={index} value={o.value}>
                    {o.text}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
          {filteredHistory ? (
            <Grid
              container
              spacing={2}
              sx={{
                padding: "20px 0",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Grid item xs={3}>
                <Card
                  sx={{ backgroundColor: "#242424", border: "2px solid white" }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ color: "white" }}>
                      Income
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-end",
                      }}
                    >
                      <Typography
                        variant="h3"
                        sx={{ color: "white", marginTop: "5px" }}
                      >
                        ${filteredHistory[0].income.toFixed(2)}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color:
                            headerStatistics.income > 0 ? "#2E7D32" : "#D32E2E",

                          margin: "0 0 4px 10px",
                        }}
                      >
                        {headerStatistics.income > 0 ? "+" : ""}
                        {showPercents ? "" : "$"}
                        {headerStatistics.income.toFixed(2)}
                        {showPercents ? "%" : ""}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card
                  sx={{ backgroundColor: "#242424", border: "2px solid white" }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ color: "white" }}>
                      Spending
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-end",
                      }}
                    >
                      <Typography
                        variant="h3"
                        sx={{ color: "white", marginTop: "5px" }}
                      >
                        ${filteredHistory[0].spending.toFixed(2)}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color:
                            headerStatistics.spending > 0
                              ? "#D32E2E"
                              : "#2E7D32",

                          margin: "0 0 4px 10px",
                        }}
                      >
                        {headerStatistics.spending > 0 ? "+" : "-"}
                        {showPercents ? "" : "$"}
                        {headerStatistics.spending.toFixed(2)}
                        {showPercents ? "%" : ""}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card
                  sx={{ backgroundColor: "#242424", border: "2px solid white" }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ color: "white" }}>
                      Savings
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-end",
                      }}
                    >
                      <Typography
                        variant="h3"
                        sx={{ color: "white", marginTop: "5px" }}
                      >
                        ${filteredHistory[0].savings.toFixed(2)}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color:
                            headerStatistics.savings > 0
                              ? "#2E7D32"
                              : "#D32E2E",

                          margin: "0 0 4px 10px",
                        }}
                      >
                        {headerStatistics.savings > 0 ? "+" : ""}
                        {showPercents ? "" : "$"}
                        {headerStatistics.savings.toFixed(2)}
                        {showPercents ? "%" : ""}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card
                  sx={{ backgroundColor: "#242424", border: "2px solid white" }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ color: "white" }}>
                      % of Income Saved
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-end",
                      }}
                    >
                      <Typography
                        variant="h3"
                        sx={{ color: "white", marginTop: "5px" }}
                      >
                        {(
                          (filteredHistory[0].savings /
                            filteredHistory[0].income) *
                          100
                        ).toFixed(2)}
                        %
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color:
                            (
                              (filteredHistory[0].savings /
                                filteredHistory[0].income) *
                              100
                            ).toFixed(2) < 15
                              ? "#D32E2E"
                              : "#2E7D32",

                          margin: "0 0 4px 10px",
                        }}
                      >
                        Target: 15%
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          ) : null}

          <HistoryTable
            filteredHistory={filteredHistory}
            page={page}
            rowsPerPage={rowsPerPage}
            setOpenReport={setOpenReport}
            handleChangePage={handleChangePage}
            handleDelete={handleDelete}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            userHistory={userHistory}
            comparePeriod={comparePeriod}
            showPercents={showPercents}
            generateComparativePeriod={generateComparativePeriod}
          />

          <Grid
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
