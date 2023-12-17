import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
} from "@mui/material";
import PageviewIcon from "@mui/icons-material/Pageview";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";

export default function HistoryTable({
  filteredHistory,
  page,
  rowsPerPage,
  setOpenReport,
  handleChangePage,
  handleDelete,
  handleChangeRowsPerPage,
  userHistory,
  comparePeriod,
  showPercents,
  generateComparativePeriod,
}) {
  return (
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
            <TableCell sx={{ color: "white", fontSize: "18px", width: "20%" }}>
              Date
            </TableCell>
            <TableCell sx={{ color: "white", fontSize: "18px", width: "20%" }}>
              Income
            </TableCell>
            <TableCell sx={{ color: "white", fontSize: "18px", width: "20%" }}>
              Spending
            </TableCell>
            <TableCell sx={{ color: "white", fontSize: "18px", width: "20%" }}>
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
              .filter((r) => r.index !== 0)
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const comparativeStats = generateComparativePeriod(
                  row,
                  filteredHistory,
                  comparePeriod,
                  showPercents
                );
                return (
                  <TableRow
                    key={index}
                    sx={{
                      borderBottom: "2px solid #5d5d5d",
                      backgroundColor: index % 2 !== 0 ? "#525252" : "#474747",
                    }}
                  >
                    <TableCell sx={{ color: "white" }}>
                      {moment(row.month_year, "MM-YYYY").format("MMMM YYYY")}
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
                            Math.abs(comparativeStats.spending.toFixed(2)) +
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
                            Math.abs(comparativeStats.savings.toFixed(2)) +
                            (showPercents ? "%" : "")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        component="label"
                        variant="contained"
                        sx={{ width: "25px", height: "30px" }}
                        onClick={() =>
                          setOpenReport({
                            ...row,
                            prevIncome: comparativeStats.income,
                            prevSpending: comparativeStats.spending,
                            prevSavings: comparativeStats.savings,
                          })
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
        count={userHistory?.length - 1 || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}
