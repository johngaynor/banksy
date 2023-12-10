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
  Box,
} from "@mui/material";
import moment from "moment";

export default function ReportModal({
  openReport,
  setOpenReport,
  report,
  userHistory,
}) {
  const onClose = () => {
    setOpenReport(false);
  };

  //   console.log(report);
  const prevReport = userHistory ? userHistory[report.index + 1] : null;
  console.log(prevReport);

  return (
    <React.Fragment>
      <Dialog open={openReport} onClose={onClose}>
        <DialogTitle sx={{ backgroundColor: "red", width: "600px" }}>
          Report for {moment(report.month_year, "MM-YYYY").format("MMMM YYYY")}
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "#121212" }}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Card sx={{ backgroundColor: "#242424" }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ color: "white" }}>
                    Income
                  </Typography>
                  <Box
                    container
                    sx={{
                      display: "flex",
                      alignItems: "flex-end",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ color: "white", marginTop: "5px" }}
                    >
                      ${report.income}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={3}>
              <Card sx={{ backgroundColor: "#242424" }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ color: "white" }}>
                    Spending
                  </Typography>
                  <Box
                    container
                    sx={{
                      display: "flex",
                      alignItems: "flex-end",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ color: "white", marginTop: "5px" }}
                    >
                      ${report.spending}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={3}>
              <Card sx={{ backgroundColor: "#242424" }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ color: "white" }}>
                    Savings
                  </Typography>
                  <Box
                    container
                    sx={{
                      display: "flex",
                      alignItems: "flex-end",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ color: "white", marginTop: "5px" }}
                    >
                      ${(report.income - report.spending).toFixed(2)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
