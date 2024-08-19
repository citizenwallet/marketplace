import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import type { Viewport } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Market Place - Citizen Wallet",
  description: "Offers and requests from your community",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Also supported by less commonly used
  // interactiveWidget: 'resizes-visual',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} pt-28 max-w-96 mx-auto`}>
        {children}
      </body>
    </html>
  );
}
