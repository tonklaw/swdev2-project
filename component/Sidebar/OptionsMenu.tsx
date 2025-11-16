"use client";
import React from "react";
import IconButton from "@mui/material/IconButton";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import { signIn, signOut, useSession } from "next-auth/react";

export default function OptionsMenu() {
  const { status } = useSession();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="options"
        onClick={handleClick}
        sx={{ borderColor: "transparent" }}
      >
        <MoreVertRoundedIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="options-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        sx={{
          "& .MuiMenu-paper": {
            padding: 0,
            minWidth: "160px",
          },
          "& .MuiMenu-list": {
            padding: "4px",
          },
          "& .divider": {
            margin: "4px -4px",
          },
        }}
      >
        {status === "authenticated" && [
          <MenuItem key="profile" onClick={handleClose}>
            Profile
          </MenuItem>,
          <MenuItem key="settings" onClick={handleClose}>
            Settings
          </MenuItem>,
          <Divider key="divider1" className="divider" />,
          // <Divider key="divider2" className="divider" />
        ]}

        <MenuItem
          onClick={() => {
            if (status === "authenticated") {
              signOut();
            } else {
              signIn();
            }
            handleClose();
          }}
          sx={{
            "& .MuiListItemIcon-root": {
              ml: "auto",
              minWidth: 0,
            },
          }}
        >
          {status === "authenticated" ? (
            <>
              <ListItemText>Logout</ListItemText>
              <ListItemIcon>
                <LogoutRoundedIcon fontSize="small" />
              </ListItemIcon>
            </>
          ) : (
            <>
              <ListItemText>Login</ListItemText>
              <ListItemIcon>
                <LoginRoundedIcon fontSize="small" />
              </ListItemIcon>
            </>
          )}
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
