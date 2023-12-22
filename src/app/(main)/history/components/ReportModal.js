import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";

export default function ReportModal({
  openReport,
  setOpenReport,
  report,
  showPercents,
  userHistory,
  handleDelete,
}) {
  const onClose = () => {
    setOpenReport(false);
  };

  const prevReport = userHistory ? userHistory[report.index + 1] : null;

  if (report) {
    return (
      <React.Fragment>
        <Dialog open={openReport} onClose={onClose}>
          <DialogTitle
            sx={{
              backgroundColor: "#121212",
              width: "600px",
              textAlign: "center",
              color: "white",
            }}
          >
            Report for{" "}
            {moment(report.month_year, "MM-YYYY").format("MMMM YYYY")}
          </DialogTitle>
          <DialogContent sx={{ backgroundColor: "#121212" }}>
            <Grid sx={{ display: "flex", justifyContent: "space-evenly" }}>
              <Grid item xs={3}>
                <Card sx={{ backgroundColor: "#242424" }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ color: "white" }}>
                      Income
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ color: "white", marginTop: "5px" }}
                    >
                      ${report.income?.toFixed(2)}
                    </Typography>
                    <span
                      style={{
                        color:
                          report.prevIncome === 0
                            ? "white"
                            : report.prevIncome < 0
                            ? "#D32E2E"
                            : "#2E7D32",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      {report.prevIncome === 0
                        ? report.prevIncome.toFixed(2)
                        : report.prevIncome > 0
                        ? "+" +
                          (showPercents ? "" : "$") +
                          report.prevIncome.toFixed(2) +
                          (showPercents ? "%" : "")
                        : "-" +
                          (showPercents ? "" : "$") +
                          Math.abs(report.prevIncome?.toFixed(2)) +
                          (showPercents ? "%" : "")}
                    </span>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card sx={{ backgroundColor: "#242424" }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ color: "white" }}>
                      Spending
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ color: "white", marginTop: "5px" }}
                    >
                      ${report.spending?.toFixed(2)}
                    </Typography>
                    <span
                      style={{
                        color:
                          report.prevSpending === 0
                            ? "white"
                            : report.prevSpending < 0
                            ? "#2E7D32"
                            : "#D32E2E",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      {report.prevSpending === 0
                        ? report.prevSpending.toFixed(2)
                        : report.prevSpending > 0
                        ? "+" +
                          (showPercents ? "" : "$") +
                          report.prevSpending.toFixed(2) +
                          (showPercents ? "%" : "")
                        : "-" +
                          (showPercents ? "" : "$") +
                          Math.abs(report.prevSpending?.toFixed(2)) +
                          (showPercents ? "%" : "")}
                    </span>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card sx={{ backgroundColor: "#242424" }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ color: "white" }}>
                      Savings
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ color: "white", marginTop: "5px" }}
                    >
                      ${report.savings?.toFixed(2)}
                    </Typography>
                    <span
                      style={{
                        color:
                          report.prevSavings === 0
                            ? "white"
                            : report.prevSavings < 0
                            ? "#D32E2E"
                            : "#2E7D32",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      {report.prevSavings === 0
                        ? report.prevSavings.toFixed(2)
                        : report.prevSavings > 0
                        ? "+" +
                          (showPercents ? "" : "$") +
                          report.prevSavings.toFixed(2) +
                          (showPercents ? "%" : "")
                        : "-" +
                          (showPercents ? "" : "$") +
                          Math.abs(report.prevSavings?.toFixed(2)) +
                          (showPercents ? "%" : "")}
                    </span>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Typography
              variant="h6"
              sx={{ color: "white", padding: "10px", textAlign: "center" }}
            >
              Categories:
            </Typography>
            <Grid
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                width: "100%",
              }}
            >
              <Grid item sx={{ width: "40%" }}>
                <List sx={{ color: "white", backgroundColor: "#242424" }}>
                  {report.categories
                    ?.slice(0, Math.floor(report.categories.length / 2))
                    .map((cat, index) => {
                      const prevCategoryAmt = prevReport?.categories.find(
                        (r) => r.category_name == cat.category_name
                      )?.value;
                      const diff = prevCategoryAmt
                        ? cat.value - prevCategoryAmt
                        : 0;
                      return (
                        <ListItem sx={{ marginBottom: "-10px" }} key={index}>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1">
                                {cat.category_name}: ${cat.value.toFixed(2)}
                              </Typography>
                            }
                            secondary={
                              <span
                                style={{
                                  color:
                                    diff === 0
                                      ? "white"
                                      : diff < 0
                                      ? "#2E7D32"
                                      : "#D32E2E",
                                  fontWeight: "bold",
                                  fontSize: "14px",
                                }}
                              >
                                {diff === 0
                                  ? diff.toFixed(2)
                                  : diff > 0
                                  ? "+" +
                                    (showPercents ? "" : "$") +
                                    diff.toFixed(2) +
                                    (showPercents ? "%" : "")
                                  : "-" +
                                    (showPercents ? "" : "$") +
                                    Math.abs(diff?.toFixed(2)) +
                                    (showPercents ? "%" : "")}
                              </span>
                            }
                          />
                        </ListItem>
                      );
                    })}
                </List>
              </Grid>
              <Grid item sx={{ width: "40%" }}>
                <List sx={{ color: "white", backgroundColor: "#242424" }}>
                  {report.categories
                    ?.slice(Math.floor(report.categories.length / 2))
                    .map((cat, index) => {
                      const prevCategoryAmt = prevReport?.categories.find(
                        (r) => r.category_name == cat.category_name
                      )?.value;
                      const diff = prevCategoryAmt
                        ? cat.value - prevCategoryAmt
                        : 0;
                      return (
                        <ListItem sx={{ marginBottom: "-10px" }} key={index}>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1">
                                {cat.category_name}: ${cat.value.toFixed(2)}
                              </Typography>
                            }
                            secondary={
                              <span
                                style={{
                                  color:
                                    diff === 0
                                      ? "white"
                                      : diff < 0
                                      ? "#2E7D32"
                                      : "#D32E2E",
                                  fontWeight: "bold",
                                  fontSize: "14px",
                                }}
                              >
                                {diff === 0
                                  ? diff.toFixed(2)
                                  : diff > 0
                                  ? "+" +
                                    (showPercents ? "" : "$") +
                                    diff.toFixed(2) +
                                    (showPercents ? "%" : "")
                                  : "-" +
                                    (showPercents ? "" : "$") +
                                    Math.abs(diff?.toFixed(2)) +
                                    (showPercents ? "%" : "")}
                              </span>
                            }
                          />
                        </ListItem>
                      );
                    })}
                </List>
              </Grid>
            </Grid>
            <Typography
              variant="subtitle1"
              sx={{
                color: "white",
                textAlign: "center",
                paddingTop: "20px",
              }}
            >
              Categories are compared to last month.
            </Typography>
          </DialogContent>
          <DialogActions
            sx={{
              backgroundColor: "#121212",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              component="label"
              variant="contained"
              color="error"
              sx={{ width: "25px", height: "30px" }}
              onClick={() => handleDelete(report.month_year)}
            >
              <DeleteIcon />
            </Button>
            <Button onClick={onClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}
