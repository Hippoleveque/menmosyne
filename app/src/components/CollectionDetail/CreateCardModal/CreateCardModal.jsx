import { useContext, useState, useReducer, useEffect } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Modal from "@mui/material/Modal";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { AuthContext } from "../../../store/auth-context";
import classes from "./CreateCardModal.module.css";

const theme = createTheme();

const initialState = {
  newCardName: "",
  newCardTitle: "",
  newCardRecto: "",
  newCardVerso: "",
  cardCollectionId: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "newCardName":
      return { ...state, newCardName: action.value };
    case "newCardTitle":
      return { ...state, newCardTitle: action.value };
    case "newCardRecto":
      return { ...state, newCardRecto: action.value };
    case "newCardVerso":
      return { ...state, newCardVerso: action.value };
    case "cardCollectionId":
      return { ...state, cardCollectionId: action.value };
    case "reset":
      return initialState;
    default:
      throw new Error("Invalid action type");
  }
};

export default function CreateCardModal({ open, onClose, collectionId }) {
  const { loginToken } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [submitFailed, setSubmitFailed] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/cards", {
        method: "POST",
        body: JSON.stringify({
          title: state.newCardTitle,
          cardCollectionId: collectionId,
          rectoContent: state.newCardRecto,
          versoContent: state.newCardVerso,
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
      dispatch({ type: "reset" });
      onClose();
    } catch (err) {
      setSubmitFailed(true);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Modal open={open} onClose={onClose} data-testid="create-card-modal">
        <Container component="main" className={classes.createCardContainer}>
          <CssBaseline />
          <Box
            sx={{
              backgroundColor: "white",
              padding: "1rem",
              borderRadius: "2.5%",
              width: "30rem",
            }}
          >
            <Typography component="h1" variant="h5" sx={{ padding: "0.5rem" }}>
              Créer une nouvelle Carte
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="title"
                label="Title"
                name="title"
                type="text"
                value={state.newCardTitle}
                onChange={(e) =>
                  dispatch({ type: "newCardTitle", value: e.target.value })
                }
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="recto"
                label="Recto"
                name="recto"
                type="text"
                value={state.newCardRecto}
                onChange={(e) =>
                  dispatch({ type: "newCardRecto", value: e.target.value })
                }
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="verso"
                label="Verso"
                name="verso"
                type="text"
                value={state.newCardVerso}
                onChange={(e) =>
                  dispatch({ type: "newCardVerso", value: e.target.value })
                }
                autoFocus
              />
              {submitFailed && (
                <Typography
                  component="h5"
                  variant="h10"
                  className={classes.createCardErrorMessage}
                >
                  Carte invalide
                </Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                data-testid="create-card-button-from-modal"
              >
                Créer la carte
              </Button>
            </Box>
          </Box>
        </Container>
      </Modal>
    </ThemeProvider>
  );
}
