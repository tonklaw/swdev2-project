"use client";

import { createContext, useContext, useState } from "react";

const BreadcrumbContext = createContext({
  setLabel: (label: string) => {},
  label: "",
});

export const useBreadcrumb = () => useContext(BreadcrumbContext);

export function BreadcrumbProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [label, setLabel] = useState("");

  return (
    <BreadcrumbContext.Provider value={{ label, setLabel }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}
