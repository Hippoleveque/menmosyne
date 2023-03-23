import React, { useEffect, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router";
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
import Link from "@mui/material/Link";
import Pagination from "@mui/material/Pagination";

import { AuthContext } from "../../store/auth-context";
import classes from "./HomeContent.module.css";
import CreateCollectionModal from "./CreateCollectionModal/CreateCollectionModal";
import ConfirmCollectionDeletionModal from "./ConfirmCollectionDeletionModal/ConfirmCollectionDeletionModal";
import TableExtendableTextCell from "../Common/TableExtendableTextCell";

const ITEMS_PER_PAGE = 7;

export default function HomeContent() {
  const { loginToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingCollectionId, setDeletingCollectionId] = useState(null);
  const [totalCollections, setTotalCollections] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchCollections = useCallback(
    async (page) => {
      const offset = (page - 1) * ITEMS_PER_PAGE;
      const limit = ITEMS_PER_PAGE;
      let response = await fetch(
        `/api/collections?offset=${offset}&limit=${limit}`,
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
      setCollections(response.cardCollections);
      setTotalCollections(response.totalCollections);
      return response;
    },
    [loginToken]
  );

  useEffect(() => {
    fetchCollections(currentPage);
  }, [currentPage, fetchCollections]);

  const handleReviewClick = (collectionId) => {
    navigate(`/revision/${collectionId}`);
  };

  const handleCreateModalOpen = () => {
    setCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    setCreateModalOpen(false);
    setCurrentPage(1);
    fetchCollections(1);
  };

  const handleDeleteModalOpen = (collectionId) => {
    setDeletingCollectionId(collectionId);
    setDeleteModalOpen(true);
  };

  const handleDeleteModalClose = async () => {
    setDeleteModalOpen(false);
    setDeletingCollectionId(null);
    const newCollections = await fetchCollections(currentPage);
    setCollections(newCollections.cardCollections);
    setTotalCollections(newCollections.totalCollections);
  };

  let numPages = Math.ceil(totalCollections / ITEMS_PER_PAGE);

  return (
    <Box sx={{ height: "100%" }}>
      {createModalOpen && (
        <CreateCollectionModal
          open={createModalOpen}
          onClose={handleCreateModalClose}
        />
      )}
      {deleteModalOpen && (
        <ConfirmCollectionDeletionModal
          collectionId={deletingCollectionId}
          open={deleteModalOpen}
          onClose={handleDeleteModalClose}
        />
      )}
      <Box sx={{ p: "10px 10px" }}>
        <Typography component="h1" variant="h5" data-testid="welcome-message">
          {"Bon retour !"}
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650, tableLayout: "fixed" }}>
          <TableHead>
            <TableRow>
              <TableCell colSpan={3}>
                <Typography component="h2">Mes collections</Typography>
              </TableCell>
              <TableCell colSpan={2} align="right">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCreateModalOpen}
                  sx={{ fontSize: "0.7rem" }}
                  data-testid="create-collection-button"
                >
                  Ajouter une collection
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">Nom</TableCell>
              <TableCell align="center"># Cartes</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Réviser</TableCell>
              <TableCell align="center">Supprimer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {collections.map((row) => (
              <TableRow key={row._id.toString()}>
                <TableCell align="center" width="20%">
                  <Link
                    data-testid={`collection-${row._id.toString()}`}
                    onClick={() =>
                      navigate(`/collections/${row._id.toString()}`)
                    }
                  >
                    {row.name}
                  </Link>
                </TableCell>
                <TableCell align="center" width="20%">
                  {row.numCards}
                </TableCell>
                <TableExtendableTextCell
                  align="center"
                  text={row.description || ""}
                  width="25%"
                />

                <TableCell align="center" width="20%">
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleReviewClick(row._id.toString())}
                    sx={{ fontSize: "0.7rem" }}
                    data-testid={`review-button-${row._id.toString()}`}
                  >
                    Réviser
                  </Button>
                </TableCell>
                <TableCell align="center" width="20%">
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteModalOpen(row._id.toString())}
                    sx={{ fontSize: "0.7rem" }}
                    data-testid={`delete-collection-${row._id.toString()}`}
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
          className={classes.homeTablePagination}
          onChange={(event, value) => setCurrentPage(value)}
          page={currentPage}
        />
      )}
    </Box>
  );
}
