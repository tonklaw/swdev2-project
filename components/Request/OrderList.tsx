"use client";

import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import BlockIcon from "@mui/icons-material/Block";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Chip from "@mui/joy/Chip";
import Divider from "@mui/joy/Divider";
import Dropdown from "@mui/joy/Dropdown";
import IconButton from "@mui/joy/IconButton";
import Link from "@mui/joy/Link";
import List from "@mui/joy/List";
import ListDivider from "@mui/joy/ListDivider";
import ListItem from "@mui/joy/ListItem";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import { ColorPaletteProp } from "@mui/joy/styles";
import Typography from "@mui/joy/Typography";

import { useRequestContext } from "@/contexts/RequestContext";

interface OrderListProps {
  requests?: Request[];
}

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

  const handleEdit = () => {
    setEditingRequest(request);
    setEditModalOpen(true);
  };

  const handleDelete = () => {
    setDeleteRequestId(request.id);
    setDeleteConfirmOpen(true);
  };

  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: "plain", color: "neutral", size: "sm" } }}
      >
        <MoreHorizRoundedIcon />
      </MenuButton>
      <Menu size="sm" sx={{ minWidth: 140 }}>
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <Divider />
        <MenuItem color="danger" onClick={handleDelete}>
          Delete
        </MenuItem>
      </Menu>
    </Dropdown>
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

function getStatusColor(status: string): ColorPaletteProp {
  switch (status) {
    case "stockIn":
      return "success";
    case "stockOut":
      return "warning";
    default:
      return "danger";
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

export default function OrderList(props: OrderListProps) {
  const { requests = [] } = useRequestContext();
  return (
    <Box sx={{ display: { xs: "block", sm: "none" } }}>
      {requests.length === 0 ? (
        <Typography
          level="body-sm"
          sx={{ textAlign: "center", py: 3, color: "text.tertiary" }}
        >
          No requests found
        </Typography>
      ) : (
        <>
          {requests.map((request, idx) => (
            <List
              key={request.id || idx}
              size="sm"
              sx={{ "--ListItem-paddingX": 0 }}
            >
              <ListItem
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                }}
              >
                <ListItemContent
                  sx={{ display: "flex", gap: 2, alignItems: "start" }}
                >
                  <ListItemDecorator>
                    <Avatar size="sm">
                      {getInitials(
                        typeof request.product_id === "object" &&
                          request.product_id !== null
                          ? (request.product_id.name ??
                              request.product_id.id ??
                              "N/A")
                          : String(request.product_id ?? "N/A"),
                      )}
                    </Avatar>
                  </ListItemDecorator>
                  <div>
                    <Typography gutterBottom sx={{ fontWeight: 600 }}>
                      {typeof request.product_id === "object" &&
                      request.product_id !== null
                        ? (request.product_id.name ??
                          request.product_id.id ??
                          "Unknown Product")
                        : String(request.product_id ?? "Unknown Product")}
                    </Typography>
                    <Typography level="body-xs" gutterBottom>
                      ID: {request.id}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 0.5,
                        mb: 1,
                      }}
                    >
                      <Typography level="body-xs">
                        {formatDate(request.transactionDate)}
                      </Typography>
                      <Typography level="body-xs">&bull;</Typography>
                      <Typography level="body-xs">
                        Qty: {request.itemAmount}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Link level="body-sm" component="button">
                        Download
                      </Link>
                      <RowMenu request={request} />
                    </Box>
                  </div>
                </ListItemContent>
                <Chip
                  variant="soft"
                  size="sm"
                  startDecorator={getStatusIcon(request.transactionType)}
                  color={getStatusColor(request.transactionType)}
                >
                  {getStatusLabel(request.transactionType)}
                </Chip>
              </ListItem>
              <ListDivider />
            </List>
          ))}
          <Box
            className="Pagination-mobile"
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              py: 2,
            }}
          >
            <IconButton
              aria-label="previous page"
              variant="outlined"
              color="neutral"
              size="sm"
            >
              <KeyboardArrowLeftIcon />
            </IconButton>
            <Typography level="body-sm" sx={{ mx: "auto" }}>
              Page 1 of {Math.ceil(requests.length / 6) || 1}
            </Typography>
            <IconButton
              aria-label="next page"
              variant="outlined"
              color="neutral"
              size="sm"
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
  } catch (_e) {
    return String(dateStr);
  }
}
