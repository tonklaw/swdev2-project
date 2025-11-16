"use client";
import AppBar from "@mui/material/AppBar";
import Stack from "@mui/material/Stack";
import MuiToolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Inventory2Rounded from "@mui/icons-material/Inventory2Rounded";
import React from "react";
import { styled } from "@mui/material/styles";
import { tabsClasses } from "@mui/material/Tabs";
import { useSession } from "next-auth/react";
import IconButton from "@mui/material/IconButton";
import SideMenuMobile from "./SideMenuMobile";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

const Toolbar = styled(MuiToolbar)({
  width: "100%",
  padding: "12px",
  display: "flex",
  flexDirection: "column",
  alignItems: "start",
  justifyContent: "center",
  backgroundColor: "background.paper",
  gap: "12px",
  flexShrink: 0,
  [`& ${tabsClasses.flexContainer}`]: {
    gap: "8px",
    p: "8px",
    pb: 0,
  },
});

export default function AppNavBar() {
  const { data: session, status } = useSession();
  const [open, setOpen] = React.useState(false);

  const user = session?.user || null;

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        display: { xs: "auto", md: "none" },
        boxShadow: 0,
        backgroundColor: "background.paper",
        backgroundImage: "none",
        borderBottom: "1px solid",
        borderColor: "divider",
        top: "var(--template-frame-height, 0px)",
      }}
    >
      <Toolbar variant="regular">
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            flexGrow: 1,
            width: "100%",
            gap: 1,
          }}
        >
          <IconButton aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuRoundedIcon />
          </IconButton>
          <Stack
            direction="row"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
            onClick={() => {
              toggleDrawer(true);
            }}
          >
            <Inventory2Rounded sx={{ color: "text.primary" }} />
            <Typography variant="h4" sx={{ color: "text.primary" }}>
              Trackr
            </Typography>
          </Stack>
          <SideMenuMobile open={open} toggleDrawer={toggleDrawer} />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
