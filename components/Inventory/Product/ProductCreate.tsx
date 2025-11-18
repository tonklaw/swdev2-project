"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";

import ProductCard from "./ProductCard";
import ProductEditor from "./ProductEditor";

export default function ProductCreate() {
  const [product, setProduct] = React.useState<Product>({
    id: "",
    name: "",
    sku: "",
    description: "",
    category: "",
    price: 0,
    stockQuantity: 0,
    unit: "",
    picture: "",
  });

  return (
    <Box
      sx={{
        width: "100%",
        mt: 2,
        justifyItems: "space-between",
        flexDirection: { xs: "column-reverse", md: "row-reverse" },
        display: "flex",
        gap: 4,
      }}
    >
      <Box
        sx={{
          flex: 2,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Preview
        </Typography>
        <ProductCard product={product} disableMenu />
      </Box>

      <Box sx={{ flex: 4, mt: { xs: 2, md: 0 } }}>
        <Typography variant="h5" gutterBottom>
          Product Details
        </Typography>

        <ProductEditor product={product} setProduct={setProduct} createMode />
      </Box>
    </Box>
  );
}
