"use client";

import Alert from "@mui/joy/Alert";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
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
    <Modal open={deleteConfirmOpen} onClose={handleClose}>
      <ModalDialog variant="outlined" role="alertdialog">
        <ModalClose variant="plain" sx={{ m: 1 }} />
        <Typography
          component="h2"
          id="alert-dialog-modal-title"
          level="h4"
          textColor="inherit"
          sx={{ fontWeight: "lg", mb: 1 }}
        >
          Delete Request
        </Typography>
        {error && (
          <Alert color="danger" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Typography id="alert-dialog-modal-description" sx={{ mb: 2 }}>
          Are you sure you want to delete this request? This action cannot be
          undone.
        </Typography>

        <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            color="neutral"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            loading={loading}
            onClick={handleDelete}
            color="danger"
            variant="solid"
          >
            Delete
          </Button>
        </Stack>
      </ModalDialog>
    </Modal>
  );
}
