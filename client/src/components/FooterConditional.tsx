"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

export default function FooterConditional() {
  const pathname = usePathname();
  // Hide footer on all /auth/* and /admin/* pages
  if (pathname?.startsWith("/auth") || pathname?.startsWith("/admin"))
    return null;

  return <Footer />;
}
