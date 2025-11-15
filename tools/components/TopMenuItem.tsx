import Link from "next/link";
import { ReactNode } from "react";

export default function TopMenuItem({ title, pageRef }:{ title: ReactNode; pageRef: string}) {
  return (
    <Link href={pageRef}>
      {title}
    </Link>
  );
}