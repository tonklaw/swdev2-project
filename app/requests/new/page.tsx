import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import NewRequestForm from "../../../components/Request/NewRequestForm";

export default function NewRequestPage() {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
      }}
    >
      <Typography variant="h4" gutterBottom>
        New Request
      </Typography>
      <NewRequestForm />
    </Box>
  );
}
