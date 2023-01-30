import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { AuthContext } from "../../store/auth-context";
import classes from "./HomeContent.module.css";

export default function HomeContent() {
  const navigate = useNavigate();
  const { loginToken } = useContext(AuthContext);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      const response = await fetch("/api/memo/cardCollections", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + loginToken,
        },
      });
      const res = await response.json();
      setCollections(res.cardCollections);
    };
    fetchCollections();
  }, [loginToken]);

  const handleReviewClick = (collectionId) => {
    navigate(`/revision/${collectionId}`);
  };

  const handleAddCollectionClick = () => {
    navigate("/nouvelle-collection");
  };

  return (
    <Grid container component="main" spacing={2} className={classes.homeGrid}>
      <Grid item xs={6} md={12}>
        <Box
          sx={{
            margin: 12,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            {"Bon retour !"}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={6} md={12} className="leftAligned">
        <Typography component="h3" variant="h10">
          {"Mes collections"}
        </Typography>
      </Grid>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell align="right">N. Cartes</TableCell>
              <TableCell align="right">Création</TableCell>
              <TableCell align="right">
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleAddCollectionClick}
                >
                  Ajouter
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {collections.map((row) => (
              <TableRow key={row._id.toString()}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.numCards}</TableCell>
                <TableCell align="right">{row.createdAt}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleReviewClick(row._id.toString())}
                  >
                    Réviser
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}
