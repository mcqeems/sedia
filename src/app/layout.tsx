import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sedia | Pantau Cuaca dan Kesiapsiagaan Bencana",
    template: "%s | Sedia",
  },
  description:
    "Sedia membantu masyarakat memantau cuaca real-time, prakiraan cuaca, peringatan dini, dan informasi kebencanaan agar lebih siap menghadapi risiko bencana.",
  applicationName: "Sedia",
  keywords: [
    "Sedia",
    "cuaca Indonesia",
    "prakiraan cuaca",
    "peringatan dini",
    "informasi gempa",
    "kesiapsiagaan bencana",
    "BMKG",
  ],
  authors: [{ name: "Tim Sedia" }],
  creator: "Tim Sedia",
  publisher: "Sedia",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: "Sedia",
    title: "Sedia | Pantau Cuaca dan Kesiapsiagaan Bencana",
    description:
      "Pantau cuaca real-time, prakiraan, dan informasi kebencanaan dalam satu dashboard untuk membantu pengambilan keputusan yang lebih cepat.",
    images: [
      {
        url: "/logo/logo_500x500.png",
        width: 500,
        height: 500,
        alt: "Logo Sedia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sedia | Pantau Cuaca dan Kesiapsiagaan Bencana",
    description:
      "Aplikasi pemantauan cuaca dan kebencanaan untuk membantu kesiapsiagaan masyarakat Indonesia.",
    images: ["/logo/logo_500x500.png"],
  },
  icons: {
    icon: "/logo/favicon48.png",
    apple: "/logo/favicon48.png",
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "weather",
  other: {
    "dicoding:email": "mcqeemsofficial@gmail.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="overflow-x-hidden md:overflow-x-visible" lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}
