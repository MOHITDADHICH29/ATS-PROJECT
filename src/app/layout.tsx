import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Impact ATS | Talent workspace",
  description: "An explainable, AI-powered talent screening workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
