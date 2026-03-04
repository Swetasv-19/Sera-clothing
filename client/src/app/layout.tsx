import type { Metadata } from "next";
import "./styles/globals.css";
import "./fonts.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import FooterConditional from "@/components/FooterConditional";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Sera Clothing – Premium Fashion",
  description:
    "Discover timeless elegance with Sera Clothing. Curated premium fashion for the modern wardrobe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Inline script: apply theme before first paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('theme');
                  if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                    if (!t) localStorage.setItem('theme', 'dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                    if (!t) localStorage.setItem('theme', 'light');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />

        <AuthProvider>
          <ThemeProvider>
            <Toaster position="bottom-right" />
            {/* App shell: navbar → page content → footer */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100dvh",
              }}
            >
              <Navbar />
              <main style={{ flex: 1 }}>{children}</main>
              <FooterConditional />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
