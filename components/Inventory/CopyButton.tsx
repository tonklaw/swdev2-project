"use client";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import React from "react";

interface CopyButtonProps extends IconButtonProps {
  text: string;
}

export default function CopyButton(props: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const textToCopy = props.text;
    navigator.clipboard.writeText(textToCopy).then(
      () => {
        console.log("Text copied to clipboard");
      },
      (err) => {
        console.error("Could not copy text: ", err);
      },
    );
  };

  return (
    <React.Fragment>
      <IconButton
        {...props}
        onClick={() => {
          handleCopy();
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
      >
        <ContentCopyRoundedIcon />
      </IconButton>
      <Snackbar
        open={copied}
        message="Copied to clipboard"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={1000}
        onClose={() => setCopied(false)}
      />
    </React.Fragment>
  );
}
