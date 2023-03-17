import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../store/auth-context";
import RevisionCard from "./RevisionCard/RevisionCard";

const FETCH_SIZE = 10;

export default function RevisionContent({ collectionId }) {
  const { loginToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cards, setCards] = useState(null);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [numCards, setNumCards] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  useEffect(() => {
    const fetchCards = async () => {
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
    };
    fetchCards();
  }, [loginToken, collectionId, currentOffset]);

  useEffect(() => {
    if (cards && currentCardIndex === cards.length) {
      setCurrentOffset((currVal) => currVal + FETCH_SIZE);
    }
    if (currentCardIndex && currentCardIndex >= numCards) {
      navigate("/");
    }
  }, [currentCardIndex, cards, navigate, numCards]);

  const handleActionClick = (e) => {
    setCurrentCardIndex((currVal) => currVal + 1);
  };

  return cards && currentCardIndex < cards.length ? (
    <RevisionCard
      card={cards[currentCardIndex]}
      handleActionClick={handleActionClick}
    />
  ) : (
    <h1> Loading... </h1>
  );
}
