"use client";

import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import BlockIcon from "@mui/icons-material/Block";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
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

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function OrderList() {
  const { requests = [] } = useRequestContext();

  return (
    <Box sx={{ display: { xs: "block", sm: "none" } }}>
      {requests.length === 0 ? (
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
            {requests.map((request, idx) => (
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
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          fontSize: "0.875rem",
                        }}
                      >
                        {getInitials(
                          typeof request.product_id === "object" &&
                            request.product_id !== null
                            ? (request.product_id.name ??
                                request.product_id.id ??
                                "N/A")
                            : String(request.product_id ?? "N/A"),
                        )}
                      </Avatar>
                    </ListItemAvatar>
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
                      >
                        <Link
                          component="button"
                          variant="body2"
                          underline="hover"
                        >
                          Download
                        </Link>
                        <RowMenu request={request} />
                      </Box>
                    </Box>
                  </Box>
                  <Chip
                    size="small"
                    icon={getStatusIcon(request.transactionType)}
                    label={getStatusLabel(request.transactionType)}
                    color={getStatusColor(request.transactionType)}
                  />
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
    </Box>
  );
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-GB");
  } catch (e) {
    console.error("Date formatting error:", e);
    return String(dateStr);
  }
}
