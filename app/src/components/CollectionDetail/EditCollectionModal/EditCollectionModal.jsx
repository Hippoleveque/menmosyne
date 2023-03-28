import { useContext, useState, useReducer } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Modal from "@mui/material/Modal";

import { AuthContext } from "../../../store/auth-context";
import classes from "./EditCollectionModal.module.css";

const reducer = (state, action) => {
  switch (action.type) {
    case "newName":
      return { ...state, newName: action.value };
    case "newCardsPolicy":
      return { ...state, newCardsPolicy: action.value };
    case "reviewCardsPolicy":
      return { ...state, reviewCardsPolicy: action.value };
    default:
      throw new Error("Invalid action type");
  }
};

export default function EditCollectiondModal({ open, onClose, collection }) {
  const { loginToken } = useContext(AuthContext);
  const [collectionState, collectionDispatch] = useReducer(reducer, {
    newName: collection.name,
    newCardsPolicy: collection.reviewPolicy.newCardsPerDay,
    reviewCardsPolicy: collection.reviewPolicy.reviewCardsPerDay,
  });

  const [submitFailed, setSubmitFailed] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `/api/collections/${collection._id.toString()}/edit`,
        {
          method: "POST",
          body: JSON.stringify({
            name: collectionState.newName,
            newCardsPolicy: collectionState.newCardsPolicy,
            reviewCardsPolicy: collectionState.reviewCardsPolicy,
          }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + loginToken,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Request failed!");
      }
      onClose();
    } catch (err) {
      setSubmitFailed(true);
    }
  };

  return (
    <Modal open={open} onClose={onClose} data-testid="edit-collection-modal">
      <Container component="main" className={classes.editCollectionContainer}>
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
              id="name"
              label="Name"
              name="name"
              type="text"
              value={collectionState.newName}
              onChange={(e) =>
                collectionDispatch({ type: "newName", value: e.target.value })
              }
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="newCardsPolicy"
              label="Number of new cards per day"
              name="newCardsPolicy"
              type="number"
              value={collectionState.newCardsPolicy}
              onChange={(e) =>
                collectionDispatch({
                  type: "newCardsPolicy",
                  value: e.target.value,
                })
              }
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="reviewCardsPolicy"
              label="Number of reviewing cards per day"
              name="reviewCardsPolicy"
              type="number"
              value={collectionState.reviewCardsPolicy}
              onChange={(e) =>
                collectionDispatch({
                  type: "reviewCardsPolicy",
                  value: e.target.value,
                })
              }
            />
            {submitFailed && (
              <Typography
                component="h5"
                variant="h10"
                className={classes.editCollectionErrorMessage}
              >
                Collection invalide
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              data-testid="edit-collection-button-from-modal"
            >
              Modifier la collection
            </Button>
          </Box>
        </Box>
      </Container>
    </Modal>
  );
}
