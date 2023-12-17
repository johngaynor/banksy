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
  const [statsPeriod, setStatsPeriod] = useState(3);

  useEffect(() => {
    if (user && !userHistory && !historyLoading) {
      getHistory(setUserHistory, setHistoryLoading, addMsg, user.user_id);
    }
  }, [userHistory, user]);

  const categoryObj = userHistory
    ? generateCategoryObj(userHistory, setActiveCategory)
    : null;
  const categoryStats = categoryObj
    ? generateCategoryStats(categoryObj, activeCategory, statsPeriod)
    : null;

  console.log(categoryStats);

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
            <Button
              onClick={() =>
                alert("Sorry, this feature is not available yet. (PDF)")
              }
              component="label"
              variant="contained"
              sx={{ marginTop: "20px" }}
            >
              Category View
            </Button>
          </Grid>
          <Grid
            item
            xs={4}
            sx={{
              display: "flex",
              justifyContent: "center",
              backgroundColor: "red",
              //   alignItems: "flex-end",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              Categories (specific category)
            </Typography>
          </Grid>
          <Grid
            item
            xs={4}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
              backgroundColor: "blue",
            }}
          ></Grid>
        </Grid>
        <Grid
          container
          spacing={2}
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
              backgroundColor: "purple",
              display: "flex",
              flexWrap: "wrap",
              paddingRight: "10px",
            }}
          >
            <Grid container sx={{ backgroundColor: "aqua" }} spacing={2}>
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
                      Category Ranking
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
                      Average % of Income
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
                      Average % of Spending
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
            sx={{ backgroundColor: "beige", paddingLeft: "10px" }}
          ></Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
