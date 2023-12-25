import { Grid, Typography, Button, TextField } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";

export function CategoryForm({
  current,
  userCategories,
  handleOpenKeyword,
  openKeyword,
  setKeyword,
  assignCategory,
}) {
  return (
    <>
      <Typography variant="h5" sx={{ textAlign: "center" }}>
        On {current.date}, you{" "}
        {current.type === "deposit" ? "received" : "spent"} ${current.amount}{" "}
        {current.type === "deposit" ? "from" : "at"}{" "}
        <i>{current.description}</i>.
      </Typography>
      <Typography variant="h5" sx={{ textAlign: "center", marginTop: "30px" }}>
        Which category does this fall under?
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
        {["income", ...Object.keys(userCategories)].map((cat, index) => (
          <Button
            component="label"
            variant="contained"
            sx={{ width: "250px", height: "60px", margin: "10px" }}
            key={index}
            onClick={() => assignCategory(cat)}
          >
            <Typography variant="h6">{cat}</Typography>
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
        <Button
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
        ) : null}
      </Grid>
    </>
  );
}
