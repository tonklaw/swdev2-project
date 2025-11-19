/* eslint-disable */
"use client";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import SearchIcon from "@mui/icons-material/Search";
import Dropdown from "@mui/joy/Dropdown";
import MenuButton from "@mui/joy/MenuButton";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import Option from "@mui/joy/Option";
import Sheet from "@mui/joy/Sheet";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import IconButton, { iconButtonClasses } from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import Link from "@mui/material/Link";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import Typography from "@mui/material/Typography";
import { defaultizeValueFormatter } from "@mui/x-charts/internals";
import { DataGrid, GridRowsProp } from "@mui/x-data-grid";
import * as React from "react";

interface OrderTableProps {
  requests: Request[];
}

function renderTransactionType(type: "stockIn" | "stockOut") {
  const colors = { ["stockIn"]: "success", ["stockOut"]: "warning" };

  return <Chip variant="soft" color={colors[type]} label={type} />;
}

function renderAvatar(name: string, email: string) {
  return (
    <Stack
      direction="row"
      sx={{
        p: 2,
        gap: 1,
        alignItems: "center",
        borderTop: "1px solid var(--mui-palette-divider)",
      }}
    >
      <Avatar alt={name} sx={{ width: 36, height: 36 }}>
        {name.charAt(0).toUpperCase()}
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
          {name}
        </Typography>

        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {email}
        </Typography>
      </Box>
    </Stack>
  );
}

function renderProductInfo(product: Product) {
  return (
    <Box sx={{ mr: "auto" }}>
      <Typography
        variant="body2"
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          m: 0,
        }}
      >
        {product.name}
      </Typography>

      <Typography variant="caption" sx={{ color: "text.secondary", m: 0 }}>
        {product.sku}
      </Typography>
    </Box>
  );
}

const columns: GridColDef[] = [
  { field: "id", headerName: "Request ID", flex: 1, minWidth: 100 },
  {
    field: "transactionDate",
    headerName: "Date",
    flex: 1,
    minWidth: 120,
    valueFormatter: (params: { value: string }) =>
      params.value ? new Date(params.value).toLocaleDateString("en-GB") : "",
  },
  {
    field: "transactionType",
    headerName: "Type",
    flex: 0.5,
    renderCell: (params: { value: "stockIn" | "stockOut" }) =>
      renderTransactionType(params.value),
  },
  {
    field: "product",
    headerName: "Product",
    flex: 1,
    minWidth: 150,
    // valueGetter: (params: { value: Product }) => {
    //   return params.value;
    // },
    // renderCell: (params: { value: Product }) => renderProductInfo(params.value),
  },
  {
    field: "itemAmount",
    headerName: "Amount",
    flex: 0.5,
  },
  {
    field: "requester",
    headerName: "Requester",
    flex: 1,
    renderCell: (params: { value: User }) =>
      renderAvatar(params.value.name, params.value.email),
  },
  { field: "actions", headerName: "Actions", flex: 0.5 },
];

// function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
//   if (b[orderBy] < a[orderBy]) {
//     return -1;
//   }
//   if (b[orderBy] > a[orderBy]) {
//     return 1;
//   }
//   return 0;
// }

// type Order = "asc" | "desc";

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

// interface RowMenuProps {
//   request: Request;
// }

// function RowMenu({ request }: RowMenuProps) {
//   const {
//     setEditingRequest,
//     setEditModalOpen,
//     setDeleteConfirmOpen,
//     setDeleteRequestId,
//   } = useRequestContext();

//   const handleEdit = () => {
//     setEditingRequest(request);
//     setEditModalOpen(true);
//   };

//   const handleDelete = () => {
//     setDeleteRequestId(request.id);
//     setDeleteConfirmOpen(true);
//   };

