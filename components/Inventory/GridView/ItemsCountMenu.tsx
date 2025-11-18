"use client";

import ArrowDropDownRounded from "@mui/icons-material/ArrowDropDownRounded";
import Button, { ButtonProps } from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React from "react";

interface ItemsCountMenuProps extends ButtonProps {
  count: number;
  onSelection: (count: number) => void;
}

export default function ItemsCountMenu({
  count,
  onSelection,
  ...props
}: ItemsCountMenuProps) {
  const itemsOptions = [12, 24, 48, 96];

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Button
        variant="outlined"
        onClick={handleClick}
        aria-controls={open ? "items-count-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        endIcon={<ArrowDropDownRounded />}
        size="small"
        {...props}
      >
        {count}
      </Button>
      <Menu
        id="items-count-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "bottom" }}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
      >
        {itemsOptions.map((itemCount) => (
          <MenuItem
            key={itemCount}
            selected={itemCount === count}
            onClick={() => {
              onSelection(itemCount);
              handleClose();
            }}
          >
            {itemCount}
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  );
}
