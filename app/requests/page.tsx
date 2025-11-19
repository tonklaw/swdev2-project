import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import RequestsContainer from "@/components/Request/RequestsContainer";

export default async function RequestsPage() {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
      }}
    >
      <Typography variant="h4" gutterBottom>
        Requests
      </Typography>
      <RequestsContainer />
    </Box>
  );
}
