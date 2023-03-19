import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../store/auth-context";
import RevisionCard from "./RevisionCard/RevisionCard";

const FETCH_SIZE = 10;

export default function RevisionContent({ collectionId }) {
  const { loginToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cards, setCards] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cardsToReview, setCardsToReview] = useState([]);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [numCards, setNumCards] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  useEffect(() => {
    const fetchCards = async () => {
      setIsLoading(true);
      const response = await fetch(
        `/api/collections/${collectionId}/cards?offset=${currentOffset}&limit=${FETCH_SIZE}`,
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
    if (
      cards &&
      currentCardIndex === cards.length &&
      currentCardIndex < numCards
    ) {
      setCurrentOffset((currVal) => currVal + FETCH_SIZE);
    }
    if (
      (!isLoading && numCards === 0) ||
      (currentCardIndex &&
        currentCardIndex >= numCards &&
        !cardsToReview.length)
    ) {
      navigate("/");
    }
  }, [currentCardIndex, cards, navigate, numCards, cardsToReview.length]);

  const reviewCard = async (cardId, ansQuality) => {
    const response = await fetch(`/api/cards/${cardId}/review`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + loginToken,
      },
      body: JSON.stringify({ ansQuality }),
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
      } else {
        setCardsToReview((currCards) =>
          currCards.concat(JSON.parse(JSON.stringify(cardsToReview[0])))
        );
      }
    }
    if (cards && currentCardIndex < cards.length) {
      await reviewCard(cards[currentCardIndex]._id.toString(), ansQuality);
      setCurrentCardIndex((currVal) => currVal + 1);
    } else {
      await reviewCard(cardsToReview[0]._id.toString(), ansQuality);
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
    <h1> Loading... </h1>
  ) : (
    <RevisionCard card={card} handleReviewAction={handleReviewAction} />
  );
}
