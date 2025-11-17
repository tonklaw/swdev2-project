import { CardMedia } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import CopyButton from "../CopyButton";
import ModifyButton from "./ModifyButton";
import RequestButton from "./RequestButton";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  let stockStatusColor = "text.primary";
  if (product.stockQuantity === 0) {
    stockStatusColor = "error.main";
  } else if (product.stockQuantity < 20) {
    stockStatusColor = "warning.main";
  }

  return (
    <Card sx={{ p: 0, height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          gap: 1,
          p: 1.5,
          minHeight: 60,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            flex: 1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {product.name}
        </Typography>
        <ModifyButton product={product} size="small" sx={{ ml: "auto" }} />
      </Box>
      <CardMedia
        component="img"
        image={product.picture}
        alt={product.name}
        sx={{
          width: "100%",
          aspectRatio: "3 / 2",
          objectFit: "cover",
          maxHeight: "100%",
          my: 0.5,
        }}
      />
      <Box
        minHeight={120}
        sx={{
          px: 0.8,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mt: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
            }}
          >
            SKU : {product.sku}
          </Typography>
          <CopyButton
            text={product.sku}
            size="small"
            sx={{ ml: "auto", float: "right" }}
          />
        </Box>
        <Divider sx={{ my: 0.5 }} />
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            color: "text.secondary",
          }}
        >
          Description
        </Typography>
        <Typography
          variant="body2"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 5,
            WebkitBoxOrient: "vertical",
          }}
        >
          {product.description}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Chip label={product.category} size="small" sx={{ m: 1 }} />
      </Box>
      <Divider />
      <Stack
        sx={{ mt: "auto", width: "100%" }}
        spacing={0}
        direction="row"
        alignItems="center"
        justifyContent="space-evenly"
        divider={<Divider orientation="vertical" flexItem />}
      >
        <Stack
          flex={1}
          sx={{
            minWidth: 0,
            direction: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
            }}
          >
            Price
          </Typography>
          <Typography
            variant="h5"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
            }}
          >
            {product.price}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
            }}
          >
            Baht
          </Typography>
        </Stack>
        <Stack
          flex={1}
          sx={{
            minWidth: 0,
            direction: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
            }}
          >
            In Stock
          </Typography>
          <Typography
            variant="h5"
            color={stockStatusColor}
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
            }}
          >
            {product.stockQuantity}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
            }}
          >
            {product.unit}
          </Typography>
        </Stack>
        <RequestButton productId={product.id} sx={{ m: 1 }} />
      </Stack>
    </Card>
  );
}
