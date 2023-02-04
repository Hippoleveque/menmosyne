import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import ButtonGroup from "@mui/material/ButtonGroup";
import Divider from "@mui/material/Divider";
import classes from "./RevisionCard.module.css";

export default function RevisionCard({ card, handleActionClick }) {
  const [isVersoShown, setIsVersoShown] = useState(false);

  useEffect(() => {
    setIsVersoShown(false);
  }, [card])

  const handleShowVersoClick = (e) => {
    setIsVersoShown(true);
  };

  let boxCss = {
    height: isVersoShown ? "100vh" : "50vh",
    display: "flex",
    justifyContent: "center",
    alignItems: isVersoShown ? "center" : "end",
  };

  const rectoCard = (
    <Card variant="outlined">
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {card.title}
        </Typography>
        <Typography variant="body2">{card.rectoContent}</Typography>
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
      className={classes.versoCard}
    >
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {card.title}
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
            <Typography variant="body2">{card.rectoContent}</Typography>
          </Box>
          <Divider light style={{ width: "100%" }} />
          <Box sx={{ width: "100%", flexGrow: 1 }}>
            <Typography variant="body2">{card.versoContent}</Typography>
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
  );

  return (
    <Container sx={boxCss}>
      {<Box sx={{ minWidth: 400 }}>{isVersoShown ? versoCard : rectoCard}</Box>}
    </Container>
  );
}
