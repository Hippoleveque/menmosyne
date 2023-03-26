import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import { AuthContext } from "../../store/auth-context";
import RevisionCard from "./RevisionCard/RevisionCard";

const FETCH_SIZE = 10;
const ANS_QUALITY_MAPPING = { 5: "easy", 3: "medium", 0: "hard" };

export default function RevisionContent({ collectionId }) {
  const { loginToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cards, setCards] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cardsToReview, setCardsToReview] = useState([]);
  const [cardsInputHistory, setCardsInputHistory] = useState({});
  const [currentOffset, setCurrentOffset] = useState(0);
  const [numCards, setNumCards] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchCards = async () => {
      setIsLoading(true);
      const response = await fetch(
        `/api/collections/${collectionId}/cards-to-review?offset=${currentOffset}&limit=${FETCH_SIZE}`,
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
      setCards((currCards) =>
        currCards ? currCards.concat(res.cards) : res.cards
      );
      setNumCards(res.totalCards);
      setIsLoading(false);
    };
    fetchCards();
  }, [loginToken, collectionId, currentOffset]);

  useEffect(() => {
    const createSession = async () => {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + loginToken,
        },
        body: JSON.stringify({ cardCollectionId: collectionId }),
      });
      const res = await response.json();
      setSession(res.dailySession);
    };
    createSession();
  }, [loginToken, collectionId]);

  useEffect(() => {
    // if (
    //   cards &&
    //   currentCardIndex === cards.length &&
    //   currentCardIndex < numCards
    // ) {
    //   setCurrentOffset((currVal) => currVal + FETCH_SIZE);
    // }
    if (
      (!isLoading && numCards === 0) ||
      (currentCardIndex &&
        currentCardIndex >= numCards &&
        !cardsToReview.length)
    ) {
      navigate("/");
    }
  }, [currentCardIndex, cards, navigate, numCards, cardsToReview.length]);

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
        dailySessionId: session._id,
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
        cardsInputHistory[cards[currentCardIndex]._id] = {};
        cardsInputHistory[cards[currentCardIndex]._id][
          ANS_QUALITY_MAPPING[ansQuality]
        ] = 1;
      } else {
        setCardsToReview((currCards) =>
          currCards.concat(JSON.parse(JSON.stringify(cardsToReview[0])))
        );
        if (
          cardsInputHistory[cardsToReview[0]._id.toString()][
            ANS_QUALITY_MAPPING[ansQuality]
          ]
        ) {
          cardsInputHistory[cardsToReview[0]._id.toString()][
            ANS_QUALITY_MAPPING[ansQuality]
          ] += 1;
        } else {
          cardsInputHistory[cardsToReview[0]._id.toString()][
            ANS_QUALITY_MAPPING[ansQuality]
          ] = 1;
        }
      }
    }

    if (cards && currentCardIndex < cards.length) {
      await reviewCard(cards[currentCardIndex]._id.toString(), ansQuality);
      setCurrentCardIndex((currVal) => currVal + 1);
      if (currentCardIndex >= cards.length) {
        setCurrentOffset((currVal) => currVal + FETCH_SIZE);
      }
    } else {
      await reviewCard(
        cardsToReview[0]._id.toString(),
        ansQuality,
        cardsInputHistory[cardsToReview[0]._id.toString()]
      );
      setCardsToReview((currCards) => currCards.slice(1));
    }
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
    <RevisionCard card={card} handleReviewAction={handleReviewAction} />
  );
}
