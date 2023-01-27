import React, { useEffect, useState, useContext } from "react";
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

export default function RevisionContent({ collectionId }) {
  const { loginToken } = useContext(AuthContext);
  const [isVersoShown, setIsVersoShown] = useState(false);
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(null);

  useEffect(() => {
    const fetchCards = async () => {
      const response = await fetch(`/api/memo/cards/${collectionId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + loginToken,
        },
      });
      const res = await response.json();
      setCards(res.cards);
      if (res.cards.length > 0) {
        setCurrentCardIndex(0);
      }
    };
    fetchCards();
  }, [loginToken, collectionId]);

  let boxCss = {
    height: isVersoShown ? "100vh" : "50vh",
    display: "flex",
    justifyContent: "center",
    alignItems: isVersoShown ? "center" : "end",
  };

  const handleShowVersoClick = (e) => {
    setIsVersoShown(true);
  };

  const handleActionClick = (e) => {
    setCurrentCardIndex((currVal) => currVal + 1);
  };

  const rectoCard =
    cards.length > 0 ? (
      <Card variant="outlined">
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {cards[currentCardIndex].title}
          </Typography>
          <Typography variant="body2">
            {cards[currentCardIndex].rectoContent}
          </Typography>
        </CardContent>
        <CardActions
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "end",
            justifyContent: "end ",
          }}
        >
          <Button
            variant="contained"
            size="small"
            onClick={handleShowVersoClick}
          >
            Afficher le verso
          </Button>
        </CardActions>
      </Card>
    ) : null;

  const versoCard =
    cards.length > 0 ? (
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
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {cards[currentCardIndex].title}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              flexGrow: 1,
            }}
          >
            <Box sx={{ width: "100%", flexGrow: 1 }}>
              <Typography variant="body2">
                {cards[currentCardIndex].rectoContent}
              </Typography>
            </Box>
            <Divider ligth style={{ width: "100%" }} />
            <Box sx={{ width: "100%", flexGrow: 1 }}>
              <Typography variant="body2">
                {cards[currentCardIndex].versoContent}
              </Typography>
            </Box>
          </Box>
        </CardContent>
        <CardActions
          sx={{
            display: "flex",
            justifyContent: "right",
            flexDirection: "row",
          }}
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
            <Button size="small" onClick={handleActionClick}>
              A revoir
            </Button>
            <Button size="small" onClick={handleActionClick}>
              Correct
            </Button>
            <Button size="small" onClick={handleActionClick}>
              Facile
            </Button>
          </ButtonGroup>
        </CardActions>
      </Card>
    ) : null;

  return (
    <Container sx={boxCss}>
      {cards.length > 0 && (
        <Box sx={{ minWidth: 400 }}>{isVersoShown ? versoCard : rectoCard}</Box>
      )}
    </Container>
  );
}
