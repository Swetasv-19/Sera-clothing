import type { Metadata } from "next";
import "./globals.css";
import "./fonts.css";
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
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300 antialiased">
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
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1 px-4 sm:px-6 lg:px-16 pt-8 pb-16">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
