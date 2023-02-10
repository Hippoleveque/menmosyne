import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import HomeIcon from "@mui/icons-material/Home";
import Divider from "@mui/material/Divider";
import { SvgIcon } from "@mui/material";
import Logo from "../Common/MnemosyneLogo";

import { AuthContext } from "../../store/auth-context";
import classes from "./SideMenuLayout.module.css";

const drawerWidth = 240;

export default function SideMenuLayout(props) {
  const { onLogout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
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

  const handleNavMenuClick = (selectedMenu) => {
    switch (selectedMenu) {
      case "Home":
        navigate("/");
        break;
      default:
        break;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
        className={classes.sideMenu}
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
            color: "red",
          }}
          PaperProps={{ sx: { backgroundColor: "#042141" } }}
          open
        >
          <List className={classes.sideMenuItems}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              <SvgIcon
                component={Logo}
                viewBox="0 0 75 75"
                sx={{ fontSize: "2.5rem" }}
              />
              <Avatar sx={{ textAlign: "center" }} onClick={handleClick}>
                H
              </Avatar>
            </Box>
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
            <Divider
              sx={{ bgcolor: "white", width: "100%", marginTop: "1rem" }}
            />
            {["Home"].map((text, index) => (
              <ListItem key={text}>
                <ListItemButton onClick={() => handleNavMenuClick(text)}>
                  <ListItemIcon>
                    <HomeIcon sx={{ color: "white", size: 0.5 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={text}
                    className={classes.sideMenuItem}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {props.children}
      </Box>
    </Box>
  );
}
