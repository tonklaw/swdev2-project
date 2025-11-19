"use client";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
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

// function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
//   if (b[orderBy] < a[orderBy]) {
//     return -1;
//   }
//   if (b[orderBy] > a[orderBy]) {
//     return 1;
//   }
//   return 0;
// }

type Order = "asc" | "desc";

// function getComparator<Key extends PropertyKey>(
//   order: Order,
//   orderBy: Key,
// ): (
//   a: Record<Key, number | string>,
//   b: Record<Key, number | string>,
// ) => number {
//   return order === "desc"
//     ? (a, b) => descendingComparator(a, b, orderBy as keyof typeof a)
//     : (a, b) => -descendingComparator(a, b, orderBy as keyof typeof a);
// }

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
  const { requests = [] } = useRequestContext();
  const [order, setOrder] = React.useState<Order>("desc");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [open, setOpen] = React.useState(false);

  const renderFilters = () => (
    <React.Fragment>
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <FormLabel sx={{ fontSize: "0.75rem", mb: 0.5 }}>Status</FormLabel>
        <Select
          size="small"
          displayEmpty
          defaultValue=""
          sx={{ fontSize: "0.875rem" }}
        >
          <MenuItem value="">Filter by status</MenuItem>
          <MenuItem value="paid">Paid</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="refunded">Refunded</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <FormLabel sx={{ fontSize: "0.75rem", mb: 0.5 }}>Category</FormLabel>
        <Select
          size="small"
          displayEmpty
          defaultValue="all"
          sx={{ fontSize: "0.875rem" }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="refund">Refund</MenuItem>
          <MenuItem value="purchase">Purchase</MenuItem>
          <MenuItem value="debit">Debit</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <FormLabel sx={{ fontSize: "0.75rem", mb: 0.5 }}>Customer</FormLabel>
        <Select
          size="small"
          displayEmpty
          defaultValue="all"
          sx={{ fontSize: "0.875rem" }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="olivia">Olivia Rhye</MenuItem>
          <MenuItem value="steve">Steve Hampton</MenuItem>
          <MenuItem value="ciaran">Ciaran Murray</MenuItem>
          <MenuItem value="marina">Marina Macdonald</MenuItem>
          <MenuItem value="charles">Charles Fulton</MenuItem>
          <MenuItem value="jay">Jay Hoper</MenuItem>
        </Select>
      </FormControl>
    </React.Fragment>
  );

  function formatDate(dateStr?: string) {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("en-GB");
    } catch {
      return String(dateStr);
    }
  }

  return (
    <React.Fragment>
      {/* Mobile Search and Filter */}
      <Box
        sx={{
          display: { xs: "flex", sm: "none" },
          my: 1,
          gap: 1,
        }}
      >
        <TextField
          size="small"
          placeholder="Search"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
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
          display: { xs: "none", sm: "flex" },
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <FormControl sx={{ flex: 1, minWidth: 160 }} size="small">
          <FormLabel sx={{ fontSize: "0.75rem", mb: 0.5 }}>
            Search for order
          </FormLabel>
          <TextField
            size="small"
            placeholder="Search"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
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
          display: { xs: "none", sm: "block" },
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
              <TableCell padding="checkbox" sx={{ width: 48 }}>
                <Checkbox
                  size="small"
                  indeterminate={
                    selected.length > 0 && selected.length !== requests.length
                  }
                  checked={
                    selected.length === requests.length && requests.length > 0
                  }
                  onChange={(event) => {
                    setSelected(
                      event.target.checked ? requests.map((req) => req.id) : [],
                    );
                  }}
                />
              </TableCell>
              <TableCell sx={{ width: 120 }}>
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
                  Request ID
                  <ArrowDropDownIcon
                    sx={{
                      transition: "0.2s",
                      transform:
                        order === "desc" ? "rotate(0deg)" : "rotate(180deg)",
                    }}
                  />
                </Link>
              </TableCell>
              <TableCell sx={{ width: 140 }}>Date</TableCell>
              <TableCell sx={{ width: 140 }}>Type</TableCell>
              <TableCell sx={{ width: 240 }}>Product ID</TableCell>
              <TableCell sx={{ width: 140 }}>Amount</TableCell>
              <TableCell sx={{ width: 140 }}> </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    No requests found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
                <TableRow key={request.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      size="small"
                      checked={selected.includes(request.id)}
                      onChange={(event) => {
                        setSelected((ids) =>
                          event.target.checked
                            ? ids.concat(request.id)
                            : ids.filter((itemId) => itemId !== request.id),
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{request.id}</Typography>
                  </TableCell>
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
                      {typeof request.product_id === "object" &&
                      request.product_id !== null
                        ? (request.product_id.name ??
                          request.product_id.id ??
                          String(request.product_id))
                        : String(request.product_id ?? "")}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {request.itemAmount}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <Link component="button" variant="body2">
                        Download
                      </Link>
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
