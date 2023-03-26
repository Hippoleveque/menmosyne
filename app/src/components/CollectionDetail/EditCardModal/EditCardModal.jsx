import { useContext, useState, useReducer } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Modal from "@mui/material/Modal";

import { AuthContext } from "../../../store/auth-context";
import classes from "./EditCardModal.module.css";

const reducer = (state, action) => {
  switch (action.type) {
    case "newCardRecto":
      return { ...state, newCardRecto: action.value };
    case "newCardVerso":
      return { ...state, newCardVerso: action.value };
    default:
      throw new Error("Invalid action type");
  }
};

export default function EditCardModal({ open, onClose, card }) {
  const { loginToken } = useContext(AuthContext);
  const [cardState, cardDispatch] = useReducer(reducer, {
    newCardRecto: card.rectoContent,
    newCardVerso: card.versoContent,
  });
  
  const [submitFailed, setSubmitFailed] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/cards/${card._id.toString()}/edit`, {
        method: "POST",
        body: JSON.stringify({
          rectoContent: cardState.newCardRecto,
          versoContent: cardState.newCardVerso,
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
      onClose();
    } catch (err) {
      setSubmitFailed(true);
    }
  };

  return (
    <Modal open={open} onClose={onClose} data-testid="edit-card-modal">
      <Container component="main" className={classes.editCardContainer}>
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
            Mofidier la carte
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="recto"
              label="Recto"
              name="recto"
              type="text"
              value={cardState.newCardRecto}
              onChange={(e) =>
                cardDispatch({ type: "newCardRecto", value: e.target.value })
              }
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="verso"
              label="Verso"
              name="verso"
              type="text"
              value={cardState.newCardVerso}
              onChange={(e) =>
                cardDispatch({ type: "newCardVerso", value: e.target.value })
              }
            />
            {submitFailed && (
              <Typography
                component="h5"
                variant="h10"
                className={classes.editCardErrorMessage}
              >
                Carte invalide
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              data-testid="edit-card-button-from-modal"
            >
              Modifier la carte
            </Button>
          </Box>
        </Box>
      </Container>
    </Modal>
  );
}