//   return (
//     <Dropdown>
//       <MenuButton
//         slots={{ root: IconButton }}
//         slotProps={{ root: { variant: "plain", color: "neutral", size: "sm" } }}
//       >
//         <MoreHorizRoundedIcon />
//       </MenuButton>
//       <Menu size="sm" sx={{ minWidth: 140 }}>
//         <MenuItem onClick={handleEdit}>Edit</MenuItem>
//         <Divider />
//         <MenuItem color="danger" onClick={handleDelete}>
//           Delete
//         </MenuItem>
//       </Menu>
//     </Dropdown>
//   );
// }
export default function OrderTable({ requests }: OrderTableProps) {
  // const [order, setOrder] = React.useState<Order>("desc");
  // const [selected, setSelected] = React.useState<readonly string[]>([]);

  const [mount, setMount] = React.useState(false);
  const [rows, setRows] = React.useState<GridRowsProp>([]);

  React.useEffect(() => {
    setMount(true);
  }, []);

  // const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const rows: GridRowsProp = requests.map((request) => ({
      id: request.id,
      transactionDate: request.transactionDate,
      transactionType: request.transactionType,
      product: request.product_id as Product,
      itemAmount: request.itemAmount,
      requester: request.user,
      actions: request,
    }));

    setRows(rows);
  }, [requests]);

  // const renderFilters = () => (
  //   <React.Fragment>
  //     <FormControl size="sm">
  //       <FormLabel>Status</FormLabel>
  //       <Select
  //         size="sm"
  //         placeholder="Filter by status"
  //         slotProps={{ button: { sx: { whiteSpace: "nowrap" } } }}
  //       >
  //         <Option value="paid">Paid</Option>
  //         <Option value="pending">Pending</Option>
  //         <Option value="refunded">Refunded</Option>
  //         <Option value="cancelled">Cancelled</Option>
  //       </Select>
  //     </FormControl>
  //     <FormControl size="sm">
  //       <FormLabel>Category</FormLabel>
  //       <Select size="sm" placeholder="All">
  //         <Option value="all">All</Option>
  //         <Option value="refund">Refund</Option>
  //         <Option value="purchase">Purchase</Option>
  //         <Option value="debit">Debit</Option>
  //       </Select>
  //     </FormControl>
  //     <FormControl size="sm">
  //       <FormLabel>Customer</FormLabel>
  //       <Select size="sm" placeholder="All">
  //         <Option value="all">All</Option>
  //         <Option value="olivia">Olivia Rhye</Option>
  //         <Option value="steve">Steve Hampton</Option>
  //         <Option value="ciaran">Ciaran Murray</Option>
  //         <Option value="marina">Marina Macdonald</Option>
  //         <Option value="charles">Charles Fulton</Option>
  //         <Option value="jay">Jay Hoper</Option>
  //       </Select>
  //     </FormControl>
  //   </React.Fragment>
  // );
  // function formatDate(dateStr?: string) {
  //   if (!dateStr) return "";
  //   try {
  //     return new Date(dateStr).toLocaleDateString("en-GB");
  //   } catch {
  //     return String(dateStr);
  //   }
  // }

  if (!mount) {
    return null;
  }
  return (
    <React.Fragment>
      {/* <Sheet
        className="SearchAndFilters-mobile"
        sx={{ display: { xs: "flex", sm: "none" }, my: 1, gap: 1 }}
      >
        <Input
          size="sm"
          placeholder="Search"
          startDecorator={<SearchIcon />}
          sx={{ flexGrow: 1 }}
        />
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={() => setOpen(true)}
        >
          <FilterAltIcon />
        </IconButton>
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
            <ModalClose />
            <Typography id="filter-modal" level="h2">
              Filters
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Sheet sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {renderFilters()}
              <Button color="primary" onClick={() => setOpen(false)}>
                Submit
              </Button>
            </Sheet>
          </ModalDialog>
        </Modal>
      </Sheet>
      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: "sm",
          py: 2,
          display: { xs: "none", sm: "flex" },
          flexWrap: "wrap",
          gap: 1.5,
          "& > *": {
            minWidth: { xs: "120px", md: "160px" },
          },
        }}
      >
        <FormControl sx={{ flex: 1 }} size="sm">
          <FormLabel>Search for order</FormLabel>
          <Input
            size="sm"
            placeholder="Search"
            startDecorator={<SearchIcon />}
          />
        </FormControl>
        {renderFilters()}
      </Box> */}
      <DataGrid
        rows={rows}
        columns={columns}
        density="comfortable"
        getRowClassName={(params: { indexRelativeToCurrentPage: number }) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        disableRowSelectionOnClick
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            // minHeight: 32,
            // maxHeight: 32,
            // height: 32,
          },
          "& .MuiDataGrid-columnHeader": {
            padding: 0,
          },
          // "& .MuiDataGrid-columnHeaderTitle": {
          //   // fontSize: "0.75rem",
          // },
          "& .MuiDataGrid-footerContainer": {
            minHeight: 40,
            height: 40,
          },
          "& .MuiTablePagination-root": {
            fontSize: "0.75rem",
          },
          "& .MuiTablePagination-toolbar": {
            minHeight: 40,
            height: 40,
          },
        }}
        slotProps={{
          filterPanel: {
            filterFormProps: {
              logicOperatorInputProps: {
                variant: "outlined",
                size: "small",
              },
              columnInputProps: {
                variant: "outlined",
                size: "small",
                sx: { mt: "auto" },
              },
              operatorInputProps: {
                variant: "outlined",
                size: "small",
                sx: { mt: "auto" },
              },
              valueInputProps: {
                InputComponentProps: {
                  variant: "outlined",
                  size: "small",
                },
              },
            },
          },
        }}
      />

      {/* <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: "none", sm: "initial" },
          width: "100%",
          borderRadius: "sm",
          flexShrink: 1,
          overflow: "auto",
          minHeight: 0,
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow
          sx={{
            "--TableCell-headBackground":
              "var(--material-palette-background-level1)",
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground":
              "var(--material-palette-background-level1)",
            "--TableCell-paddingY": "4px",
            "--TableCell-paddingX": "8px",
          }}
        >
          <thead>
            <tr>
              <th
                style={{ width: 48, textAlign: "center", padding: "12px 6px" }}
              >
                <Checkbox
                  size="sm"
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
                  color={
                    selected.length > 0 || selected.length === requests.length
                      ? "primary"
                      : undefined
                  }
                  sx={{ verticalAlign: "text-bottom" }}
                />
              </th>
              <th style={{ width: 120, padding: "12px 6px" }}>
                <Link
                  underline="none"
                  color="primary"
                  component="button"
                  onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                  endDecorator={<ArrowDropDownIcon />}
                  sx={[
                    {
                      fontWeight: "lg",
                      "& svg": {
                        transition: "0.2s",
                        transform:
                          order === "desc" ? "rotate(0deg)" : "rotate(180deg)",
                      },
                    },
                    order === "desc"
                      ? { "& svg": { transform: "rotate(0deg)" } }
                      : { "& svg": { transform: "rotate(180deg)" } },
                  ]}
                >
                  Request ID
                </Link>
              </th>
              <th
                style={{ width: 140, padding: "12px 20px", textAlign: "left" }}
              >
                Date
              </th>
              <th style={{ width: 140, padding: "12px 6px" }}>Type</th>
              <th style={{ width: 240, padding: "12px 6px" }}>Product ID</th>
              <th style={{ width: 140, padding: "12px 6px" }}>Amount</th>
              <th style={{ width: 140, padding: "12px 6px" }}> </th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  <Typography level="body-sm" color="neutral">
                    No requests found
                  </Typography>
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr key={request.id}>
                  <td style={{ textAlign: "center", width: 48 }}>
                    <Checkbox
                      size="sm"
                      checked={selected.includes(request.id)}
                      color={
                        selected.includes(request.id) ? "primary" : undefined
                      }
                      onChange={(event) => {
                        setSelected((ids) =>
                          event.target.checked
                            ? ids.concat(request.id)
                            : ids.filter((itemId) => itemId !== request.id),
                        );
                      }}
                      slotProps={{ checkbox: { sx: { textAlign: "left" } } }}
                      sx={{ verticalAlign: "text-bottom" }}
                    />
                  </td>
                  <td style={{ width: 120, paddingLeft: 6 }}>
                    <Typography level="body-xs">{request.id}</Typography>
                  </td>
                  <td
                    style={{ width: 140, paddingLeft: 20, textAlign: "left" }}
                  >
                    <Typography level="body-xs">
                      {formatDate(request.transactionDate)}
                    </Typography>
                  </td>
                  <td>
                    <Chip
                      variant="soft"
                      size="sm"
                      startDecorator={
                        request.transactionType === "stockIn" ? (
                          <CheckRoundedIcon />
                        ) : (
                          <AutorenewRoundedIcon />
                        )
                      }
                      color={
                        request.transactionType === "stockIn"
                          ? "success"
                          : "warning"
                      }
                    >
                      {request.transactionType === "stockIn"
                        ? "Stock In"
                        : "Stock Out"}
                    </Chip>
                  </td>
                  <td>
                    <Typography level="body-xs">
                      {typeof request.product_id === "object" &&
                      request.product_id !== null
                        ? (request.product_id.name ??
                          request.product_id.id ??
                          String(request.product_id))
                        : String(request.product_id ?? "")}
                    </Typography>
                  </td>
                  <td>
                    <Typography level="body-xs">
                      {request.itemAmount}
                    </Typography>
                  </td>
                  <td>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <Link level="body-xs" component="button">
                        Download
                      </Link>
                      <RowMenu request={request} />
                    </Box>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Sheet>
      <Box
        className="Pagination-laptopUp"
        sx={{
          pt: 2,
          gap: 1,
          [`& .${iconButtonClasses.root}`]: { borderRadius: "50%" },
          display: {
            xs: "none",
            md: "flex",
          },
        }}
      >
        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          startDecorator={<KeyboardArrowLeftIcon />}
        >
          Previous
        </Button>

        <Box sx={{ flex: 1 }} />
        {["1", "2", "3", "…", "8", "9", "10"].map((page) => (
          <IconButton
            key={page}
            size="sm"
            variant={Number(page) ? "outlined" : "plain"}
            color="neutral"
          >
            {page}
          </IconButton>
        ))}
        <Box sx={{ flex: 1 }} />
        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          endDecorator={<KeyboardArrowRightIcon />}
        >
          Next
        </Button>
      </Box> */}
    </React.Fragment>
  );
}
