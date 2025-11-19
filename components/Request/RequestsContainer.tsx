"use client";

import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useSession } from "next-auth/react";
import React from "react";

import DeleteRequestModal from "@/components/Request/DeleteRequestModal";
import EditRequestModal from "@/components/Request/EditRequestModal";
import OrderList from "@/components/Request/OrderList";
import OrderTable from "@/components/Request/OrderTable";
import { RequestContextProvider } from "@/contexts/RequestContext";
import { getRequests } from "@/libs/requests";

export default function RequestsContainer() {
  const { data: session } = useSession();
  const [requests, setRequests] = React.useState<Request[]>([]);

  React.useEffect(() => {
    (async () => {
      try {
        const fetchRequests = await getRequests(session?.user!.token as string);
        setRequests(fetchRequests.data);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      }
    })();
  }, [session]);

  if (!session) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
          width: "100%",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <ErrorOutlineRoundedIcon
            sx={{ fontSize: 100, color: "text.disabled", mt: 4 }}
          />
          <Typography variant="h5" align="center" sx={{ mt: 4 }}>
            Login to view requests.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <RequestContextProvider initialRequests={requests}>
      <OrderTable />
      <OrderList />
      <EditRequestModal />
      <DeleteRequestModal />
    </RequestContextProvider>
  );
}
