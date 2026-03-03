import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Sera Clothing",
  description: "Fashion e-commerce platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="transition-colors duration-300">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const storedTheme = localStorage.getItem('theme');
                if (storedTheme) {
                  document.documentElement.classList.toggle('dark', storedTheme === 'dark');
                } else {
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  document.documentElement.classList.toggle('dark', prefersDark);
                  localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
                }
              })();
            `,
          }}
        />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
