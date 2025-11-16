"use client";

import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import { useColorScheme } from "@mui/material/styles";
import React from "react";

export default function ColorSchemeToggle(props: IconButtonProps) {
  const { onClick, sx, ...other } = props;
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <IconButton
        {...other}
        sx={sx}
        disabled
      />
    );
  }

  return (
    <IconButton
      onClick={(event) => {
        switch (mode) {
          case "light":
            setMode("dark");
            break;
          case "dark":
            setMode("system");
            break;
          case "system":
          default:
            setMode("light");
            break;
        }
        onClick?.(event);
      }}
      sx={sx}
      {...other}
    >
      {mode === "light" ? "🌞" : mode === "dark" ? "🌜" : "🖥️"}
    </IconButton>
  );
}