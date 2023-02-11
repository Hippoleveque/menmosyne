import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { AuthContext } from "../../store/auth-context";
import classes from "./LoginContent.module.css";

const theme = createTheme();

export default function LoginContent() {
  const navigate = useNavigate();
  const { onLogin } = useContext(AuthContext);
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [loginFailed, setLoginFailed] = useState(false);

  const handleEmailChange = (e) => {
    setEnteredEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setEnteredPassword(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/auth/login", {
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
      onLogin(data.token, new Date(data.expirationDate));
      navigate("/");
    } catch (err) {
      setLoginFailed(true);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        component="main"
        maxWidth="xs"
        className={classes.loginContainer}
      >
        <CssBaseline />
        <Box className={classes.loginBox}>
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
            />
            {loginFailed && (
              <Typography
                component="h5"
                variant="h10"
                className={classes.loginErrorMessage}
              >
                Identifiants incorrects
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Se connecter
            </Button>
            <Typography
              component="h5"
              variant="h10"
              sx={{ textAlign: "center" }}
            >
              <Link href={"/signup"} underline="hover">
                Créer un compte
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
