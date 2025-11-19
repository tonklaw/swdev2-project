"use client";
import AssignmentReturnRoundedIcon from "@mui/icons-material/AssignmentReturnRounded";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useSession } from "next-auth/react";

interface RequestButtonProps extends IconButtonProps {
  productId: string;
}

export default function RequestButton({
  productId,
  ...props
}: RequestButtonProps) {
  const { status } = useSession();

  if (status !== "authenticated") {
    return null;
  }

  return (
    <Stack
      sx={{
        minWidth: 0,
        direction: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "100%",
        }}
      >
        Request
      </Typography>
      <IconButton {...props}>
        <Link
          href={`/requests/new?productId=${productId}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <AssignmentReturnRoundedIcon />
        </Link>
      </IconButton>
    </Stack>
  );
}
