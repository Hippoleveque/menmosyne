import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import Avatar from "@mui/material/Avatar";

import classes from "./SideMenuLayout.module.css";

export default function SideMenuLayout(props) {
  return (
    <Grid container className={classes.gridContainer} component="main">
      <Grid item xs={6} md={2} className={classes.grid}>
        <List className={classes.sideMenuItems}>
          <Avatar>H</Avatar>
          {["Home"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemText primary={text} className={classes.sideMenuItem} />
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
