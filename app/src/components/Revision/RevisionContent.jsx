import React, { useEffect, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import { AuthContext } from "../../store/auth-context";
import RevisionCard from "./RevisionCard/RevisionCard";
import ContinueRevisionModal from "./ContinueRevisionModal/ContinueRevisionModal";

const ANS_QUALITY_MAPPING = { 5: "easy", 3: "medium", 0: "hard" };

export default function RevisionContent({ collectionId }) {
  const { loginToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cards, setCards] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cardsToReview, setCardsToReview] = useState([]);
  const [cardsInputHistory, setCardsInputHistory] = useState({});
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isContinueModalOpen, setIsContinueModalOpen] = useState(false);

  const fetchCards = useCallback(async () => {
    setIsLoading(true);
    const response = await fetch(
      `/api/collections/${collectionId}/cards-to-review`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + loginToken,
        },
      }
    );
    const res = await response.json();
    setCurrentCardIndex(0);
    setCards(res.cards);
    setIsLoading(false);
  }, [collectionId, loginToken]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  useEffect(() => {
    if (cards && cards.length === 0) {
      navigate("/");
    } else if (
      currentCardIndex &&
      currentCardIndex >= cards.length &&
      !cardsToReview.length
    ) {
      setIsContinueModalOpen(true);
    }
  }, [currentCardIndex, cards, navigate, cardsToReview.length]);

  const reviewCard = async (cardId, ansQuality, inputs) => {
    const response = await fetch(`/api/cards/${cardId}/review`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + loginToken,
      },
      body: JSON.stringify({
        ansQuality,
        inputs,
      }),
    });
    const res = await response.json();
    return res;
  };

  const handleReviewAction = async (ansQuality) => {
    if (ansQuality !== 5) {
      // TO DO: find a better way to do this
      if (cards && currentCardIndex < cards.length) {
        setCardsToReview((currCards) =>
          currCards.concat(JSON.parse(JSON.stringify(cards[currentCardIndex])))
        );
        setCardsInputHistory((currHistory) => {
          const newHistory = { ...currHistory };
          newHistory[cards[currentCardIndex]._id.toString()] = {};
          newHistory[cards[currentCardIndex]._id.toString()][
            ANS_QUALITY_MAPPING[ansQuality]
          ] = 1;
          return newHistory;
        });
      } else {
        setCardsToReview((currCards) =>
          currCards.concat(JSON.parse(JSON.stringify(cardsToReview[0])))
        );
        if (
          cardsInputHistory[cardsToReview[0]._id.toString()][
            ANS_QUALITY_MAPPING[ansQuality]
          ]
        ) {
          setCardsInputHistory((currHistory) => {
            const newHistory = { ...currHistory };
            newHistory[cardsToReview[0]._id.toString()][
              ANS_QUALITY_MAPPING[ansQuality]
            ] += 1;
            return newHistory;
          });
        } else {
          setCardsInputHistory((currHistory) => {
            const newHistory = { ...currHistory };
            newHistory[cardsToReview[0]._id.toString()][
              ANS_QUALITY_MAPPING[ansQuality]
            ] = 1;
            return newHistory;
          });
        }
      }
    }

    if (cards && currentCardIndex < cards.length) {
      await reviewCard(cards[currentCardIndex]._id.toString(), ansQuality);
      setCurrentCardIndex((currVal) => currVal + 1);
    } else {
      await reviewCard(
        cardsToReview[0]._id.toString(),
        ansQuality,
        cardsInputHistory[cardsToReview[0]._id.toString()]
      );
      setCardsToReview((currCards) => currCards.slice(1));
    }
  };

  const handleContinueReview = async () => {
    await fetchCards();
    setIsContinueModalOpen(false);
  };

  const handleContinueModalClose = () => {
    setIsContinueModalOpen(false);
    navigate("/");
  };

  let card;
  if (cards && currentCardIndex < cards.length) {
    card = cards[currentCardIndex];
  } else if (cardsToReview.length) {
    card = cardsToReview[0];
  }

  return isLoading ? (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <CircularProgress />
    </Box>
  ) : (
    <>
      {isContinueModalOpen && (
        <ContinueRevisionModal
          onClose={handleContinueModalClose}
          onContinueReview={handleContinueReview}
          open={isContinueModalOpen}
        />
      )}
      <RevisionCard card={card} handleReviewAction={handleReviewAction} />
    </>
  );
}
