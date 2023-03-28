import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
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
import { formatDistance } from "date-fns";
import frLocale from "date-fns/locale/fr";

import CreateCardModal from "./CreateCardModal/CreateCardModal";
import { AuthContext } from "../../store/auth-context";
import classes from "./CollectionDetailContent.module.css";
import ConfirmCardDeletionModal from "./ConfirmCardDeletionModal/ConfirmCardDeletionModal";
import EditCardModal from "./EditCardModal/EditCardModal";
import EditCollectionModal from "./EditCollectionModal/EditCollectionModal";
import TableExtendableTextCell from "../Common/TableExtendableTextCell";

const ITEMS_PER_PAGE = 7;

export default function CollectionDetailContent({ collectionId }) {
  const { loginToken } = useContext(AuthContext);
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [collection, setCollection] = useState(null);
  const [deletingCardId, setDeletingCardId] = useState(null);
  const [editCardModalOpen, setEditCardModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editCollectionModalOpen, setEditCollectionModalOpen] = useState(false);
  const [totalCards, setTotalCards] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchCards = useCallback(
    async (page) => {
      const offset = (page - 1) * ITEMS_PER_PAGE;
      const limit = ITEMS_PER_PAGE;
      let response = await fetch(
        `/api/collections/${collectionId}/cards?offset=${offset}&limit=${limit}`,
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
      const response = await fetch(`/api/collections/${collectionId}`, {
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

  const handleEditCollectionClick = () => {
    setEditCollectionModalOpen(true);
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
    await fetchCards(currentPage);
  };

  const handleEditModalOpen = (card) => {
    setEditingCard(card);
    setEditCardModalOpen(true);
  };

  const handleEditModalClose = async () => {
    setEditCardModalOpen(false);
    setEditingCard(null);
    await fetchCards(currentPage);
  };

  let numPages = Math.ceil(totalCards / ITEMS_PER_PAGE);

  const now = useMemo(() => new Date(), []);

  return (
    <Box sx={{ height: "100%" }}>
      {modalOpen && (
        <CreateCardModal
          open={modalOpen}
          onClose={handleModalClose}
          collectionId={collectionId}
        />
      )}
      {deleteModalOpen && (
        <ConfirmCardDeletionModal
          cardId={deletingCardId}
          open={deleteModalOpen}
          onClose={handleDeleteModalClose}
        />
      )}
      {editCardModalOpen && (
        <EditCardModal
          open={editCardModalOpen}
          onClose={handleEditModalClose}
          card={editingCard}
        />
      )}
      {editCollectionModalOpen && (
        <EditCollectionModal
          open={editCollectionModalOpen}
          onClose={() => setEditCollectionModalOpen(false)}
          collection={collection}
        />
      )}
      <Box
        sx={{
          p: "10px 10px",
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          data-testid="collection-detail-name"
        >
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
              <TableCell colSpan={7} align="right">
                <Box>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={handleEditCollectionClick}
                    sx={{ fontSize: "0.7rem", marginRight: "10px" }}
                    data-testid="edit-button-collection-detail"
                  >
                    Modifier la collection
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleReviewClick}
                    sx={{ fontSize: "0.7rem", marginRight: "10px" }}
                    data-testid="review-button-collection-detail"
                  >
                    Réviser
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleModalOpen}
                    sx={{ fontSize: "0.7rem" }}
                    data-testid="create-card-button"
                  >
                    Ajouter une carte
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center" colSpan={2}>
                Recto
              </TableCell>
              <TableCell align="center" colSpan={2}>
                Verso
              </TableCell>
              <TableCell align="center" colSpan={2}>
                Dernière Révision
              </TableCell>
              <TableCell align="center" colSpan={1}>
                Modifier
              </TableCell>
              <TableCell align="center" colSpan={1}>
                Supprimer
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cards.map((row) => (
              <TableRow
                key={row._id.toString()}
                data-testid={`card-${row._id.toString()}`}
              >
                <TableExtendableTextCell
                  align="center"
                  text={row.rectoContent || ""}
                  colSpan={2}
                />
                <TableExtendableTextCell
                  align="center"
                  text={row.versoContent || ""}
                  colSpan={2}
                />
                <TableExtendableTextCell
                  align="center"
                  text={
                    row.lastReviewed
                      ? formatDistance(now, new Date(row.lastReviewed), {
                          locale: frLocale,
                        })
                      : "jamais"
                  }
                  colSpan={2}
                />
                <TableCell align="center" colSpan={1}>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={() => handleEditModalOpen(row)}
                    sx={{ fontSize: "0.7rem" }}
                    data-testid={`edit-card-button-${row._id.toString()}`}
                  >
                    Mofifier
                  </Button>
                </TableCell>
                <TableCell align="center" colSpan={1}>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteModalOpen(row._id.toString())}
                    sx={{ fontSize: "0.7rem" }}
                    data-testid={`delete-card-button-${row._id.toString()}`}
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
          page={currentPage}
        />
      )}
    </Box>
  );
}
