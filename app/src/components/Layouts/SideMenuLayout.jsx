import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
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
import PublishIcon from "@mui/icons-material/Publish";
import Divider from "@mui/material/Divider";
import { SvgIcon } from "@mui/material";
import Logo from "../Common/MnemosyneLogo";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../store/redux-auth/reduxAuth";

import { AuthContext } from "../../store/auth-context";
import classes from "./SideMenuLayout.module.css";

const drawerWidth = 240;

export default function SideMenuLayout(props) {
  const { onLogout } = useContext(AuthContext);
  const { loginToken } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const response = await fetch("/api/auth/currentUser", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + loginToken,
        },
      });
      const res = await response.json();
      dispatch(authActions.login(res.user.email));
    };
    fetchCurrentUser();
  }, [loginToken, dispatch]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (selectedAction) => {
    setAnchorEl(null);
    switch (selectedAction) {
      case "logout":
        onLogout();
        navigate("/");
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
      case "Import":
        navigate("/import");
        break;
      default:
        break;
    }
  };

  const generateIcon = (text) => {
    let icon = null;
    switch (text) {
      case "Home":
        icon = <HomeIcon sx={{ color: "white", size: 0.5 }} />;
        break;
      case "Import":
        icon = <PublishIcon sx={{ color: "white", size: 0.5 }} />;
        break;
      default:
        break;
    }
    return icon;
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
                data-testid="side-menu-logo"
              />
              <Avatar
                sx={{ textAlign: "center" }}
                onClick={handleClick}
                data-testid="side-menu-avatar"
              >
                {user && user[0].toUpperCase()}
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
            {["Home", "Import"].map((text, index) => (
              <ListItem key={text}>
                <ListItemButton
                  onClick={() => handleNavMenuClick(text)}
                  data-testid={`side-menu-item-${text}`}
                >
                  <ListItemIcon>{generateIcon(text)}</ListItemIcon>
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
          height: "100vh",
        }}
      >
        {props.children}
      </Box>
    </Box>
  );
}
