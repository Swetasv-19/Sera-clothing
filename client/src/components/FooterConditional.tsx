"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

export default function FooterConditional() {
  const pathname = usePathname();
  // Hide footer on all /auth/* pages
  if (pathname?.startsWith("/auth")) return null;
  return <Footer />;
}
