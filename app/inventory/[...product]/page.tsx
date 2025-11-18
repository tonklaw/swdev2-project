import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { redirect } from "next/navigation";
import React from "react";

import ProductView from "@/components/Inventory/Product/ProductView";
import { getProductById } from "@/libs/products";

import ClientBreadcrumb from "./ClientBreadcrumb";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ product: string[] }>;
}) {
  const { product } = await params;

  if (!product || product.length === 0) redirect("/inventory");
  if (product.length > 1 && product[1] !== "edit")
    redirect(`/inventory/${product[0]}`);

  const productId = product[0];
  const editMode = product.length > 1 && product[1] === "edit";

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
      <ProductView product={productData!} editMode={editMode} />
    </Box>
  );
}
