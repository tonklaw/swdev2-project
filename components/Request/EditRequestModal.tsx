"use client";

import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

import { useRequestContext } from "@/contexts/RequestContext";
import { updateRequest } from "@/libs/requests";

const STOCK_OUT_LIMIT = 50;

function getValidationError(
  request: Request | null,
  formData: Partial<Request>,
): string | null {
  if (!request) return null;

  if (
    formData.transactionType === "stockOut" ||
    (formData.transactionType === undefined &&
      request.transactionType === "stockOut")
  ) {
    const amount = formData.itemAmount ?? request.itemAmount;
    const product =
      typeof request.product_id === "object" ? request.product_id : null;

    if (amount > STOCK_OUT_LIMIT) {
      return `Stock-out amount cannot exceed ${STOCK_OUT_LIMIT} items`;
    }

    if (
      product &&
      product.stockQuantity !== undefined &&
      amount > product.stockQuantity
    ) {
      return `Stock-out amount cannot exceed available stock of ${product.stockQuantity} items`;
    }
  }

  return null;
}

export default function EditRequestModal() {
  const {
    editingRequest,
    setEditingRequest,
    editModalOpen,
    setEditModalOpen,
    requests,
    setRequests,
  } = useRequestContext();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Request>>({});

  useEffect(() => {
    if (editingRequest) {
      setFormData({
        transactionType: editingRequest.transactionType,
        itemAmount: editingRequest.itemAmount,
      });
      setError(null);
      setValidationError(null);
    }
  }, [editingRequest]);

  useEffect(() => {
    if (editingRequest) {
      const validError = getValidationError(editingRequest, formData);
      setValidationError(validError);
    }
  }, [formData, editingRequest]);

  const handleSave = async () => {
    if (!editingRequest || !session?.user) {
      setError("No session found");
      return;
    }

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const userObj = session.user as Record<string, unknown> | undefined;
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

      const response = await updateRequest(token, editingRequest.id, formData);

      const updatedRequest = response.data || response;
      const updatedRequests = requests.map((req) =>
        req.id === editingRequest.id ? { ...req, ...updatedRequest } : req,
      );
      setRequests(updatedRequests);

      setEditModalOpen(false);
      setEditingRequest(null);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to update request";
      setError(errorMsg);
      console.error("Update request error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEditModalOpen(false);
    setEditingRequest(null);
    setError(null);
    setValidationError(null);
  };

  const stockQuantity =
    typeof editingRequest?.product_id === "object"
      ? editingRequest.product_id?.stockQuantity
      : undefined;

  return (
    <Modal open={editModalOpen} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 500 },
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          p: 3,
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography
            component="h2"
            id="modal-title"
            variant="h5"
            sx={{ fontWeight: 600 }}
          >
            Edit Request
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            size="small"
            sx={{ p: 1 }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={2} sx={{ my: 2 }}>
          <FormControl fullWidth>
            <FormLabel
              sx={{ fontSize: "0.875rem", mb: 0.5, color: "text.primary" }}
            >
              Request ID
            </FormLabel>
            <TextField
              value={editingRequest?.id || ""}
              disabled
              size="small"
              InputProps={{
                readOnly: true,
              }}
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel
              sx={{ fontSize: "0.875rem", mb: 0.5, color: "text.primary" }}
            >
              Transaction Type
            </FormLabel>
            <Select
              value={formData.transactionType || "stockIn"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  transactionType: e.target.value as "stockIn" | "stockOut",
                })
              }
              size="small"
            >
              <MenuItem value="stockIn">Stock In</MenuItem>
              <MenuItem value="stockOut">Stock Out</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth error={validationError !== null}>
            <FormLabel
              sx={{ fontSize: "0.875rem", mb: 0.5, color: "text.primary" }}
            >
              Item Amount
            </FormLabel>
            <TextField
              type="number"
              value={formData.itemAmount || 0}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  itemAmount: parseInt(e.target.value) || 0,
                })
              }
              size="small"
              inputProps={{
                min: 0,
                step: 1,
              }}
              error={validationError !== null}
            />
            {(formData.transactionType === "stockOut" ||
              (formData.transactionType === undefined &&
                editingRequest?.transactionType === "stockOut")) && (
              <FormHelperText>
                {stockQuantity !== undefined
                  ? `Available stock: ${stockQuantity} items`
                  : "Stock quantity: N/A"}
              </FormHelperText>
            )}
            {validationError && (
              <FormHelperText error>{validationError}</FormHelperText>
            )}
          </FormControl>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          sx={{ justifyContent: "flex-end", mt: 3 }}
        >
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={loading}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading || validationError !== null}
            sx={{ textTransform: "none" }}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
