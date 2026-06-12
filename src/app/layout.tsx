import type { Metadata } from "next";
import { JetBrains_Mono, Syne } from "next/font/google";
import "./globals.css";
import { Providers } from "./provider";

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["300", "400", "500", "600", "700"],
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400","500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "EDGE.LOG — Trading Journal",
  description:
    "A fast, insight-focused trading journal for discretionary traders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jetBrainsMono.variable} ${syne.variable} font-display antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
