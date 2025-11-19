import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

export default function TestPage() {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
      }}
    >
      <Typography variant="h4" gutterBottom>
        Test Page
      </Typography>
      <Chip color="error" label="Stock In" />
      <Box sx={{ mr: "auto" }}>
        <Typography
          variant="body2"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            mb: 0,
          }}
        >
          PRODUCT NAME FormHelperText
        </Typography>

        <Typography variant="caption" sx={{ color: "text.secondary", mt: 0 }}>
          PRODUCT SKU here
        </Typography>
      </Box>
    </Box>
  );
}
