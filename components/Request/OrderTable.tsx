"use client";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import SearchIcon from "@mui/icons-material/Search";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
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

export default function OrderTable() {
  const {
    requests = [],
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    order,
    setOrder,
  } = useRequestContext();
  const [open, setOpen] = React.useState(false);

  const renderFilters = () => (
    <React.Fragment>
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <FormLabel sx={{ fontSize: "0.75rem", mb: 0.5 }}>Type</FormLabel>
        <Select
          size="small"
          value={typeFilter}
          onChange={(e) =>
            setTypeFilter(e.target.value as "" | "stockIn" | "stockOut")
          }
          displayEmpty
          defaultValue=""
          sx={{ fontSize: "0.875rem" }}
        >
          <MenuItem value="">Filter by type</MenuItem>
          <MenuItem value="stockIn">Stock In</MenuItem>
          <MenuItem value="stockOut">Stock Out</MenuItem>
        </Select>
      </FormControl>
    </React.Fragment>
  );

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
    <React.Fragment>
      {/* Mobile Search and Filter */}
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          my: 1,
          gap: 1,
        }}
      >
        <TextField
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
          sx={{ flexGrow: 1 }}
        />
        <IconButton
          size="small"
          onClick={() => setOpen(true)}
          sx={{ border: 1, borderColor: "divider" }}
        >
          <FilterAltIcon />
        </IconButton>
        <Modal open={open} onClose={() => setOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: "background.paper",
              p: 3,
              overflow: "auto",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h5">Filters</Typography>
              <IconButton onClick={() => setOpen(false)}>×</IconButton>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {renderFilters()}
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpen(false)}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>

      {/* Desktop Search and Filters */}
      <Box
        sx={{
          borderRadius: 1,
          py: 2,
          display: { xs: "none", md: "flex" },
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <FormControl sx={{ flex: 1, minWidth: 160 }} size="small">
          <FormLabel sx={{ fontSize: "0.75rem", mb: 0.5 }}>
            Search for Product
          </FormLabel>
          <TextField
            size="small"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
        </FormControl>
        {renderFilters()}
      </Box>

      {/* Table */}
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{
          display: { xs: "none", md: "block" },
          width: "100%",
          borderRadius: 1,
          flexShrink: 1,
          overflow: "auto",
          minHeight: 0,
        }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ flex: 1, minWidth: 100 }}>
                <Link
                  component="button"
                  underline="none"
                  color="primary"
                  onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    fontWeight: 600,
                  }}
                >
                  Date
                  <ArrowDropDownIcon
                    sx={{
                      transition: "0.2s",
                      transform:
                        order === "desc" ? "rotate(0deg)" : "rotate(180deg)",
                    }}
                  />
                </Link>
              </TableCell>
              <TableCell>Type</TableCell>
              <TableCell sx={{ flex: 3 }}>Product Name</TableCell>
              <TableCell sx={{ flex: 1 }}>Amount</TableCell>
              <TableCell sx={{ flex: 1 }}>Requester</TableCell>
              <TableCell sx={{ flex: 0.5 }}> </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    {searchQuery || typeFilter
                      ? "No requests match your filters"
                      : "No requests found"}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedRequests.map((request) => (
                <TableRow key={request.id} hover>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(request.transactionDate)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      icon={
                        request.transactionType === "stockIn" ? (
                          <CheckRoundedIcon />
                        ) : (
                          <AutorenewRoundedIcon />
                        )
                      }
                      label={
                        request.transactionType === "stockIn"
                          ? "Stock In"
                          : "Stock Out"
                      }
                      color={
                        request.transactionType === "stockIn"
                          ? "success"
                          : "warning"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {getProductName(request.product_id)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {request.itemAmount}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack
                      direction="row"
                      sx={{
                        gap: 1,
                      }}
                    >
                      <Avatar
                        alt={request.user?.name || "User Avatar"}
                        sx={{ width: 36, height: 36 }}
                      >
                        {request.user?.name?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ mr: "auto" }}>
                        <Typography
                          variant="body2"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {request.user?.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
                          {request.user?.email}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <RowMenu request={request} />
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          pt: 2,
          gap: 1,
          display: {
            xs: "none",
            md: "flex",
          },
        }}
      ></Box>
    </React.Fragment>
  );
}
