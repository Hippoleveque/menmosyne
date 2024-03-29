import { useContext, useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Modal from "@mui/material/Modal";

import { AuthContext } from "../../../store/auth-context";
import classes from "./ConfirmCollectionDeletionModal.module.css";

export default function ConfirmCollectionDeletionModal({
  open,
  onClose,
  collectionId,
}) {
  const { loginToken } = useContext(AuthContext);
  const [submitFailed, setSubmitFailed] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/collections/${collectionId}`, {
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
    <Modal open={open} onClose={onClose} data-testid="delete-collection-modal">
      <Container component="main" className={classes.deleteCollectionContainer}>
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
            Êtes-vous sûr de vouloir supprimer cette collection ?
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
              data-testid="cancel-delete-collection-button"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="error"
              sx={{ mt: 3, mb: 2, mr: 1.5, ml: 1.5 }}
              data-testid="confirm-delete-collection-button"
            >
              Supprimer
            </Button>
            {submitFailed && (
              <Typography
                component="h5"
                variant="h10"
                className={classes.deleteCollectionErrorMessage}
              >
                Impossible de supprimer la collection.
              </Typography>
            )}
          </Box>
        </Box>
      </Container>
    </Modal>
  );
}
