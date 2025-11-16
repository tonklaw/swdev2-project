import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import InventoryIcon from '@mui/icons-material/Inventory';
import Typography from "@mui/material/Typography";

export default function SideMenu() {
  // const theme = useTheme();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        display: { xs: "none", sm: "block" },
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: "var(--mui-palette-background-paper)"
        },
      }}
    >
    <Box 
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mt: 'calc(var(--template-frame-height, 0px) + 4px)',
        p: 1.5,
      }}
    >
      <InventoryIcon />
      <Typography variant="h4">Trackr</Typography>
    </Box>
    </Drawer>
  );
}