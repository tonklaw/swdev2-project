"use client";

import React from "react";

import { useBreadcrumb } from "@/components/Breadcrumbs/BreadcrumbContext";

export default function ClientBreadcrumb({ title }: { title: string }) {
  const { setLabel } = useBreadcrumb();

  React.useEffect(() => {
    setLabel(title, 1);
  }, [setLabel, title]);

  return null;
}
