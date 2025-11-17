import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";

import { getProductById } from "@/libs/products";

import ClientBreadcrumb from "./ClientBreadcrumb";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ product: string[] }>;
}) {
  // const { setLabel } = useBreadcrumb();
  const { product } = await params;
  const productId = product[0];

  const { data: productData } = await getProductById(productId);

  console.log("Product data:", productData);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
      }}
    >
      <ClientBreadcrumb title={productData?.name || "Product"} />
      <Typography variant="h4" gutterBottom>
        {productData?.name}
      </Typography>
    </Box>
  );
}
