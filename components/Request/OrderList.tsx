"use client";

import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import BlockIcon from "@mui/icons-material/Block";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { useRequestContext } from "@/contexts/RequestContext";

interface RowMenuProps {
  request: Request;
}

function RowMenu({ request }: RowMenuProps) {
  const {
    setEditingRequest,
    setEditModalOpen,
    setDeleteConfirmOpen,
    setDeleteRequestId,
  } = useRequestContext();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setEditingRequest(request);
    setEditModalOpen(true);
    handleClose();
  };

  const handleDelete = () => {
    setDeleteRequestId(request.id);
    setDeleteConfirmOpen(true);
    handleClose();
  };

  return (
    <>
      <IconButton size="small" onClick={handleClick}>
        <MoreHorizRoundedIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { minWidth: 140 },
        }}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          Delete
        </MenuItem>
      </Menu>
    </>
  );
}

function getStatusIcon(status: string) {
  switch (status) {
    case "stockIn":
      return <CheckRoundedIcon />;
    case "stockOut":
      return <AutorenewRoundedIcon />;
    default:
      return <BlockIcon />;
  }
}

function getStatusColor(
  status: string,
): "success" | "warning" | "error" | "default" {
  switch (status) {
    case "stockIn":
      return "success";
    case "stockOut":
      return "warning";
    default:
      return "error";
  }
}

function getStatusLabel(status: string): string {
  return status === "stockIn" ? "Stock In" : "Stock Out";
}

export default function OrderList() {
  const { typeFilter, searchQuery, order } = useRequestContext();
  const { requests = [] } = useRequestContext();

  function formatDate(dateStr?: string) {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleString("en-GB", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch {
      return String(dateStr);
    }
  }

  const getProductName = (product_id: Request["product_id"]): string => {
    if (typeof product_id === "object" && product_id !== null) {
      return product_id.name ?? product_id.id ?? String(product_id);
    }
    return String(product_id ?? "");
  };

  const filteredAndSortedRequests = React.useMemo(() => {
    let filtered = [...requests];

    if (typeFilter) {
      filtered = filtered.filter(
        (request) => request.transactionType === typeFilter,
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((request) => {
        const productName = getProductName(request.product_id).toLowerCase();
        const productId =
          typeof request.product_id === "object"
            ? String(request.product_id?.id ?? "").toLowerCase()
            : String(request.product_id).toLowerCase();
        return productName.includes(query) || productId.includes(query);
      });
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.transactionDate || 0).getTime();
      const dateB = new Date(b.transactionDate || 0).getTime();
      return order === "desc" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [requests, typeFilter, searchQuery, order]);

  return (
    <Card sx={{ display: { xs: "block", md: "none" } }}>
      {filteredAndSortedRequests.length === 0 ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", py: 3 }}
        >
          No requests found
        </Typography>
      ) : (
        <>
          <List sx={{ width: "100%", bgcolor: "background.paper", p: 0 }}>
            {filteredAndSortedRequests.map((request, idx) => (
              <React.Fragment key={request.id || idx}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    px: 0,
                    py: 2,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      alignItems: "start",
                      flex: 1,
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, mb: 0.5 }}
                      >
                        {typeof request.product_id === "object" &&
                        request.product_id !== null
                          ? (request.product_id.name ??
                            request.product_id.id ??
                            "Unknown Product")
                          : String(request.product_id ?? "Unknown Product")}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mb: 0.5 }}
                      >
                        ID: {request.id}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        Requested by {request.user?.name || "Unknown User"}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          mb: 1,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(request.transactionDate)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          &bull;
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Qty: {request.itemAmount}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      ></Box>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: 2,
                    }}
                  >
                    <Chip
                      size="small"
                      icon={getStatusIcon(request.transactionType)}
                      label={getStatusLabel(request.transactionType)}
                      color={getStatusColor(request.transactionType)}
                    />
                    <RowMenu request={request} />
                  </Box>
                </ListItem>
                {idx < requests.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              justifyContent: "space-between",
              py: 2,
            }}
          >
            <IconButton
              aria-label="previous page"
              size="small"
              sx={{ border: 1, borderColor: "divider" }}
            >
              <KeyboardArrowLeftIcon />
            </IconButton>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mx: "auto" }}
            >
              Page 1 of {Math.ceil(requests.length / 6) || 1}
            </Typography>
            <IconButton
              aria-label="next page"
              size="small"
              sx={{ border: 1, borderColor: "divider" }}
            >
              <KeyboardArrowRightIcon />
            </IconButton>
          </Box>
        </>
      )}
    </Card>
  );
}
