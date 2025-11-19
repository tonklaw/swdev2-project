"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { getProductById } from "@/libs/products";
import { createRequest } from "@/libs/requests";

import NumberField from "../NumberField";

const STOCK_OUT_LIMIT = 50;

export default function NewRequestForm() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const productId = searchParams.get("productId") || "";

  const [product, setProduct] = useState<Product | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    (async () => {
      const { data: product } = await getProductById(productId);
      setProduct(product);
    })();
  }, []);

  const handleSubmitNew = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setSubmitting(true);

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

    if (itemAmount > STOCK_OUT_LIMIT && transactionType === "stockOut") {
      setFieldErrors((prev) => ({
        ...prev,
        itemAmount: `Stock-out amount cannot exceed ${STOCK_OUT_LIMIT} items.`,
      }));
      setSubmitting(false);
      return;
    }

    await createRequest(
      session?.user!.token as string,
      {
        id: "",
        transactionDate: new Date().toISOString(),
        transactionType,
        itemAmount,
        product_id: productId,
      } as Request,
    );

    setSuccess(true);
    setTimeout(() => setSubmitting(false), 500);
    setTimeout(() => setSuccess(false), 3000);
  };

  if (!productId) {
    return (
      <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
        <Alert severity="warning">
          Product ID is required to create a request.
        </Alert>
      </Box>
    );
  }

  if (session?.user!.role !== "staff") {
    return (
      <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
        <Alert severity="warning">Only staff can create requests.</Alert>
      </Box>
    );
  }

  return (
    <Card sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
      <form onSubmit={handleSubmitNew}>
        <Stack spacing={2}>
          <TextField
            size="small"
            label="Product ID"
            variant="filled"
            value={productId}
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
            defaultValue="stockIn"
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
          {success && (
            <Alert severity="success">Request created successfully!</Alert>
          )}
        </Stack>
      </form>
    </Card>
  );
}
