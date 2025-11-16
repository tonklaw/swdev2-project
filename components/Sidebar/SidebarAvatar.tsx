"use client";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useSession } from "next-auth/react";

import OptionsMenu from "./OptionsMenu";

export default function SidebarAvatar() {
  const { data: session, status } = useSession();
  const user = session?.user || null;

  return (
    <Stack
      direction="row"
      sx={{
        p: 2,
        gap: 1,
        alignItems: "center",
        borderTop: "1px solid var(--mui-palette-divider)",
      }}
    >
      <Avatar alt={user?.name || "User Avatar"} sx={{ width: 36, height: 36 }}>
        {user?.name?.charAt(0).toUpperCase()}
      </Avatar>
      <Box sx={{ mr: "auto" }}>
        <Typography
          variant="body2"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {status === "authenticated" ? user?.name : "Guest"}
        </Typography>
        {status === "authenticated" && (
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {user?.email}
          </Typography>
        )}
      </Box>
      <OptionsMenu />
    </Stack>
  );
}
