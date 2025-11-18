"use client";

import { FormLabel } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/navigation";
import React from "react";

import NumberField from "../../NumberField";
import EditButtons from "./EditButtons";

interface ProductEditorProps {
  product: Product;
}

export default function ProductEditor({ product }: ProductEditorProps) {
  const router = useRouter();

  const [editing, setEditing] = React.useState<boolean>(false);

  const [name, setName] = React.useState<string>(product.name);
  const [sku, setSku] = React.useState<string>(product.sku);
  const [description, setDescription] = React.useState<string>(
    product.description,
  );
  const [category, setCategory] = React.useState<string>(product.category);
  const [price, setPrice] = React.useState<number>(product.price);
  const [quantity, setQuantity] = React.useState<number>(product.stockQuantity);
  const [unit, setUnit] = React.useState<string>(product.unit);
  const [picture, setPicture] = React.useState<string>(product.picture);
  const [isActive, setIsActive] = React.useState<boolean>(
    product.isActive || false,
  );

  return (
    <Card
      sx={{
        width: "100%",
        flexDirection: "column",
        display: "flex",
        gap: 2,
        p: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
        }}
      >
        <TextField
          disabled={!editing}
          id="product-name"
          variant="filled"
          label="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
        <TextField
          disabled={!editing}
          id="product-sku"
          variant="filled"
          label="SKU"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          fullWidth
        />
      </Box>
      <TextField
        disabled={!editing}
        id="product-description"
        variant="filled"
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={4}
        fullWidth
      />

      <TextField
        disabled={!editing}
        id="product-category"
        variant="filled"
        label="Product Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        size="small"
        fullWidth
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
        }}
      >
        <NumberField
          disabled={!editing}
          id="product-price"
          label="Price"
          size="small"
          fullWidth
          allowWheelScrub
          min={0}
          value={price}
          onValueChange={(value) => {
            setPrice(value === null ? 0 : Math.round(value * 100) / 100);
          }}
          flex={1}
        />
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            gap: 2,
          }}
        >
          <NumberField
            disabled={!editing}
            id="product-stock-quantity"
            label="Stock Quantity"
            size="small"
            min={0}
            fullWidth
            allowWheelScrub
            smallStep={1}
            value={quantity}
            onValueChange={(value) => {
              setQuantity(value === null ? 0 : Math.round(value));
            }}
            flex={3}
          />
          <TextField
            disabled={!editing}
            id="product-unit"
            variant="filled"
            label="Unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            size="small"
            sx={{ flex: 2 }}
          />
        </Box>
      </Box>
      <TextField
        disabled={!editing}
        id="product-picture"
        variant="filled"
        label="Picture URL"
        value={picture}
        onChange={(e) => setPicture(e.target.value)}
        size="small"
        fullWidth
      />
      <FormGroup sx={{ pl: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              disabled={!editing}
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              sx={{
                color: "primary",
                "& .Mui-checked": {
                  color: "primary.main",
                },
              }}
            />
          }
          label="Show Product (Active)"
        />
        <FormLabel
          sx={{
            block: "none",
            fontSize: "0.75rem",
            color: editing ? "warning.main" : "text.secondary",
          }}
        >
          Product will be hidden from the inventory list when and may not be
          accessible to users.
        </FormLabel>
      </FormGroup>

      <Divider sx={{ my: 0, mx: -2 }} />

      <EditButtons
        newProduct={
          {
            _id: product.id,
            id: product.id,
            name: name,
            sku: sku,
            description: description,
            category: category,
            price: price,
            stockQuantity: quantity,
            unit: unit,
            picture: picture,
            isActive: isActive,
          } as Product
        }
        oldProduct={product}
        onCancel={() => {
          setName(product.name);
          setSku(product.sku);
          setDescription(product.description);
          setCategory(product.category);
          setPrice(product.price);
          setQuantity(product.stockQuantity);
          setUnit(product.unit);
          setPicture(product.picture);
          setIsActive(product.isActive || false);
          router.push(`/inventory/${product.id}`);
        }}
        onSave={() => {
          router.refresh();
        }}
        setEditing={setEditing}
      />
    </Card>
  );
}
