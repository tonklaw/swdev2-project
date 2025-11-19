"use client";

import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

import { useRequestContext } from "@/contexts/RequestContext";
import { deleteRequest } from "@/libs/requests";

export default function DeleteRequestModal() {
  const {
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    deleteRequestId,
    setDeleteRequestId,
    requests,
    setRequests,
  } = useRequestContext();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteRequestId || !session?.user) {
      setError("No session found");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const userObj = session?.user as Record<string, unknown> | undefined;
      const candidate = userObj
        ? (userObj["token"] ??
          userObj["accessToken"] ??
          userObj["access_token"] ??
          userObj["jwt"])
        : undefined;
      const token =
        typeof candidate === "string" && candidate.length > 0
          ? candidate
          : undefined;

      if (!token) {
        throw new Error("No authentication token found");
      }

      await deleteRequest(token, deleteRequestId);

      const updatedRequests = requests.filter(
        (req) => req.id !== deleteRequestId,
      );
      setRequests(updatedRequests);

      setDeleteConfirmOpen(false);
      setDeleteRequestId(null);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to delete request";
      setError(errorMsg);
      console.error("Delete request error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDeleteConfirmOpen(false);
    setDeleteRequestId(null);
    setError(null);
  };

  return (
    <Dialog
      open={deleteConfirmOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 600 }}>
        Delete Request
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this request? This action cannot be
          undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={loading}
            autoFocus
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
