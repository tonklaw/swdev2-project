import "./globals.css";

import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import Stack from "@mui/material/Stack";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BreadcrumbProvider } from "@/components/Breadcrumbs/BreadcrumbContext";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import AppNavBar from "@/components/Sidebar/AppNavBar";
import SideMenu from "@/components/Sidebar/SideMenu";
import NextAuthProvider from "@/providers/NextAuthProvider";
import theme from "@/theme/theme";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Trackr",
  description: "Inventory management made easy",
  other: {
    "format-detection": "telephone=no",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme} disableTransitionOnChange>
            <CssBaseline enableColorScheme />
            <InitColorSchemeScript attribute="class" />
            <NextAuthProvider session={session}>
              <SideMenu />
              <AppNavBar />
              <BreadcrumbProvider>
                <Box
                  component="main"
                  sx={{
                    ml: { md: "240px" },
                    flexGrow: 1,
                    backgroundColor: `var(--mui-palette-background-default)`,
                    overflow: "auto",
                  }}
                >
                  <Stack
                    spacing={2}
                    sx={{
                      alignItems: "center",
                      mx: 3,
                      pb: 5,
                      mt: { xs: 8, md: 0 },
                    }}
                  >
                    <Breadcrumbs />
                    {children}
                  </Stack>
                </Box>
              </BreadcrumbProvider>
            </NextAuthProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
