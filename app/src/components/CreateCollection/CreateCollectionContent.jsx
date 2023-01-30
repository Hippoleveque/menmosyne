import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { AuthContext } from "../../store/auth-context";
import classes from "./CreateCollectionContent.module.css";

const theme = createTheme();

export default function CreateCollectionContent() {
  const navigate = useNavigate();
  const { loginToken } = useContext(AuthContext);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [submitFailed, setSubmitFailed] = useState(false);

  const handleNewCollectionNameChange = (e) => {
    setNewCollectionName(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/memo/cardCollections", {
        method: "POST",
        body: JSON.stringify({
          name: newCollectionName,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + loginToken,
        },
      });
      if (!response.ok) {
        throw new Error("Request failed!");
      }
      navigate("/");
    } catch (err) {
      setSubmitFailed(true);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        component="main"
        maxWidth="xs"
        className={classes.createCollectionContainer}
      >
        <CssBaseline />
        <Box>
          <Typography component="h1" variant="h5">
            Créer une nouvelle Collection
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              type="text"
              autoComplete="email"
              value={newCollectionName}
              onChange={handleNewCollectionNameChange}
              autoFocus
            />
            {submitFailed && (
              <Typography
                component="h5"
                variant="h10"
                className={classes.createCollectionErrorMessage}
              >
                Nom de collection incorrect
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Créer la collection
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
