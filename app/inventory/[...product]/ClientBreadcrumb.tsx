"use client";

import React from "react";

import { useBreadcrumb } from "@/components/Breadcrumbs/BreadcrumbContext";

export default function ClientBreadcrumb({ title }: { title: string }) {
  const { setLabel } = useBreadcrumb();

  React.useEffect(() => {
    console.log(`Setting breadcrumb label to ${title} at index 1`);
    setLabel(title, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
