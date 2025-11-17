"use client";

import Box from "@mui/joy/Box";
import CssBaseline from "@mui/joy/CssBaseline";
import { CssVarsProvider } from "@mui/joy/styles";

import DeleteRequestModal from "@/components/Request/DeleteRequestModal";
import EditRequestModal from "@/components/Request/EditRequestModal";
import OrderList from "@/components/Request/OrderList";
import OrderTable from "@/components/Request/OrderTable";
import SyncColorScheme from "@/components/Theme/SyncColorScheme";
import { RequestContextProvider } from "@/contexts/RequestContext";

interface RequestsContainerProps {
  requests: Request[];
}

function RequestsContent() {
  return (
    <Box>
      <OrderTable />
      <OrderList />
      <EditRequestModal />
      <DeleteRequestModal />
    </Box>
  );
}

export default function RequestsContainer({
  requests,
}: RequestsContainerProps) {
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <SyncColorScheme />
      <RequestContextProvider initialRequests={requests}>
        <RequestsContent />
      </RequestContextProvider>
    </CssVarsProvider>
  );
}
