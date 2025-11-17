import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import ProductGrid from "@/components/Inventory/GridView/ProductGrid";
import { getProducts } from "@/libs/products";

export default async function InventoryPage() {
  const fetchProducts = await getProducts();

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
      }}
    >
      <Typography variant="h4" gutterBottom>
        Product Inventory
      </Typography>
      <ProductGrid fetchProducts={fetchProducts} />
    </Box>
  );
}
