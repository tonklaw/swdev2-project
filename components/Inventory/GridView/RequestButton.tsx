"use client";
import AssignmentReturnRoundedIcon from "@mui/icons-material/AssignmentReturnRounded";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Link from "@mui/material/Link";
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
    <IconButton {...props}>
      <Link
        href={`/requests/new?productId=${productId}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <AssignmentReturnRoundedIcon></AssignmentReturnRoundedIcon>
      </Link>
    </IconButton>
  );
}
