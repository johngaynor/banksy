"use client";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";
import {
  Grid,
  Typography,
  Button,
  Select,
  FormGroup,
  FormControlLabel,
  Switch,
  InputLabel,
  Box,
  CircularProgress,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material";
import moment from "moment";

import { useGlobalState } from "@/app/components/context";
import { getHistory } from "../actions";
import {
  generateCategoryObj,
  generateCategoryStats,
} from "../components/HistoryFunctions";

export default function CategoryView() {
  const {
    addMsg,
    userHistory,
    setUserHistory,
    historyLoading,
    setHistoryLoading,
    user,
  } = useGlobalState();
  const [activeCategory, setActiveCategory] = useState(null);
  const [statsPeriod, setStatsPeriod] = useState(6);

  useEffect(() => {
    if (user && !userHistory && !historyLoading) {
      getHistory(setUserHistory, setHistoryLoading, addMsg, user.user_id);
    }
  }, [userHistory, user]);

  const categoryObj = userHistory ? generateCategoryObj(userHistory) : null;
  //   const categoryObj = null;

  console.log(categoryObj);

  useEffect(() => {
    if (!activeCategory && categoryObj) {
      setActiveCategory(Object.keys(categoryObj)[0]);
    }
  }, [categoryObj]);

  const categoryStats = categoryObj
    ? generateCategoryStats(categoryObj, activeCategory, statsPeriod, 0)
    : null;

  const tableData = activeCategory
    ? categoryObj[activeCategory]
        .slice(0, statsPeriod)
        .sort((a, b) => {
          const dateA = moment(a.date, "mm-yyyy").format("yyyymm");
          const dateB = moment(b.date, "mm-yyyy").format("yyyymm");
          return dateA - dateB;
        })
        .map((a) => ({
          ...a,
          date: moment(a.date, "MM-YYYY").format("MMM YY"),
          amount: a.value,
        }))
    : null;
  //   console.log(tableData);

  const statsPeriodOptions = [
    { text: "Last 3 Months", value: 3 },
    { text: "Last 6 Months", value: 6 },
    { text: "Last Year", value: 12 },
  ];

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
        <h3>Please sign in to view categories tab.</h3>
      </Box>
    );
  }

  if (historyLoading || !categoryStats) {
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
        justifyContent: "center",
      }}
    >
      <Grid
        item
        sx={{
          width: "90%",
        }}
      >
        <Grid container>
          <Grid
            item
            xs={4}
            sx={{
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <Box>
              <InputLabel htmlFor="select-category" sx={{ color: "white" }}>
                Category:
              </InputLabel>
              <Select
                id="select-category"
                onChange={(e) => setActiveCategory(e.target.value)}
                value={activeCategory ?? Object.keys(categoryObj)[0]}
                sx={{
                  color: "white",
                  border: "1px solid white",
                  width: "200px",
                  "& .MuiSelect-icon": {
                    color: "white",
                  },
                  height: "40px",
                }}
              >
                {Object.keys(categoryObj).map((o, index) => (
                  <MenuItem key={index} value={o}>
                    {o}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box sx={{ margin: "0 10px" }}>
              <InputLabel htmlFor="select-stats-period" sx={{ color: "white" }}>
                Time Period*:
              </InputLabel>
              <Select
                id="select-stats-period"
                onChange={(e) => setStatsPeriod(e.target.value)}
                value={statsPeriod}
                sx={{
                  color: "white",
                  border: "1px solid white",
                  "& .MuiSelect-icon": {
                    color: "white",
                  },
                  height: "40px",
                }}
              >
                {statsPeriodOptions.map((o, index) => (
                  <MenuItem key={index} value={o.value}>
                    {o.text}
                  </MenuItem>
                ))}
              </Select>
            </Box>
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
            <Typography variant="h4">Category Statistics</Typography>
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
            <Link href="/history">
              <Button
                component="label"
                variant="contained"
                sx={{ marginTop: "20px" }}
              >
                View History
              </Button>
            </Link>
          </Grid>
        </Grid>
        {/* this starts the main content for the stats */}
        <Grid
          container
          sx={{
            padding: "20px 0",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              flexWrap: "wrap",
              paddingRight: "20px",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card
                  sx={{ backgroundColor: "#242424", border: "2px solid white" }}
                >
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ color: "white" }}>
                      3 Month Average
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{ color: "white", marginTop: "5px" }}
                    >
                      ${categoryStats.avg3.toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card
                  sx={{ backgroundColor: "#242424", border: "2px solid white" }}
                >
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ color: "white" }}>
                      6 Month Average
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{ color: "white", marginTop: "5px" }}
                    >
                      ${categoryStats.avg6.toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card
                  sx={{ backgroundColor: "#242424", border: "2px solid white" }}
                >
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ color: "white" }}>
                      1 Year Average
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{ color: "white", marginTop: "5px" }}
                    >
                      ${categoryStats.avg12.toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card
                  sx={{ backgroundColor: "#242424", border: "2px solid white" }}
                >
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ color: "white" }}>
                      Category Ranking*
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                      <Typography
                        variant="h3"
                        sx={{ color: "white", marginTop: "5px" }}
                      >
                        #{categoryStats.rank}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ color: "white", marginBottom: "3px" }}
                      >
                        /{categoryStats.maxRank}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card
                  sx={{ backgroundColor: "#242424", border: "2px solid white" }}
                >
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ color: "white" }}>
                      Average % of Income*
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{ color: "white", marginTop: "5px" }}
                    >
                      {categoryStats.avgIncome.toFixed(2)}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card
                  sx={{ backgroundColor: "#242424", border: "2px solid white" }}
                >
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ color: "white" }}>
                      Average % of Spending*
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{ color: "white", marginTop: "5px" }}
                    >
                      {categoryStats.avgSpending.toFixed(2)}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              border: "2px solid white",
              borderRadius: "3px",
              backgroundColor: "#242424",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ color: "white", padding: "15px 0 5px 30px" }}
            >
              {activeCategory?.charAt(0).toUpperCase() +
                activeCategory?.slice(1)}{" "}
              Spending over{" "}
              {statsPeriodOptions.find((r) => r.value === statsPeriod).text}
            </Typography>
            <ResponsiveContainer
              width="95%"
              height="80%"
              style={{ padding: "10px" }}
            >
              <LineChart
                width={500}
                height={300}
                data={tableData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
                style={{ color: "white" }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fill: "white" }} />
                <YAxis tick={{ fill: "white" }} />
                <Tooltip />
                <Legend wrapperStyle={{ color: "white" }} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  strokeWidth={3}
                />
                {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
              </LineChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>
        <Grid container>
          <Grid
            item
            xs={12}
            sx={{
              backgroundColor: "#242424",
              border: "2px solid white",
              borderRadius: "3px",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ color: "white", padding: "15px 0 5px 30px" }}
            >
              {activeCategory?.charAt(0).toUpperCase() +
                activeCategory?.slice(1)}{" "}
              3, 6, 12 Rolling Averages over{" "}
              {statsPeriodOptions.find((r) => r.value === statsPeriod).text}
            </Typography>
            <ResponsiveContainer
              width="95%"
              height="80%"
              style={{ padding: "10px" }}
            >
              <LineChart
                width={500}
                height={300}
                data={tableData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
                style={{ color: "white" }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fill: "white" }} />
                <YAxis tick={{ fill: "white" }} />
                <Tooltip />
                <Legend wrapperStyle={{ color: "white" }} />
                <Line
                  type="monotone"
                  dataKey="avg3"
                  stroke="#ea515f"
                  activeDot={{ r: 8 }}
                  strokeWidth={3}
                />
                <Line
                  type="monotone"
                  dataKey="avg6"
                  stroke="#82ca9d"
                  activeDot={{ r: 8 }}
                  strokeWidth={3}
                />
                <Line
                  type="monotone"
                  dataKey="avg12"
                  stroke="#ffc658"
                  activeDot={{ r: 8 }}
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
