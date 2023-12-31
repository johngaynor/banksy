"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Grid,
  Typography,
  Button,
  Select,
  FormGroup,
  FormControlLabel,
  Switch,
  Box,
  MenuItem,
} from "@mui/material";
import PageviewIcon from "@mui/icons-material/Pageview";
import moment from "moment";

import { getHistory, deleteHistory } from "./actions";
import { generateComparativePeriod } from "./components/HistoryFunctions";
import Spinner from "@/app/components/spinner";
import { useGlobalState } from "@/app/components/context";
import ReportModal from "./components/ReportModal";
import StatisticsHeader from "./components/StatisticsHeader";
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

  const headerStatistics =
    filteredHistory && filteredHistory.length !== 0
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
    return (
      <Box
        sx={{
          flexGrow: 1,
          padding: 4,
          backgroundColor: "#121212",
          minHeight: "100vh",
          display: "flex",
          color: "white",
        }}
      >
        <Spinner />
        <h3>History is loading...</h3>
      </Box>
    );
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
          color: "white",
        }}
      >
        <h3>Please sign in to view history tab.</h3>
      </Box>
    );
  }

  if (!filteredHistory || filteredHistory.length === 0) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          padding: 4,
          backgroundColor: "#121212",
          minHeight: "100vh",
          display: "flex",
          color: "white",
        }}
      >
        <h3>You have not submitted any reports.</h3>
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
        justifyContent: "center",
        color: "white",
      }}
    >
      <ReportModal
        openReport={openReport ? true : false}
        setOpenReport={setOpenReport}
        report={openReport}
        userHistory={userHistory}
        showPercents={showPercents}
        handleDelete={handleDelete}
      />

      <Grid item sx={{ width: "90%" }}>
        <Grid container>
          <Grid
            item
            xs={4}
            sx={{
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <Link href="/history/categories">
              <Button
                component="label"
                variant="contained"
                sx={{ marginTop: "20px" }}
              >
                Category View
              </Button>
            </Link>
          </Grid>
          <Grid
            item
            xs={4}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              {filteredHistory
                ? moment(filteredHistory[0].month_year, "MM-YYYY").format(
                    "MMMM YYYY"
                  )
                : null}
              <Button
                component="label"
                variant="contained"
                sx={{ width: "25px", height: "30px", marginLeft: "10px" }}
                onClick={() =>
                  setOpenReport({
                    ...filteredHistory[0],
                    prevIncome: headerStatistics.income,
                    prevSpending: headerStatistics.spending,
                    prevSavings: headerStatistics.savings,
                  })
                }
              >
                <PageviewIcon />
              </Button>
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
          <StatisticsHeader
            filteredHistory={filteredHistory}
            headerStatistics={headerStatistics}
            showPercents={showPercents}
          />
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
    </Box>
  );
}
