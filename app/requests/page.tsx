import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import RequestsContainer from "@/components/Request/RequestsContainer";
import { getRequests } from "@/libs/requests";

export default async function RequestsPage() {
  const session = await getServerSession(authOptions);

  let requests = [];
  let error: string | null = null;

  try {
    const userObj = (session?.user ?? {}) as Record<string, unknown>;
    const tokenCandidates = [
      userObj["token"],
      userObj["accessToken"],
      userObj["access_token"],
      userObj["jwt"],
    ];
    const token = tokenCandidates.find(
      (t) => typeof t === "string" && (t as string).length > 0,
    ) as string | undefined;

    const response = await getRequests(token);
    requests = Array.isArray(response) ? response : response.data || [];
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to fetch requests";
  }

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
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <RequestsContainer requests={requests} />
    </Box>
  );
}
