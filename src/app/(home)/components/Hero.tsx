"use client";

import { motion, stagger } from "motion/react";
import Image from "next/image";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: stagger(0.3, { startDelay: 0.3 }),
      },
    },
  } as const;

  const headingVariants = {
    hidden: { opacity: 0, y: 75 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 12,
        duration: 0.8,
        ease: "easeOut",
      },
    },
  } as const;

  const paragraphVariants = {
    hidden: { opacity: 0, x: 75 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 12,
        duration: 0.8,
        ease: "easeIn",
      },
    },
  } as const;

  const badgeVariants = {
    hidden: { opacity: 0, y: 75 },
    show: {
      opacity: 1,
      y: 0,

      transition: {
        type: "spring",
        stiffness: 200,
        damping: 12,
        duration: 0.8,
        ease: "easeIn",
      },
    },
  } as const;

  return (
    <section className="py-4 px-1 md:pt-16">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex md:flex-row gap-6 md:gap-0 flex-col justify-between"
      >
        <motion.h1
          variants={headingVariants}
          className="md:leading-16 md:text-6xl text-4xl flex-2 text-center md:text-start"
        >
          Sedia aku,
          <br />
          Sebelum bencana.
        </motion.h1>
        <div className="flex flex-col gap-6 text-[15px] flex-1 md:items-end items-center md:text-end text-center">
          <motion.p variants={paragraphVariants} className="text-slate-700">
            Sistem analisis cuaca dan bencana berbasis AI kami menghadirkan
            prediksi akurat dan pemantauan real-time, mengikuti standar resmi
            nasional untuk memahami kondisi alam Indonesia.
          </motion.p>
          <motion.a
            variants={badgeVariants}
            whileHover={{ scale: 1.05, backgroundColor: "#4a83fe" }}
            whileTap={{ scale: 0.9, backgroundColor: "#3b61b1" }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
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
          </motion.a>
        </div>
      </motion.div>

      <div className="mt-12 px-2 md:px-0 relative">
        <motion.div
          initial={{ opacity: 0, y: 75 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              delay: 2,
              type: "spring",
              stiffness: 200,
              damping: 12,
              duration: 0.8,
              ease: "easeOut",
            },
          }}
          whileHover={{ scale: 1.05, backgroundColor: "#4a83fe" }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="bg-primary drop-shadow-md/20 rounded-full px-6 py-2 font-medium text-sm text-center absolute -bottom-5 left-1/2 transform -translate-x-1/2 flex flex-row gap-3 z-50"
        >
          <motion.div className="px-1" whileHover={{ scale: 1.2, y: -10 }}>
            <Image
              alt="logo-bmkg"
              src="/logo/logo_bmkg.png"
              className="rounded-full bg-background"
              height={24}
              width={24}
              title="Badan Meteorologi, Klimatologi, dan Geofisika"
            />
          </motion.div>
          <motion.div className="px-1" whileHover={{ scale: 1.2, y: -10 }}>
            {" "}
            <Image
              alt="logo-open-weather"
              src="/logo/openweather_logo.png"
              className="rounded-full bg-background"
              height={24}
              width={24}
              title="Open Weather"
            />
          </motion.div>
          <motion.div className="px-1" whileHover={{ scale: 1.2, y: -10 }}>
            <Image
              alt="logo-gemini"
              src="/logo/gemini_logo.png"
              className="rounded-full bg-background"
              height={24}
              width={24}
              title="Gemini"
            />
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 75 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              delay: 1.5,
              // type: "spring",
              // stiffness: 200,
              // damping: 12,
              duration: 0.8,
              ease: "easeOut",
            },
          }}
          className="relative overflow-hidden rounded-3xl bg-primary"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="block h-[200px] w-full object-cover md:h-[550px] opacity-100 md:opacity-75"
            disablePictureInPicture
            aria-label="Blue ambient background video"
          >
            <source
              src="/blue-ambient-mobile.mp4"
              media="(max-width: 767px)"
              type="video/mp4"
            />
            <source
              src="/blue-ambient.mp4"
              media="(min-width: 768px)"
              type="video/mp4"
            />
          </video>
          <div className="pointer-events-none absolute inset-0 bg-primary/25" />
        </motion.div>
      </div>
    </section>
  );
}
