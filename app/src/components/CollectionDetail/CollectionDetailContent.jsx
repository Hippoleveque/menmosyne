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
import classes from "./CollectionDetailContent.module.css";

const NUM_ITEMS_PER_PAGE = 2;

export default function CollectionDetailContent({ collectionId }) {
  const navigate = useNavigate();
  const { loginToken } = useContext(AuthContext);
  const [cards, setCards] = useState([]);
  const [collection, setCollection] = useState(null);
  const [totalCards, setTotalCards] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchCards = useCallback(
    async (page) => {
      let response = await fetch(
        `/api/memo/cards/${collectionId}?page=` + page,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + loginToken,
          },
        }
      );
      response = await response.json();
      return response;
    },
    [loginToken, collectionId]
  );

  useEffect(() => {
    const fetchSetCards = async () => {
      const res = await fetchCards(currentPage);
      setCards(res.cards);
      setTotalCards(res.totalCards);
    };
    fetchSetCards();
  }, [currentPage, fetchCards]);

  useEffect(() => {
    const fetchCollection = async () => {
      const response = await fetch(`/api/memo/collections/${collectionId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + loginToken,
        },
      });
      const data = await response.json();
      setCollection(data.collection);
    };
    fetchCollection();
  }, [loginToken, collectionId]);

  const handleAddCardClick = () => {
    navigate("/nouvelle-carte");
  };

  let numPages = Math.ceil(totalCards / NUM_ITEMS_PER_PAGE);

  return (
    <Grid
      container
      component="main"
      spacing={2}
      className={classes.collectionGrid}
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
            {collection && "Collection " + collection.name}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={6} md={12} className="leftAligned">
        <Typography component="h3" variant="h10">
          Mes cartes
        </Typography>
      </Grid>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Titre</TableCell>
              <TableCell align="right">Recto</TableCell>
              <TableCell align="right">Verso</TableCell>
              <TableCell align="right">
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleAddCardClick}
                >
                  Ajouter
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cards.map((row) => (
              <TableRow key={row._id.toString()}>
                <TableCell component="th" scope="row">
                  {row.title.slice(0, 20)}
                </TableCell>
                <TableCell align="right">
                  {row.rectoContent.slice(0, 20)}
                </TableCell>
                <TableCell align="right">
                  {row.versoContent.slice(0, 20)}
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      return null;
                    }}
                  >
                    Modifier
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
          className={classes.collectionTablePagination}
          onChange={(event, value) => setCurrentPage(value)}
        />
      )}
    </Grid>
  );
}
