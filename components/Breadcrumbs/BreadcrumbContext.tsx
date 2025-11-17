"use client";

import { usePathname } from "next/navigation";
import { createContext, ReactNode, useContext, useState } from "react";

type BreadcrumbContextType = {
  labels: Record<number, string>;
  setLabel: (label: string, index?: number) => void;
};

const BreadcrumbContext = createContext<BreadcrumbContextType>({
  labels: [],
  setLabel: () => {},
});

export const useBreadcrumb = () => useContext(BreadcrumbContext);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const [labels, setLabels] = useState<Record<number, string>>({});

  function setLabel(label: string, index?: number) {
    if (index === undefined) {
      const pathSegments = pathname.split("/").filter(Boolean);
      index = pathSegments.length - 1;
    }

    setLabels((prev) => {
      const newLabels = { ...prev };
      newLabels[index!] = label;
      return newLabels;
    });
  }

  return (
    <BreadcrumbContext.Provider value={{ labels, setLabel }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}
