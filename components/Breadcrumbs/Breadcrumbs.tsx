"use client";

import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import MUIBreadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { usePathname } from "next/navigation";
import React from "react";

import { useBreadcrumb } from "./BreadcrumbContext";

export default function Breadcrumbs() {
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();
  const { labels } = useBreadcrumb();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const pathSegments = pathname.split("/").filter(Boolean);

  return (
    <MUIBreadcrumbs
      aria-label="breadcrumb"
      // spacing={2}
      separator={<NavigateNextRoundedIcon fontSize="small" />}
      sx={{
        // display: { xs: 'none', md: 'flex' },
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
        pt: 1.5,
        ["& .MuiBreadcrumbs-separator"]: { color: "action.disabled" },
        ["& .MuiBreadcrumbs-ol"]: { alignItems: "center" },
      }}
    >
      <Link href="/">Home</Link>
      {mounted &&
        pathSegments.map((segment, index) => {
          const isLast = index === pathSegments.length - 1;
          const href = `/${pathSegments.slice(0, index + 1).join("/")}`;

          const text = labels[index]
            ? labels[index]
            : segment
                .replace(/-/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase());

          return isLast ? (
            <Typography key={href} color="text.primary">
              {text}
            </Typography>
          ) : (
            <Link key={href} href={href}>
              {text}
            </Link>
          );
        })}
    </MUIBreadcrumbs>
  );
}
