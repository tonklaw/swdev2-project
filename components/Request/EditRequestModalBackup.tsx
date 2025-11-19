"use client";

import Alert from "@mui/joy/Alert";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
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
      <ModalDialog>
        <ModalClose variant="plain" sx={{ m: 1 }} />
        <Typography
          component="h2"
          id="modal-title"
          level="h4"
          textColor="inherit"
          sx={{ fontWeight: "lg", mb: 1 }}
        >
          Edit Request
        </Typography>
        {error && (
          <Alert color="danger" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Stack spacing={2} sx={{ my: 2 }}>
          <FormControl>
            <FormLabel>Request ID</FormLabel>
            <Input
              value={editingRequest?.id || ""}
              disabled
              slotProps={{ input: { readOnly: true } }}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Transaction Type</FormLabel>
            <Select
              value={formData.transactionType || "stockIn"}
              onChange={(_, value) =>
                setFormData({
                  ...formData,
                  transactionType: value as "stockIn" | "stockOut",
                })
              }
            >
              <Option value="stockIn">Stock In</Option>
              <Option value="stockOut">Stock Out</Option>
            </Select>
          </FormControl>

          <FormControl error={validationError !== null}>
            <FormLabel>Item Amount</FormLabel>
            <Input
              type="number"
              value={formData.itemAmount || 0}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  itemAmount: parseInt(e.target.value) || 0,
                })
              }
              slotProps={{
                input: {
                  min: 0,
                  step: 1,
                },
              }}
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
              <FormHelperText>{validationError}</FormHelperText>
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
            color="neutral"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            loading={loading}
            onClick={handleSave}
            color="primary"
            disabled={validationError !== null}
          >
            Save
          </Button>
        </Stack>
      </ModalDialog>
    </Modal>
  );
}
