import { useContext, useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Modal from "@mui/material/Modal";

import classes from "./ContinueRevisionModal.module.css";

export default function ContinueRevisionModal({
  open,
  onClose,
  onContinueReview,
}) {
  return (
    <Modal open={open} onClose={onClose} data-testid="continue-review-modal">
      <Container component="main" className={classes.continueRevisionContainer}>
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
            Bravo, vous avez terminé votre session de révision ! Souhaitez-vous
            continuer à réviser ?
          </Typography>
          <Box
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
              color="primary"
              sx={{ mt: 3, mb: 2, mr: 1.5, ml: 1.5 }}
              data-testid="cancel-continue-review-button"
            >
              Arrêter
            </Button>
            <Button
              variant="contained"
              color="secondary"
              sx={{ mt: 3, mb: 2, mr: 1.5, ml: 1.5 }}
              data-testid="confirm-continue-review-button"
              onClick={onContinueReview}
            >
              Continuer
            </Button>
          </Box>
        </Box>
      </Container>
    </Modal>
  );
}
