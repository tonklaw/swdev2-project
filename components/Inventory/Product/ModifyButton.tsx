"use client";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import { DialogContent, DialogTitle, Snackbar } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Link from "next/link";
import { useSession } from "next-auth/react";
import React from "react";

import { deleteProduct } from "@/libs/products";

interface ModifyButtonProps extends IconButtonProps {
  product: Product;
  onDelete?: () => void;
}

export default function ModifyButton({
  product,
  onDelete,
  ...props
}: ModifyButtonProps) {
  const { data: session, status } = useSession();
  const [deleteSuccess, setDeleteSuccess] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(session?.user?.token as string, product.id);
      setSnackbarMessage(`Product "${product.name}" deleted successfully.`);
      setDeleteSuccess(true);
    } catch (error) {
      setSnackbarMessage(
        `Failed to delete product "${product.name}": ${error}`,
      );
    }
    handleDialogClose();
    setSnackbarOpen(true);
  };

  return (
    <React.Fragment>
      <IconButton
        {...props}
        onClick={handleClick}
        sx={{
          borderColor: "transparent",
          display:
            status === "authenticated" && session?.user?.role === "admin"
              ? "inline-flex"
              : "none",
        }}
      >
        <MoreVertRoundedIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="modify-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            padding: 0,
            minWidth: "160px",
          },
          "& .MuiMenu-list": {
            padding: "4px",
          },
          "& .divider": {
            margin: "4px -4px",
          },
        }}
      >
        <MenuItem onClick={handleClose}>
          <Link
            href={`/inventory/${product.id}/edit`}
            style={{ textDecoration: "none", color: "inherit", width: "100%" }}
          >
            Edit Product
          </Link>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleDialogOpen();
            handleClose();
          }}
          sx={{
            "&:hover": {
              backgroundColor: "error.main",
              color: "error.contrastText",
            },
          }}
        >
          Delete Product
        </MenuItem>
      </Menu>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="delete-product-dialog-title"
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "background.paper",
            backgroundImage: "none",
          },
        }}
      >
        <DialogTitle>Delete Product &quot;{product.name}&quot;</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this product? This action cannot be
          undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={1000}
        onClose={() => {
          setSnackbarOpen(false);
          if (deleteSuccess && onDelete) {
            onDelete();
          }
        }}
      />
    </React.Fragment>
  );
}
