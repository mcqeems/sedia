import Image from "next/image";

export default function Hero() {
  return (
    <section className="w-full max-w-6xl py-4 px-1 mx-auto md:pt-16">
      <div className="flex md:flex-row gap-6 md:gap-0 flex-col justify-between">
        <h1 className="md:leading-16 md:text-6xl text-4xl flex-2 text-center md:text-start">
          Sedia aku,
          <br />
          Sebelum bencana.
        </h1>
        <div className="flex flex-col gap-6 text-[15px] flex-1 md:items-end items-center md:text-end text-center">
          <p className="text-slate-700">
            Sistem analisis cuaca dan bencana berbasis AI kami menghadirkan
            prediksi akurat dan pemantauan real-time, mengikuti standar resmi
            nasional untuk memahami kondisi alam Indonesia.
          </p>
          <a
            href="https://data.bmkg.go.id/"
            className="flex gap-2 justify-center items-center font-medium text-sm bg-primary px-2 py-2 max-w-[225px] w-full rounded-full text-background"
          >
            Dibuat dengan data BMKG
            <Image
              alt="logo-bmkg"
              src="/logo/logo_bmkg.png"
              height={24}
              width={24}
            />
          </a>
        </div>
      </div>

      <div className="mt-12 px-2 md:px-0 relative">
        <div className="bg-primary drop-shadow-md/20 rounded-full px-6 py-2 font-medium text-sm text-center absolute -bottom-5 left-1/2 transform -translate-x-1/2 flex flex-row gap-2 z-100">
          <Image
            alt="logo-bmkg"
            src="/logo/logo_bmkg.png"
            className="rounded-full bg-background"
            height={24}
            width={24}
          />
          <Image
            alt="logo-open-weather"
            src="/logo/openweather_logo.png"
            className="rounded-full bg-background"
            height={24}
            width={24}
          />
          <Image
            alt="logo-gemini"
            src="/logo/gemini_logo.png"
            className="rounded-full bg-background"
            height={24}
            width={24}
          />
        </div>
        <div className="rounded-3xl bg-primary">
          <video
            src="/blue-ambient.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="block h-[420px] w-full rounded-3xl object-cover opacity-75 md:h-[500px]"
            aria-label="Blue ambient background video"
          />
        </div>
      </div>
    </section>
  );
}
