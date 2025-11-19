"use client";

import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import FormHelperText from "@mui/material/FormHelperText";
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
import { getProductById } from "@/libs/products";
import { updateRequest } from "@/libs/requests";

import NumberField from "../NumberField";

const STOCK_OUT_LIMIT = 50;

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

  const [product, setProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    if (editingRequest) {
      (async () => {
        const productId = editingRequest.product_id;
        if (typeof productId === "string") {
          const { data: product } = await getProductById(productId);
          setProduct(product);
        } else if (typeof productId === "object" && productId !== null) {
          setProduct(productId);
        }
      })();
    }
  }, [editingRequest]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setSubmitting(true);

    if (!editingRequest) {
      setSubmitting(false);
      return;
    }

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const transactionType = formData.get("transactionType") as
      | "stockIn"
      | "stockOut";
    const itemAmount = Number(formData.get("itemAmount"));

    if (!itemAmount || itemAmount <= 0) {
      setFieldErrors((prev) => ({
        ...prev,
        itemAmount: "Item amount must be greater than 0.",
      }));
      setSubmitting(false);
      return;
    }

    if (
      product &&
      itemAmount > product.stockQuantity &&
      transactionType === "stockOut"
    ) {
      setFieldErrors((prev) => ({
        ...prev,
        itemAmount: `Item amount exceeds current stock quantity (${product.stockQuantity}).`,
      }));
      setSubmitting(false);
      return;
    }

    if (itemAmount > STOCK_OUT_LIMIT && transactionType === "stockOut") {
      setFieldErrors((prev) => ({
        ...prev,
        itemAmount: `Item amount cannot exceed ${STOCK_OUT_LIMIT} items. `,
      }));
      setSubmitting(false);
      return;
    }

    await updateRequest(session?.user!.token as string, editingRequest.id, {
      ...editingRequest,
      transactionType,
      itemAmount,
    } as Request);

    const updatedRequests = requests.map((req) =>
      req.id === editingRequest.id
        ? { ...req, transactionType, itemAmount }
        : req,
    );

    setRequests(updatedRequests);
    setSubmitting(false);
    setEditModalOpen(false);
    setEditingRequest(null);
  };

  const handleClose = () => {
    setEditModalOpen(false);
    setEditingRequest(null);
    setFieldErrors({});
  };

  return (
    <Modal open={editModalOpen} onClose={handleClose}>
      <Card sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
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
        <form onSubmit={handleSave}>
          <Stack spacing={2}>
            <TextField
              size="small"
              label="Product ID"
              variant="filled"
              value={product?.id || ""}
              disabled
              fullWidth
            />
            <TextField
              size="small"
              label="Product Name"
              variant="filled"
              value={product?.name || ""}
              disabled
              fullWidth
            />
            <TextField
              size="small"
              label="Current Stock"
              variant="filled"
              value={product?.stockQuantity || 0}
              disabled
              fullWidth
            />
            <Select
              size="small"
              error={!!fieldErrors.transactionType}
              label="Transaction Type"
              name="transactionType"
              defaultValue={editingRequest?.transactionType || "stockIn"}
              fullWidth
            >
              <MenuItem value="stockIn">Stock In</MenuItem>
              <MenuItem value="stockOut">Stock Out</MenuItem>
            </Select>
            <NumberField
              min={1}
              size="small"
              name="itemAmount"
              label="Item Amount"
              defaultValue={editingRequest?.itemAmount || 1}
              fullWidth
              error={!!fieldErrors.itemAmount}
            />
            <FormHelperText error={!!fieldErrors.itemAmount} sx={{ mt: 0 }}>
              {fieldErrors.itemAmount}
            </FormHelperText>
            <Button
              size="small"
              type="submit"
              disabled={submitting}
              variant="outlined"
              color="primary"
              fullWidth
            >
              {submitting ? "Submitting..." : "Create Request"}
            </Button>
          </Stack>
        </form>
      </Card>
    </Modal>
  );
}
