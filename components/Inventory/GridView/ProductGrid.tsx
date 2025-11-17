"use client";

import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React from "react";

import ProductCard from "./ProductCard";

interface ProductGridProps {
  fetchProducts?: {
    success: boolean;
    count: number;
    data: Product[];
  };
}

export default function ProductGrid({ fetchProducts }: ProductGridProps) {
  const { count, data: initialProducts } = fetchProducts || {
    count: 0,
    data: [],
  };
  const [products, setProducts] = React.useState<Product[]>(initialProducts);

  React.useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  return count == 0 ? (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "400px",
        width: "100%",
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <ErrorOutlineRoundedIcon
          sx={{ fontSize: 100, color: "text.disabled", mt: 4 }}
        />
        <Typography variant="h5" align="center" sx={{ mt: 4 }}>
          No products found.
        </Typography>
      </Box>
    </Box>
  ) : (
    <React.Fragment>
      <Box
        sx={{
          width: "100%",
          mb: 2,
          justifyContent: "flex-end",
          display: { xs: "none", sm: "flex" },
        }}
      >
        <Typography variant="subtitle1" color="text.secondary">
          {products.length} product{products.length !== 1 ? "s" : ""} found
        </Typography>
      </Box>

      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12, lg: 16 }}
      >
        {products.map((product, i) => (
          <Grid key={product.id} size={4}>
            <ProductCard
              product={product}
              onDelete={() => setProducts((prev) => prev.toSpliced(i, 1))}
            />
          </Grid>
        ))}
      </Grid>
    </React.Fragment>
  );
}
