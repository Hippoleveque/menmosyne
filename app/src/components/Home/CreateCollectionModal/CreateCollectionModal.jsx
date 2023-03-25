import { useContext, useState, useReducer } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Modal from "@mui/material/Modal";

import { AuthContext } from "../../../store/auth-context";
import classes from "./CreateCollectionModal.module.css";

const initialState = {
  newCollectionName: "",
  newCollectionDescription: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "newCollectionName":
      return { ...state, newCollectionName: action.value };
    case "newCollectionDescription":
      return { ...state, newCollectionDescription: action.value };
    case "reset":
      return initialState;
    default:
      throw new Error("Invalid action type");
  }
};

export default function CreateCollectionModal({ open, onClose }) {
  const { loginToken } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [submitFailed, setSubmitFailed] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/collections", {
        method: "POST",
        body: JSON.stringify({
          name: state.newCollectionName,
          description: state.newCollectionDescription,
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
    <Modal open={open} onClose={onClose} data-testid="create-collection-modal">
      <Container component="main" className={classes.createCollectionContainer}>
        <CssBaseline />
        <Box
          sx={{
            backgroundColor: "white",
            padding: "1rem",
            borderRadius: "2.5%",
            width: "30rem",
          }}
        >
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
              value={state.newCollectionName}
              onChange={(e) =>
                dispatch({ type: "newCollectionName", value: e.target.value })
              }
              autoFocus
            />
            <TextField
              margin="normal"
              fullWidth
              id="description"
              label="Description"
              name="description"
              type="text"
              value={state.newCollectionDescription}
              onChange={(e) =>
                dispatch({
                  type: "newCollectionDescription",
                  value: e.target.value,
                })
              }
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
              data-testid="create-collection-button-from-modal"
            >
              Créer la collection
            </Button>
          </Box>
        </Box>
      </Container>
    </Modal>
  );
}
