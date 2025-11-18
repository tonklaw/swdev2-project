import { NumberField as BaseNumberField } from "@base-ui-components/react/number-field";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import FilledInput from "@mui/material/FilledInput";
import FormControl from "@mui/material/FormControl";
// import FormHelperText from '@mui/material/FormHelperText';
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import * as React from "react";

/**
 * This component is a placeholder for FormControl to correctly set the shrink label state on SSR.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SSRInitialFilled(_: BaseNumberField.Root.Props) {
  return null;
}
SSRInitialFilled.muiName = "Input";

export default function NumberField({
  id: idProp,
  label,
  error,
  fullWidth,
  flex,
  size = "medium",
  ...other
}: BaseNumberField.Root.Props & {
  label?: React.ReactNode;
  size?: "small" | "medium";
  error?: boolean;
  fullWidth?: boolean;
  flex?: number | string;
}) {
  let id = React.useId();
  if (idProp) {
    id = idProp;
  }
  return (
    <BaseNumberField.Root
      allowWheelScrub
      {...other}
      render={(props, state) => (
        <FormControl
          size={size}
          ref={props.ref}
          disabled={state.disabled}
          required={state.required}
          error={error}
          variant="filled"
          fullWidth={fullWidth}
          sx={{ flex: flex }}
        >
          {props.children}
        </FormControl>
      )}
    >
      <SSRInitialFilled {...other} />
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <BaseNumberField.Input
        id={id}
        render={(props, state) => (
          <FilledInput
            // label={label}
            inputRef={props.ref}
            value={state.inputValue}
            onBlur={props.onBlur}
            onChange={props.onChange}
            onKeyUp={props.onKeyUp}
            onKeyDown={props.onKeyDown}
            onFocus={props.onFocus}
            slotProps={{
              input: props,
            }}
            endAdornment={
              <InputAdornment
                position="end"
                sx={{
                  flexDirection: "column",
                  maxHeight: "unset",
                  alignSelf: "stretch",
                  borderLeft: "1px solid",
                  borderColor: "divider",
                  ml: 0,
                  "& button": {
                    py: 0,
                    flex: 1,
                    borderColor: "transparent",
                    // borderRadius: 0.5,
                  },
                  "& border:hover": {
                    borderColor: "divider",
                  },
                }}
              >
                <BaseNumberField.Increment
                  render={<IconButton size={size} aria-label="Increase" />}
                >
                  <KeyboardArrowUpIcon
                    fontSize={size}
                    sx={{ transform: "translateY(1px)" }}
                  />
                </BaseNumberField.Increment>

                <BaseNumberField.Decrement
                  render={<IconButton size={size} aria-label="Decrease" />}
                >
                  <KeyboardArrowDownIcon
                    fontSize={size}
                    sx={{ transform: "translateY(-1px)" }}
                  />
                </BaseNumberField.Decrement>
              </InputAdornment>
            }
            sx={{ pr: 0 }}
          />
        )}
      />
      {/* <FormHelperText sx={{ ml: 0, '&:empty': { mt: 0 } }}>
        Enter value between 10 and 40
      </FormHelperText> */}
    </BaseNumberField.Root>
  );
}
