"use client";
import { createTheme, ThemeOptions, ThemeProvider } from "@mui/material/styles";
import React from "react";
import { colorSchemes, typography, shadows, shape } from "./themePrimitives"
import { inputsCustomizations } from "./customizations/inputs";
import { dataDisplaysCustomizations } from "./customizations/dataDisplays";
import { feedbacksCustomizations } from "./customizations/feedbacks";
import { navigationsCustomizations } from "./customizations/navigations";
import { surfacesCustomizations } from "./customizations/surfaces";
import { chartsCustomizations } from "./customizations/charts";
import { dataGridCustomizations } from "./customizations/dataGrid";
import { datePickersCustomizations } from "./customizations/datePickers";


interface AppThemeProps {
  children: React.ReactNode
  themeComponents?: ThemeOptions
}

export default function AppTheme(props: AppThemeProps) {
  const { children, themeComponents } = props;
  const theme = React.useMemo(() => {
    return createTheme({
      cssVariables: {
        colorSchemeSelector: "body",
        cssVarPrefix: "app-theme",        
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
        ...themeComponents,
      }
    })
  }, [themeComponents]);

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
}