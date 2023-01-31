import React, { useState, useContext } from "react";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { AuthContext } from "../../store/auth-context";
import classes from "./SideMenuLayout.module.css";

export default function SideMenuLayout(props) {
  const { onLogout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (selectedAction) => {
    setAnchorEl(null);
    switch (selectedAction) {
      case "logout":
        onLogout();
        break;
      default:
        break;
    }
  };

  return (
    <Grid container className={classes.gridContainer} component="main">
      <Grid item xs={6} md={2} className={classes.grid}>
        <List className={classes.sideMenuItems}>
          <Avatar onClick={handleClick}>H</Avatar>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={() => handleClose("logout")}>Logout</MenuItem>
          </Menu>
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
