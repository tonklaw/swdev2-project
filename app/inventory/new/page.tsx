import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import ProductCreate from "@/components/Inventory/Product/ProductCreate";

export default function NewProductPage() {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
      }}
    >
      <Typography variant="h4" gutterBottom>
        Add New Product
      </Typography>
      <ProductCreate />
    </Box>
  );
}
