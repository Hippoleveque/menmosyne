import React, { useEffect, useState, useContext, useCallback } from "react";
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

import CreateCardModal from "./CreateCardModal/CreateCardModal";
import { AuthContext } from "../../store/auth-context";
import classes from "./CollectionDetailContent.module.css";

const ITEMS_PER_PAGE = 7;

export default function CollectionDetailContent({ collectionId }) {
  const { loginToken } = useContext(AuthContext);
  const [cards, setCards] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [collection, setCollection] = useState(null);
  const [totalCards, setTotalCards] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchCards = useCallback(
    async (page) => {
      const offset = (page - 1) * ITEMS_PER_PAGE;
      const limit = ITEMS_PER_PAGE;
      let response = await fetch(
        `/api/memo/cards/${collectionId}?offset=${offset}&limit=${limit}`,
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
      setCards(response.cards);
      setTotalCards(response.totalCards);
    },
    [loginToken, collectionId]
  );

  useEffect(() => {
    fetchCards(currentPage);
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

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setCurrentPage(1);
    fetchCards(1);
  };

  let numPages = Math.ceil(totalCards / ITEMS_PER_PAGE);

  return (
    <Grid
      container
      component="main"
      spacing={2}
      className={classes.collectionGrid}
    >
      <CreateCardModal
        open={modalOpen}
        onClose={handleModalClose}
        collectionId={collectionId}
      />
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
                  onClick={handleModalOpen}
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
