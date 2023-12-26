import {
  Grid,
  Typography,
  Button,
  TextField,
  LinearProgress,
} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";

export function BankForm({
  current,
  setHeader,
  headers,
  handleOpenBank,
  openBank,
  user,
  bankName,
  setBankName,
}) {
  // console.log(current, headers);

  const usedHeaders = headers.fileHeaders?.reduce((acc, currentValue) => {
    const retArr = [...acc];

    for (const h in headers) {
      if (headers[h] === currentValue) {
        retArr.push(currentValue);
      }
    }

    return retArr;
  }, []);

  return (
    <Grid
      container
      spacing={1}
      sx={{
        display: "flex",
        justifyContent: "center",
        marginTop: "50px",
        color: "white",
      }}
    >
      <Grid item>
        <Typography variant="h3" sx={{ textAlign: "center" }}>
          We don't recognize this file structure.
        </Typography>

        <LinearProgress
          variant="determinate"
          value={(usedHeaders?.length / 3) * 100}
          sx={{ height: "20px", width: "70%", margin: "20px auto" }}
        />
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          Which header represents the transaction <i>{current}</i>?
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
              sx={{
                width: "250px",
                height: "60px",
                margin: "10px",
                "&.Mui-disabled": {
                  backgroundColor: "#47759a",
                },
              }}
              disabled={usedHeaders.includes(h)}
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
          {usedHeaders?.length === 2 ? (
            <Button
              onClick={handleOpenBank}
              component="label"
              variant={openBank ? "outlined" : "contained"}
              disabled={!user}
              sx={{
                height: "50px",
                backgroundColor: openBank ? "" : "#90caf9",
                "&.Mui-disabled": {
                  backgroundColor: "#47759a",
                },
              }}
              startIcon={<AddBoxIcon />}
            >
              Add Bank
            </Button>
          ) : null}
          {openBank ? (
            <TextField
              variant="outlined"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              sx={{
                border: "1px solid white",
                borderRadius: "5px",
                "& input": {
                  height: "15px",
                  color: "white",
                },
              }}
            />
          ) : null}
        </Grid>
      </Grid>
    </Grid>
  );
}
