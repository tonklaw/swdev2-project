"use client";
import { Box, CssBaseline, Stack, Typography } from "@mui/joy";
import Alert from "@mui/joy/Alert";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import { CssVarsProvider } from "@mui/joy/styles";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { createRequest } from "@/libs/requests";

import SyncColorScheme from "../Theme/SyncColorScheme";

type InventoryRequest = {
  id: string;
  transactionDate: string;
  transactionType: "stockIn" | "stockOut";
  itemAmount: number;
  product_id: string | Product;
};

const STOCK_OUT_LIMIT = 50;

export default function NewRequestForm() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();

  const productId = searchParams.get("productId") || "";

  const [product, setProduct] = useState<Product | null>(null);
  const [transactionType, setTransactionType] = useState<
    "stockIn" | "stockOut"
  >("stockIn");
  const [itemAmount, setItemAmount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      if (!productId) return;
      try {
        const API_BASE =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
        const res = await fetch(`${API_BASE}/products/${productId}`);
        if (res.ok) {
          const data = await res.json();
          const p = (data && (data.data ?? data)) as Product | null;
          if (p) {
            if (
              p.stockQuantity !== undefined &&
              typeof p.stockQuantity === "string"
            ) {
              const n = Number(p.stockQuantity);
              p.stockQuantity = Number.isFinite(n) ? n : 0;
            }
            setProduct(p as Product);
          }
        }
      } catch {}
    }
    fetchProduct();
  }, [productId]);

  const validate = (amount = itemAmount, txnType = transactionType) => {
    if (!productId) return "Product ID is required.";
    if (!txnType) return "Transaction type is required.";
    if (!amount || amount <= 0) return "Item amount must be greater than 0.";
    if (txnType === "stockOut") {
      if (amount > STOCK_OUT_LIMIT)
        return `Stock-out amount cannot exceed ${STOCK_OUT_LIMIT} items.`;
      if (
        product &&
        product.stockQuantity !== undefined &&
        amount > product.stockQuantity
      ) {
        return `Stock-out amount cannot exceed available stock (${product.stockQuantity} items).`;
      }
    }
    return null;
  };

  useEffect(() => {
    const validationError = validate(itemAmount, transactionType);
    setError(validationError);
  }, [itemAmount, transactionType, product]);

  const user = session?.user as User | undefined;
  if (!user || user.role !== "staff") {
    return (
      <CssVarsProvider disableTransitionOnChange>
        <SyncColorScheme />
        <CssBaseline />
        <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
          <Typography level="h3" sx={{ mb: 2 }}>
            Create New Request
          </Typography>
          {!user ? (
            <Alert color="danger">
              You must be logged in to create a request.
            </Alert>
          ) : (
            <Alert color="warning">Only staff can create requests.</Alert>
          )}
        </Box>
      </CssVarsProvider>
    );
  }

  type AuthUser = {
    token?: string;
    accessToken?: string;
    access_token?: string;
    jwt?: string;
  } & User;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      const u = user as AuthUser;
      const token = u.token || u.accessToken || u.access_token || u.jwt;

      const requestData: InventoryRequest = {
        id: "",
        transactionDate: new Date().toISOString(),
        transactionType,
        itemAmount,
        product_id: productId,
      };
      if (!token) {
        throw new Error("No token found");
      }
      await createRequest(token, requestData);
      setSuccess(true);
      setItemAmount(0);
      setTransactionType("stockIn");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CssVarsProvider disableTransitionOnChange>
      <SyncColorScheme />
      <CssBaseline />
      <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
        <Typography level="h3" sx={{ mb: 2 }}>
          Create New Request
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <FormControl>
              <FormLabel>Product ID</FormLabel>
              <Input value={productId} disabled />
              {product && (
                <FormHelperText>
                  {product.name} (Stock: {product.stockQuantity})
                </FormHelperText>
              )}
            </FormControl>
            <FormControl>
              <FormLabel>Transaction Type</FormLabel>
              <Select
                value={transactionType}
                onChange={(_, value) =>
                  setTransactionType(value as "stockIn" | "stockOut")
                }
              >
                <Option value="stockIn">Stock In</Option>
                <Option value="stockOut">Stock Out</Option>
              </Select>
            </FormControl>
            <FormControl error={!!error}>
              <FormLabel>Item Amount</FormLabel>
              <Input
                type="number"
                value={itemAmount}
                onChange={(e) => setItemAmount(Number(e.target.value))}
                slotProps={{ input: { min: 1, step: 1 } }}
              />
              {transactionType === "stockOut" && product && (
                <FormHelperText>
                  Available stock: {product.stockQuantity}
                </FormHelperText>
              )}
            </FormControl>
            {error && <Alert color="danger">{error}</Alert>}
            <Button type="submit" disabled={loading} color="primary">
              {loading ? "Creating..." : "Create Request"}
            </Button>
            {success && (
              <Alert color="success">Request created successfully!</Alert>
            )}
          </Stack>
        </form>
      </Box>
    </CssVarsProvider>
  );
}
