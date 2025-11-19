"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { createRequest } from "@/libs/requests";

const STOCK_OUT_LIMIT = 50;

// Create a theme (replace SyncColorScheme with your theme configuration)
const theme = createTheme({
  palette: {
    mode: "light", // or 'dark', or use system preference
  },
});

export default function NewRequestForm() {
  const { data: session } = useSession();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemAmount, transactionType, product]);

  const user = session?.user as User | undefined;
  if (!user || user.role !== "staff") {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Create New Request
          </Typography>
          {!user ? (
            <Alert severity="error">
              You must be logged in to create a request.
            </Alert>
          ) : (
            <Alert severity="warning">Only staff can create requests.</Alert>
          )}
        </Box>
      </ThemeProvider>
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

      const requestData = {
        id: "",
        transactionDate: new Date().toISOString(),
        transactionType,
        itemAmount,
        product_id: productId,
      } as Request;
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Create New Request
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <FormControl fullWidth>
              <FormLabel>Product ID</FormLabel>
              <TextField value={productId} disabled fullWidth />
              {product && (
                <FormHelperText>
                  {product.name} (Stock: {product.stockQuantity})
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth>
              <FormLabel>Transaction Type</FormLabel>
              <Select
                value={transactionType}
                onChange={(e) =>
                  setTransactionType(e.target.value as "stockIn" | "stockOut")
                }
                fullWidth
              >
                <MenuItem value="stockIn">Stock In</MenuItem>
                <MenuItem value="stockOut">Stock Out</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth error={!!error}>
              <FormLabel>Item Amount</FormLabel>
              <TextField
                type="number"
                value={itemAmount}
                onChange={(e) => setItemAmount(Number(e.target.value))}
                inputProps={{ min: 1, step: 1 }}
                fullWidth
                error={!!error}
              />
              {transactionType === "stockOut" && product && (
                <FormHelperText>
                  Available stock: {product.stockQuantity}
                </FormHelperText>
              )}
            </FormControl>
            {error && <Alert severity="error">{error}</Alert>}
            <Button
              type="submit"
              disabled={loading}
              variant="contained"
              color="primary"
              fullWidth
            >
              {loading ? "Creating..." : "Create Request"}
            </Button>
            {success && (
              <Alert severity="success">Request created successfully!</Alert>
            )}
          </Stack>
        </form>
      </Box>
    </ThemeProvider>
  );
}
