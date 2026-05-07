import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scrap Tracking Proposal",
  description: "LocaXion Scrap Tracking Proposal for Arconic.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
