import React, { useEffect, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../store/auth-context";
import RevisionCard from "./RevisionCard/RevisionCard";

const ITEMS_IN_MEMORY = 10;

export default function RevisionContent({ collectionId }) {
  const { loginToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [numCards, setNumCards] = useState(null);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(null);

  // const fetchCards = useCallback(async () => {
  //   const response = await fetch(`/api/memo/cards/${collectionId}`, {
  //     method: "GET",
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer " + loginToken,
  //     },
  //   });
  //   const res = await response.json();
  //   setCards(res.cards);
  //   setNumCards(res.totalCards);
  //   if (res.cards.length > 0) {
  //     setCurrentCardIndex(0);
  //   }
  // }, [loginToken, collectionId]);

  useEffect(() => {
    const fetchCards = async () => {
      const response = await fetch(
        `/api/memo/cards/${collectionId}?offset=${currentOffset}&limit=${ITEMS_IN_MEMORY}`,
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
      setCards(res.cards);
      setNumCards(res.totalCards);
      setCurrentCardIndex(0);
    };
    fetchCards();
  }, [loginToken, collectionId, currentOffset]);

  useEffect(() => {
    if (currentCardIndex && currentCardIndex >= cards.length) {
      navigate("/");
    }
  }, [currentCardIndex, cards, navigate]);

  const handleActionClick = (e) => {
    setCurrentCardIndex((currVal) => currVal + 1);
  };

  return currentCardIndex < cards.length ? (
    <RevisionCard
      card={cards[currentCardIndex]}
      handleActionClick={handleActionClick}
    />
  ) : (
    <p>Il n'y a pas de cartes dans cette collection</p>
  );
}
