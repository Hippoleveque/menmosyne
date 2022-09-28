import React, { Fragment, useEffect, useState, useContext } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { AuthContext } from "../../store/auth-context";

let collectionData = require("../../data/dummyCollection.json");

export default function HomeContent() {
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

  return (
    <Grid
      container
      sx={{ paddingLeft: 7, paddingRight: 7 }}
      component="main"
      spacing={2}
    >
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
            {"Bon retour {userName} !"}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={6} md={12} sx={{ textAlign: "left" }}>
        <Typography component="h3" variant="h10">
          {"Mes collections"}
        </Typography>
      </Grid>
      <Grid item xs={6} md={3}>
        <Typography component="h3" variant="h10">
          {"Nom"}
        </Typography>
      </Grid>
      <Grid item xs={6} md={3}>
        <Typography component="h3" variant="h10">
          {"N. Cartes"}
        </Typography>
      </Grid>
      <Grid item xs={6} md={3}>
        <Typography component="h3" variant="h10">
          {"Création"}
        </Typography>
      </Grid>
      <Grid item xs={6} md={3}>
        <Typography component="h3" variant="h10">
          <Button variant="contained" size="small">
            Ajouter
          </Button>
        </Typography>
      </Grid>
      <div
        style={{ backgroundColor: "grey", height: "2px", width: "100%" }}
      ></div>
      {collections.map((collection) => (
        <Fragment key={collection._id}>
          <Grid item xs={6} md={3}>
            <Typography component="h3" variant="h10">
              {collection.name}
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography component="h3" variant="h10">
              {collection.numCards}
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography component="h3" variant="h10">
              {collection.createdAt}
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography component="h3" variant="h10">
              <Button variant="contained" size="small">
                Réviser
              </Button>
            </Typography>
          </Grid>
        </Fragment>
      ))}
    </Grid>
  );
}
