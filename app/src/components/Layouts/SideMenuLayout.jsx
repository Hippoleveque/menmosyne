import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme();

export default function SideMenuLayout(props) {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <CssBaseline />
        <Grid
          container
          spacing={2}
          sx={{ height: "100vh", width: "100%" }}
          component="main"
        >
          <Grid item xs={6} md={4} sx={{ backgroundColor: "#042040" }}>
            Bonjour
          </Grid>
          <Grid item xs={6} md={8}>
            {props.children}
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
