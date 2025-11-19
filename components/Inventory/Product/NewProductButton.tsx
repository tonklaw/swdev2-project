"use client";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import Button, { ButtonProps } from "@mui/material/Button";
import { useSession } from "next-auth/react";

export default function NewProductButton(props: ButtonProps) {
  const { data: session } = useSession();

  if (session?.user?.role !== "admin") {
    return null;
  }

  return (
    <Button
      variant="contained"
      color="primary"
      href="/inventory/new"
      startIcon={<AddRoundedIcon />}
      {...props}
    >
      Add New Product
    </Button>
  );
}
