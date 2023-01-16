import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";

export default function SideMenuLayout(props) {
  const navigate = useNavigate();

  const handleNavigate = (uri) => {
    navigate(uri);
  };

  return (
    <Grid container sx={{ width: "100%", height: "100vh" }} component="main">
      <Grid item xs={6} md={2} sx={{ backgroundColor: "#042040" }}>
        <List>
          {["Home"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemText
                  primary={text}
                  sx={{ color: "white", textAlign: "center" }}
                  onClick={() => handleNavigate("/")}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Grid>
      <Grid item xs={6} md={10}>
        {props.children}
      </Grid>
    </Grid>
  );
}
