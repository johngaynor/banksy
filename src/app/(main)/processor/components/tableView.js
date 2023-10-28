import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";

import { useProcessorState } from "../context";

const testData = [
  {
    amount: "202.12",
    category: "10",
    date: "08/16/2023",
    description:
      "this is a long description that could get longer. If it does get longer, what is going to happen? it doesn't seem to be getting any shorter, and even if it edoes htw hwet uht ewuhtewi hrewh rewiuh h ",
    type: "deposit",
  },
  {
    amount: "202.12",
    category: "10",
    date: "08/16/2023",
    description: "this is a long de ",
    type: "deposit",
  },
  {
    amount: "202.12",
    category: "10",
    date: "08/16/2023",
    description:
      "this is a long description that could get longer. If it does get longer, what is going to happen? it doesn't se ",
    type: "deposit",
  },
  {
    amount: "202.12",
    category: "10",
    date: "08/16/2023",
    description: "this is a long description ",
    type: "deposit",
  },
  {
    amount: "202.12",
    category: "10",
    date: "08/16/2023",
    description: "hello",
    type: "deposit",
  },
  {
    amount: "202.12",
    category: "10",
    date: "08/16/2023",
    description: "hello",
    type: "deposit",
  },
  {
    amount: "202.12",
    category: "10",
    date: "08/16/2023",
    description: "hello",
    type: "deposit",
  },
  {
    amount: "202.12",
    category: "10",
    date: "08/16/2023",
    description: "hello",
    type: "deposit",
  },
  {
    amount: "202.12",
    category: "10",
    date: "08/16/2023",
    description: "hello",
    type: "deposit",
  },
  {
    amount: "202.12",
    category: "10",
    date: "08/16/2023",
    description: "hello",
    type: "deposit",
  },
  {
    amount: "202.12",
    category: "10",
    date: "08/16/2023",
    description: "hello",
    type: "deposit",
  },
  {
    amount: "202.12",
    category: "10",
    date: "08/16/2023",
    description: "hello",
    type: "deposit",
  },
];

export default function TableView() {
  const { data } = useProcessorState(); // need to use data.filtered
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        padding: 4,
        backgroundColor: "#242424",
        minHeight: "100vh",
        display: "flex",
      }}
    >
      <Grid
        container
        spacing={1}
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "50px",
        }}
      >
        <Grid item>
          <Typography variant="h3" sx={{ textAlign: "center" }}>
            Transactions
          </Typography>

          <TableContainer
            component={Paper}
            sx={{
              width: "90%",
              backgroundColor: "#333",
              margin: "0 auto",
              color: "white",
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Description</TableCell>
                  <TableCell align="right">Type</TableCell>
                  <TableCell align="right">Category</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {testData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.date}
                      </TableCell>
                      <TableCell align="right">{row.amount}</TableCell>
                      <TableCell align="right">{row.description}</TableCell>
                      <TableCell align="right">{row.type}</TableCell>
                      <TableCell align="right">{row.category}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={testData.length}
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
