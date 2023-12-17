import { Grid, Typography, Box, Card, CardContent } from "@mui/material";

export default function StatisticsHeader({
  filteredHistory,
  headerStatistics,
  showPercents,
}) {
  return (
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
        <Card sx={{ backgroundColor: "#242424", border: "2px solid white" }}>
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
                  color: headerStatistics.income > 0 ? "#2E7D32" : "#D32E2E",

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
        <Card sx={{ backgroundColor: "#242424", border: "2px solid white" }}>
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
                  color: headerStatistics.spending > 0 ? "#D32E2E" : "#2E7D32",

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
        <Card sx={{ backgroundColor: "#242424", border: "2px solid white" }}>
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
                  color: headerStatistics.savings > 0 ? "#2E7D32" : "#D32E2E",

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
        <Card sx={{ backgroundColor: "#242424", border: "2px solid white" }}>
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
                  (filteredHistory[0].savings / filteredHistory[0].income) *
                  100
                ).toFixed(2)}
                %
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color:
                    (
                      (filteredHistory[0].savings / filteredHistory[0].income) *
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
  );
}
