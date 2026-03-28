import Hero from "@/app/(home)/components/Hero";
import Faq from "./components/Faq";
import Fitur from "./components/Fitur";
import Outro from "./components/Outro";
import Tentang from "./components/Tentang";

export default function Home() {
  return (
    <>
      <Hero />
      <Tentang />
      <Fitur />
      <Faq />
      <Outro />
    </>
  );
}
