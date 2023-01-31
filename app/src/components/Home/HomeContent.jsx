import React, { useEffect, useState, useContext, useCallback } from "react";
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
import Pagination from "@mui/material/Pagination";

import { AuthContext } from "../../store/auth-context";
import classes from "./HomeContent.module.css";

const ITEMS_PER_PAGE = 7;

export default function HomeContent() {
  const navigate = useNavigate();
  const { loginToken } = useContext(AuthContext);
  const [collections, setCollections] = useState([]);
  const [totalCollections, setTotalCollections] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchCollections = useCallback(
    async (page) => {
      let response = await fetch("/api/memo/cardCollections?page=" + page, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + loginToken,
        },
      });
      response = await response.json();
      return response;
    },
    [loginToken]
  );

  useEffect(() => {
    const fetchSetCollections = async () => {
      const res = await fetchCollections(currentPage);
      setCollections(res.cardCollections);
      setTotalCollections(res.totalCollections);
    };
    fetchSetCollections();
  }, [currentPage, fetchCollections]);

  const handleReviewClick = (collectionId) => {
    navigate(`/revision/${collectionId}`);
  };

  const handleAddCollectionClick = () => {
    navigate("/nouvelle-collection");
  };

  let numPages = Math.ceil(totalCollections / ITEMS_PER_PAGE);

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
      {numPages > 0 && (
        <Pagination
          count={numPages}
          className={classes.homeTablePagination}
          onChange={(event, value) => setCurrentPage(value)}
        />
      )}
    </Grid>
  );
}
