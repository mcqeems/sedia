import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sedia",
  description:
    "Sedia adalah aplikasi berbasis teknologi yang dirancang untuk membantu masyarakat memantau kondisi cuaca serta meningkatkan kesiapsiagaan terhadap potensi bencana alam. Aplikasi ini menyediakan informasi cuaca secara real-time, prakiraan cuaca, serta analisis curah hujan yang dapat membantu pengguna memahami kondisi lingkungan di sekitarnya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="overflow-x-hidden md:overflow-x-visible" lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
