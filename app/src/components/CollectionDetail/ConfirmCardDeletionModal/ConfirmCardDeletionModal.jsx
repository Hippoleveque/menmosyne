import { useContext, useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Modal from "@mui/material/Modal";

import { AuthContext } from "../../../store/auth-context";
import classes from "./ConfirmCardDeletionModal.module.css";

export default function ConfirmCardDeletionModal({ open, onClose, cardId }) {
  const { loginToken } = useContext(AuthContext);
  const [submitFailed, setSubmitFailed] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/cards/${cardId}`, {
        method: "DELETE",
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
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} data-testid="delete-card-modal">
      <Container component="main" className={classes.deleteCardContainer}>
        <Box
          sx={{
            backgroundColor: "white",
            padding: "1rem",
            borderRadius: "2.5%",
            width: "30rem",
          }}
        >
          <CssBaseline />
          <Typography component="h1" variant="h5">
            Êtes-vous sûr de vouloir supprimer cette carte ?
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              mt: 1,
              display: "flex",
              flexDirection: "row",
              justifyContent: "right",
            }}
          >
            <Button
              onClick={onClose}
              variant="contained"
              sx={{ mt: 3, mb: 2, mr: 1.5, ml: 1.5 }}
              data-testid="cancel-delete-card-button"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="error"
              sx={{ mt: 3, mb: 2, mr: 1.5, ml: 1.5 }}
              data-testid="confirm-delete-card-button"
            >
              Supprimer
            </Button>
            {submitFailed && (
              <Typography
                component="h5"
                variant="h10"
                className={classes.deleteCardErrorMessage}
              >
                Impossible de supprimer la carte.
              </Typography>
            )}
          </Box>
        </Box>
      </Container>
    </Modal>
  );
}
