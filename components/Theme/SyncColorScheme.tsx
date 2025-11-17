"use client";

import { useColorScheme as useJoyColorScheme } from "@mui/joy/styles";
import { useColorScheme as useMUIColorScheme } from "@mui/material/styles";
import * as React from "react";

export default function SyncColorScheme() {
  const mui = useMUIColorScheme();
  const joy = useJoyColorScheme();
  const lastSyncedModeRef = React.useRef<string | undefined>(undefined);

  React.useLayoutEffect(() => {
    if (!mui.mode || !joy.mode) return;

    if (lastSyncedModeRef.current !== mui.mode) {
      lastSyncedModeRef.current = mui.mode;
      if (joy.mode !== mui.mode) {
        joy.setMode(mui.mode);
      }
    }
  }, [mui.mode, joy]);

  return null;
}
