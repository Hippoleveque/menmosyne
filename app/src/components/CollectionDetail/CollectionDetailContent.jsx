import React, { useEffect, useState, useContext, useCallback } from "react";
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
import { useNavigate } from "react-router";

import CreateCardModal from "./CreateCardModal/CreateCardModal";
import { AuthContext } from "../../store/auth-context";
import classes from "./CollectionDetailContent.module.css";
import ConfirmCardDeletionModal from "./ConfirmCardDeletionModal/ConfirmCardDeletionModal";
import TableExtendableTextCell from "../Common/TableExtendableTextCell";

const ITEMS_PER_PAGE = 7;

export default function CollectionDetailContent({ collectionId }) {
  const { loginToken } = useContext(AuthContext);
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [collection, setCollection] = useState(null);
  const [deletingCardId, setDeletingCardId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
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
      const response = await fetch(`/api/memo/cardCollections/${collectionId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + loginToken,
        },
      });
      const data = await response.json();
      setCollection(data.cardCollection);
    };
    fetchCollection();
  }, [loginToken, collectionId]);

  const handleReviewClick = () => {
    navigate(`/revision/${collectionId}`);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setCurrentPage(1);
    fetchCards(1);
  };

  const handleDeleteModalOpen = (cardId) => {
    setDeletingCardId(cardId);
    setDeleteModalOpen(true);
  };

  const handleDeleteModalClose = async () => {
    setDeleteModalOpen(false);
    setDeletingCardId(null);
    const newCards = await fetchCards(currentPage);
    setCards(newCards.cards);
    setTotalCards(newCards.totalCards);
  };

  let numPages = Math.ceil(totalCards / ITEMS_PER_PAGE);

  return (
    <Box sx={{ height: "100%" }}>
      <CreateCardModal
        open={modalOpen}
        onClose={handleModalClose}
        collectionId={collectionId}
      />
      <ConfirmCardDeletionModal
        cardId={deletingCardId}
        open={deleteModalOpen}
        onClose={handleDeleteModalClose}
      />

      <Box
        sx={{
          p: "10px 10px",
        }}
      >
        <Typography component="h1" variant="h5">
          {collection && collection.name}
        </Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 650, tablelayout: "fixed" }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell colSpan={2}>
                <Typography component="h2">Mes cartes</Typography>
              </TableCell>
              <TableCell colSpan={2} align="right">
                <Box>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleReviewClick}
                    sx={{ fontSize: "0.7rem", marginRight: "10px" }}
                  >
                    Réviser
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleModalOpen}
                    sx={{ fontSize: "0.7rem" }}
                  >
                    Ajouter une carte
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">Titre</TableCell>
              <TableCell align="center">Recto</TableCell>
              <TableCell align="center">Verso</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cards.map((row) => (
              <TableRow key={row._id.toString()}>
                <TableExtendableTextCell
                  component="th"
                  scope="row"
                  align="center"
                  text={row.title || ""}
                />
                <TableExtendableTextCell
                  align="center"
                  text={row.rectoContent || ""}
                />
                <TableExtendableTextCell
                  align="center"
                  text={row.versoContent || ""}
                />
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteModalOpen(row._id.toString())}
                    sx={{ fontSize: "0.7rem" }}
                  >
                    Supprimer
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
    </Box>
  );
}
