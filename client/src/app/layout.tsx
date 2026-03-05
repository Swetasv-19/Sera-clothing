import type { Metadata } from "next";
import "./styles/globals.css";
import "./fonts.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import FooterConditional from "@/components/FooterConditional";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Sera Clothing – Premium Fashion",
  description:
    "Discover timeless elegance with Sera Clothing. Curated premium fashion for the modern wardrobe.",
};

// #region agent log
fetch("http://127.0.0.1:7837/ingest/619b23d4-b5de-40ff-8149-9c1224eb1c8f", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Debug-Session-Id": "8e44df",
  },
  body: JSON.stringify({
    sessionId: "8e44df",
    runId: "pre-fix",
    hypothesisId: "H-css-before-layout",
    location: "src/app/layout.tsx:beforeRootLayout",
    message: "Reached RootLayout module evaluation (CSS successfully processed before this point)",
    data: {},
    timestamp: Date.now(),
  }),
}).catch(() => {});
// #endregion agent log

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
          <CartProvider>
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
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
