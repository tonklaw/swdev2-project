import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import ProductGrid from "@/components/Inventory/GridView/ProductGrid";
import { getProducts } from "@/libs/products";
import NewProductButton from "@/components/Inventory/Product/NewProductButton";

export default async function InventoryPage() {
  const fetchProducts = await getProducts();

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Product Inventory
        </Typography>

        <NewProductButton sx={{ ml: "auto", mb: 2 }} />
      </Box>
      <ProductGrid fetchProducts={fetchProducts} />
    </Box>
  );
}
