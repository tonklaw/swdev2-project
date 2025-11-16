"use client";
import { createTheme } from "@mui/material/styles";

import { chartsCustomizations } from "./customizations/charts";
import { dataDisplaysCustomizations } from "./customizations/dataDisplays";
import { dataGridCustomizations } from "./customizations/dataGrid";
import { datePickersCustomizations } from "./customizations/datePickers";
import { feedbacksCustomizations } from "./customizations/feedbacks";
import { inputsCustomizations } from "./customizations/inputs";
import { navigationsCustomizations } from "./customizations/navigations";
import { surfacesCustomizations } from "./customizations/surfaces";
import { colorSchemes, shadows, shape, typography } from "./themePrimitives";

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data",
  },
  colorSchemes,
  typography,
  shadows,
  shape,
  components: {
    ...inputsCustomizations,
    ...dataDisplaysCustomizations,
    ...feedbacksCustomizations,
    ...navigationsCustomizations,
    ...surfacesCustomizations,
    ...chartsCustomizations,
    ...dataGridCustomizations,
    ...datePickersCustomizations,
  },
});

export default theme;
