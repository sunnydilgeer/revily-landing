import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/lexend";
import "@fontsource/caveat/700.css";
import "../src/ui/revily-tokens.css";
import "../src/ui/revily-ui.css";
import "./globals.css";
import "katex/dist/katex.min.css";
import { AppHeader } from "@/components/AppHeader";

export const metadata: Metadata = {
  title: "Revily",
  description: "Level up your maths",
};

// "cover" lets the page reach under the iPhone home indicator, so env(safe-area-inset-bottom) is real
// and the bottom navigation can pad itself instead of leaving a gap below it.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0f1117] antialiased">
        <AppHeader />
        {children}
      </body>
    </html>
  );
}