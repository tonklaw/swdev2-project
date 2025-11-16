"use client";
import { createTheme } from "@mui/material/styles";
import { colorSchemes, typography, shadows, shape } from "./themePrimitives";
import { inputsCustomizations } from "./customizations/inputs";
import { dataDisplaysCustomizations } from "./customizations/dataDisplays";
import { feedbacksCustomizations } from "./customizations/feedbacks";
import { navigationsCustomizations } from "./customizations/navigations";
import { surfacesCustomizations } from "./customizations/surfaces";
import { chartsCustomizations } from "./customizations/charts";
import { dataGridCustomizations } from "./customizations/dataGrid";
import { datePickersCustomizations } from "./customizations/datePickers";

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
