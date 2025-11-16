"use client";

import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import { Breadcrumbs as MUIBreadcrumbs } from "@mui/material";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { usePathname } from "next/navigation";

import { useBreadcrumb } from "./BreadcrumbContext";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const { label } = useBreadcrumb();

  const pathSegments = pathname.split("/").filter(Boolean);

  return (
    <MUIBreadcrumbs
      aria-label="breadcrumb"
      spacing={2}
      separator={<NavigateNextRoundedIcon fontSize="small" />}
      sx={{
        // display: { xs: 'none', md: 'flex' },
        width: "100%",
        pt: 1.5,
        ["& .MuiBreadcrumbs-separator"]: { color: "action.disabled" },
        ["& .MuiBreadcrumbs-ol"]: { alignItems: "center" },
      }}
    >
      <Link href="/">Home</Link>
      {pathSegments.map((segment, index) => {
        const isLast = index === pathSegments.length - 1;
        const href = `/${pathSegments.slice(0, index + 1).join("/")}`;

        const text =
          isLast && label
            ? label
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
