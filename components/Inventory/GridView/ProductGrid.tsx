"use client";

import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";
import React from "react";

import ProductCard from "../ProductCard";
import ItemsCountMenu from "./ItemsCountMenu";

interface ProductGridProps {
  fetchProducts?: {
    success: boolean;
    count: number;
    data: Product[];
  };
}

export default function ProductGrid({ fetchProducts }: ProductGridProps) {
  const [page, setPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(12);

  const { count, data: initialProducts } = fetchProducts || {
    count: 0,
    data: [],
  };
  const [products, setProducts] = React.useState<Product[]>(initialProducts);

  React.useEffect(() => {
    setProducts(initialProducts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setPage(page);
  };

  const maxPage = Math.ceil(products.length / itemsPerPage);
  React.useEffect(() => {
    if (page > maxPage) {
      setPage(maxPage > 0 ? maxPage : 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsPerPage, count]);

  return count == 0 ? (
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
          No products found.
        </Typography>
      </Box>
    </Box>
  ) : (
    <React.Fragment>
      <Box
        sx={{
          width: "100%",
          mb: 2,
          justifyContent: "flex-end",
          display: { xs: "none", sm: "flex" },
        }}
      >
        <Typography
          variant="subtitle2"
          color="text.secondary"
          alignContent={"center"}
        >
          {products.length} product{products.length !== 1 ? "s" : ""} found
        </Typography>

        <Pagination
          count={maxPage}
          page={page}
          onChange={handleChangePage}
          size="small"
          sx={{ ml: 1 }}
        />
      </Box>

      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12, lg: 16 }}
      >
        {products
          .slice((page - 1) * itemsPerPage, page * itemsPerPage)
          .map((product, i) => (
            <Grid key={product.id} size={4}>
              <ProductCard
                product={product}
                onDelete={() => setProducts((prev) => prev.toSpliced(i, 1))}
              />
            </Grid>
          ))}
      </Grid>

      <Box
        sx={{
          width: "100%",
          mt: 2,
          justifyContent: { xs: "center", sm: "flex-end" },
          gap: 1,
          alignItems: "center",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Typography
          variant="subtitle2"
          color="text.secondary"
          alignItems={"center"}
          sx={{ mr: 1 }}
        >
          Items per page:
        </Typography>

        <ItemsCountMenu
          count={itemsPerPage}
          onSelection={(count) => setItemsPerPage(count)}
        />

        <Pagination
          count={maxPage}
          page={page}
          onChange={handleChangePage}
          size="small"
          sx={{ ml: 1 }}
        />
      </Box>
    </React.Fragment>
  );
}
