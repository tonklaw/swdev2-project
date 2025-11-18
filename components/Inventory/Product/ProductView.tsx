import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import ProductCard from "./ProductCard";
import ProductEditor from "./ProductEditor";

interface ProductViewProps {
  product: Product;
  editMode: boolean;
}

export default function ProductView({ product, editMode }: ProductViewProps) {
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
          Product Card
        </Typography>
        <ProductCard product={product} disableMenu />
      </Box>

      <Box sx={{ flex: 4, mt: { xs: 2, md: 0 } }}>
        <Typography variant="h5" gutterBottom>
          {editMode ? "Edit Product" : "Product Details"}
        </Typography>

        <ProductEditor product={product} />
      </Box>
    </Box>
  );
}
