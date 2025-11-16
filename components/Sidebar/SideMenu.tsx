import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Inventory2Rounded from "@mui/icons-material/Inventory2Rounded";
import Typography from "@mui/material/Typography";
import ColorSchemeToggle from "./ColorSchemeToggle";
import Divider from "@mui/material/Divider";
import MenuContent from "./MenuContent";
import SidebarAvatar from "./SidebarAvatar";

export default function SideMenu() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        position: { xs: "fixed", md: "sticky" },
        // zIndex: 10000,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: "var(--mui-palette-background-paper)",
          transform: {
            xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
            md: "none",
          },
          transition: "transform 0.4s, width 0.4s",
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
    </Drawer>
  );
}
