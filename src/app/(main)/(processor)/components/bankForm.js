import { Grid, Typography, Button, TextField } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";

export function BankForm({ current, setHeader, headers }) {
  console.log(current, headers);
  return (
    <>
      <Typography variant="h5" sx={{ textAlign: "center" }}>
        We don't recognize this file structure.
      </Typography>
      <Typography variant="h5" sx={{ textAlign: "center", marginTop: "30px" }}>
        Which CSV header describes the transaction {current}?
      </Typography>
      <Grid
        container
        sx={{
          width: "70%",
          margin: "0 auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {headers.fileHeaders?.map((h, index) => (
          <Button
            component="label"
            variant="contained"
            sx={{ width: "250px", height: "60px", margin: "10px" }}
            key={index}
            onClick={() => setHeader(current, h)}
          >
            <Typography variant="h6">{h}</Typography>
          </Button>
        ))}
      </Grid>
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "25px",
        }}
      >
        {/* <Button
          onClick={handleOpenKeyword}
          component="label"
          variant={openKeyword ? "outlined" : "contained"}
          sx={{
            height: "50px",
            backgroundColor: openKeyword ? "" : "#90caf9",
          }}
          startIcon={<AddBoxIcon />}
        >
          Add Keyword
        </Button>
        {openKeyword ? (
          <TextField
            variant="outlined"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            sx={{
              border: "1px solid white",
              borderRadius: "5px",
              "& input": {
                height: "15px",
                color: "white",
              },
            }}
          />
        ) : null} */}
      </Grid>
    </>
  );
}
