import React, { Fragment } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';

let collectionData = require("../../data/dummyCollection.json");

export default function HomeContent() {
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
          <Button variant="contained" size="small">Ajouter</Button>
        </Typography>
      </Grid>
      <div
        style={{ backgroundColor: "grey", height: "2px", width: "100%" }}
      ></div>
      {collectionData.data.map((collection) => (
        <Fragment>
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
              {collection.creationDate}
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography component="h3" variant="h10">
              <Button variant="contained" size="small">Réviser</Button>
            </Typography>
          </Grid>
        </Fragment>
      ))}
    </Grid>
  );
}
