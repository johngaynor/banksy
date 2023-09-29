import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CreditCardOffIcon from "@mui/icons-material/CreditCardOff";
// import facreditcar

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <Box
      container
      paddingLeft={4}
      paddingRight={4}
      sx={{
        height: "70px",
        display: "flex",
        backgroundColor: "#242424",
      }}
    >
      <Grid container>
        <Grid
          item
          xs={4}
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <CreditCardOffIcon sx={{ fontSize: 40 }} />
        </Grid>
        <Grid item xs={2} />
        <Grid
          item
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
          xs={6}
        >
          <Grid item>
            <Link href="/processor">CSV PROCESSOR</Link>
          </Grid>
          <Grid
            item
            sx={{
              marginLeft: "50px",
            }}
          >
            <Link href="/stats">STATISTICS</Link>
          </Grid>
          <Grid
            item
            sx={{
              marginLeft: "50px",
            }}
          >
            <Link href="/db">DATABASE</Link>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
