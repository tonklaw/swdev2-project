import Box from "@mui/material/Box";
import Inventory2Rounded from "@mui/icons-material/Inventory2Rounded";
import Typography from "@mui/material/Typography";
import ColorSchemeToggle from "./ColorSchemeToggle";
import Divider from "@mui/material/Divider";
import MenuContent from "./MenuContent";
import SidebarAvatar from "./SidebarAvatar";

import SwipeableDrawer from "@mui/material/SwipeableDrawer";

interface SideMenuMobileProps {
  open: boolean | undefined;
  toggleDrawer: (open: boolean) => () => void;
}

export default function SideMenuMobile({
  open,
  toggleDrawer,
}: SideMenuMobileProps) {
  const iOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <SwipeableDrawer
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      anchor="left"
      open={open}
      onOpen={toggleDrawer(true)}
      onClose={toggleDrawer(false)}
      sx={{
        // zIndex: 10001,
        [`& .MuiDrawer-paper`]: {
          // width: 240,
          backgroundImage: "none",
          boxSizing: "border-box",
          backgroundColor: "var(--mui-palette-background-paper)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mt: "calc(var(--template-frame-height, 0px) + 4px)",
          p: 1.5,
        }}
      >
        <Inventory2Rounded sx={{ ml: 1 }} />
        <Typography variant="h4">Trackr</Typography>
        <ColorSchemeToggle sx={{ ml: "auto" }} />
      </Box>
      <Divider />
      <Box
        sx={{
          overflow: "auto",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <MenuContent />
      </Box>
      <Divider />
      <SidebarAvatar />
    </SwipeableDrawer>
  );
}
