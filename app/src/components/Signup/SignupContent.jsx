import { useState } from "react";
import { useNavigate } from "react-router";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import classes from "./SignupContent.module.css";

const theme = createTheme();

export default function SignupContent() {
  const navigate = useNavigate();
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [signupFailed, setSignupFailed] = useState(false);

  const handleEmailChange = (e) => {
    setEnteredEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setEnteredPassword(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Request failed!");
      }
      const data = await response.json();
      navigate("/login");
    } catch (err) {
      setSignupFailed(true);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        component="main"
        maxWidth="xs"
        className={classes.signupContainer}
      >
        <CssBaseline />
        <Box className={classes.signupBox}>
          <Typography component="h1" variant="h5">
            Bienvenue sur Mnemosyne
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
              id="email"
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              value={enteredEmail}
              onChange={handleEmailChange}
              autoFocus
              data-testid="email-field-signup"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type="password"
              id="password"
              value={enteredPassword}
              onChange={handlePasswordChange}
              autoComplete="current-password"
              data-testid="password-field-signup"
            />
            {signupFailed && (
              <Typography
                component="h5"
                variant="h10"
                className={classes.signupErrorMessage}
              >
                Identifiants incorrects
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              sx={{ mt: 3, mb: 2 }}
              data-testid="submit-button-signup"
            >
              Créer un compte
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
