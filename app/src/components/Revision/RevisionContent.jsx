import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import ButtonGroup from "@mui/material/ButtonGroup";
import Divider from "@mui/material/Divider";

import { AuthContext } from "../../store/auth-context";

export default function RevisionContent() {
  const { loginToken } = useContext(AuthContext);
  const { collectionId } = useParams();
  const navigate = useNavigate();

  const [isVersoShown, setIsVersoShown] = useState(false);
  const [cardsRevised, setCardsRevised] = useState(0);
  const [currentCard, setCurrentCard] = useState({});

  let boxCss = {
    height: isVersoShown ? "100vh" : "50vh",
    display: "flex",
    justifyContent: "center",
    alignItems: isVersoShown ? "center" : "end",
  };

  const handleShowVersoClick = (e) => {
    setIsVersoShown(true);
  };

  useEffect(() => {
    const fetchCards = async () => {
      const url = `/api/memo/cards?offset=${cardsRevised}&limit=1&cardCollectionId=${collectionId}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + loginToken,
        },
      });
      const res = await response.json();
      if (res.cards.length === 0) {
        navigate("/");
      }
      setCurrentCard(res.cards[0]);
    };
    fetchCards();
  }, [cardsRevised, loginToken, collectionId, navigate]);

  const finishCardReviewHandler = (e) => {
    setIsVersoShown(false);
    setCardsRevised((oldNum) => oldNum + 1);
  };

  const rectoCard = (
    <Card variant="outlined">
      <CardContent>
        {currentCard.title && (
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {currentCard.title}
          </Typography>
        )}
        <Typography variant="body2">{currentCard.rectoContent}</Typography>
      </CardContent>
      <CardActions
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "end",
          justifyContent: "end ",
        }}
      >
        <Button variant="contained" size="small" onClick={handleShowVersoClick}>
          Afficher le verso
        </Button>
      </CardActions>
    </Card>
  );

  const versoCard = (
    <Card
      variant="outlined"
      sx={{
        minHeight: "300px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {currentCard.title && (
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {currentCard.title}
          </Typography>
        )}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            flexGrow: 1,
          }}
        >
          <Box sx={{ width: "100%", flexGrow: 1 }}>
            <Typography variant="body2">{currentCard.rectoContent}</Typography>
          </Box>
          <Divider ligth style={{ width: "100%" }} />
          <Box sx={{ width: "100%", flexGrow: 1 }}>
            <Typography variant="body2">{currentCard.versoContent}</Typography>
          </Box>
        </Box>
      </CardContent>
      <CardActions
        sx={{ display: "flex", justifyContent: "right", flexDirection: "row" }}
      >
        <ButtonGroup
          variant="outlined"
          aria-label="outlined button group"
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "right",
            flexGrow: 1,
          }}
        >
          <Button size="small" onClick={finishCardReviewHandler}>
            A revoir
          </Button>
          <Button size="small" onClick={finishCardReviewHandler}>
            Correct
          </Button>
          <Button size="small" onClick={finishCardReviewHandler}>
            Facile
          </Button>
        </ButtonGroup>
      </CardActions>
    </Card>
  );

  return (
    <Container sx={boxCss}>
      <Box sx={{ minWidth: 400 }}>{isVersoShown ? versoCard : rectoCard}</Box>
    </Container>
  );
}
