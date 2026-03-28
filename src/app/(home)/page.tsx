import type { Metadata } from "next";
import Hero from "@/app/(home)/components/Hero";
import Faq from "./components/Faq";
import Fitur from "./components/Fitur";
import Outro from "./components/Outro";
import Tentang from "./components/Tentang";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    absolute: "Sedia",
  },
  description:
    "Sedia adalah aplikasi pemantauan cuaca dan informasi kebencanaan untuk membantu masyarakat lebih siap menghadapi kondisi ekstrem.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "Sedia",
        url: siteUrl,
        logo: `${siteUrl}/logo/logo_500x500.png`,
      },
      {
        "@type": "WebSite",
        name: "Sedia",
        url: siteUrl,
        inLanguage: "id-ID",
        description:
          "Aplikasi pemantauan cuaca, peringatan dini, dan informasi kebencanaan.",
      },
      {
        "@type": "WebApplication",
        name: "Sedia",
        applicationCategory: "WeatherApplication",
        operatingSystem: "Web",
        url: siteUrl,
        inLanguage: "id-ID",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "IDR",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <Hero />
      <Tentang />
      <Fitur />
      <Faq />
      <Outro />
    </>
  );
}
