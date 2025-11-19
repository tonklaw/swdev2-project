"use client";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
// import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
// import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import Inventory2Rounded from "@mui/icons-material/Inventory2Rounded";
// import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { usePathname } from "next/navigation";

const mainMenuItems = [
  // { text: "Home", icon: <HomeRoundedIcon />, link: "/" },
  { text: "Inventory", icon: <Inventory2Rounded />, link: "/inventory" },
  { text: "Requests", icon: <AssignmentRoundedIcon />, link: "/requests" },
];

const secondaryMenuItems: {
  text: string;
  icon: React.ReactNode;
  link: string;
}[] = [
  // { text: "Settings", icon: <SettingsRoundedIcon />, link: "/settings" },
  // { text: "About", icon: <InfoRoundedIcon />, link: "/about" },
];

export default function MenuContent() {
  const pathname = usePathname();

  return (
    <Stack
      sx={{
        flexGrow: 1,
        p: 1,
        justifyContent: "space-between",
      }}
    >
      <List dense>
        {mainMenuItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton selected={pathname === item.link} href={item.link}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryMenuItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton selected={pathname === item.link} href={item.link}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
