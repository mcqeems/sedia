"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Logo from "@/components/Logo";

export default function Outro() {
  return (
    <section className="px-2 pb-8 pt-16 md:px-1 md:pt-24 w-full">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 12,
          duration: 0.8,
        }}
        viewport={{ once: true }}
        className="relative rounded-2xl overflow-hidden px-2 py-12 bg-primary"
      >
        <div className="flex flex-col gap-2 justify-center items-center z-2 text-background text-center">
          <h2 className="text-4xl max-w-3xl drop-shadow-lg/15 z-2">
            Sudah siap menghadapi perubahan cuaca dan potensi bencana?
          </h2>
          <p className="drop-shadow-lg/15 max-w-md z-2">
            Gunakan Sedia sekarang untuk membantu anda menghindari potensi dan
            resiko bencana.
          </p>
          <motion.a
            whileHover={{ scale: 1.05, backgroundColor: "#4a83fe" }}
            whileTap={{ scale: 0.9, backgroundColor: "#3b61b1" }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            href="/dashboard"
            className="z-2 mt-8 bg-primary px-6 py-2 rounded-full cursor-pointer"
          >
            Mulai Sekarang
          </motion.a>
        </div>
        <div className="absolute inset-0 z-1 pointer-events-none">
          <Image
            src="/silky-background.jpg"
            alt="background card"
            fill
            className="object-cover object-center opacity-75"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 100, scaleY: 0.5 }}
        whileInView={{
          opacity: 1,
          y: 0,
          scaleY: 1,
          transition: {
            delay: 0.4,
            type: "spring",
            stiffness: 150,
            damping: 8,
            duration: 1,
          },
        }}
        whileHover={{
          scale: 1.05,
          transition: {
            type: "spring",
            stiffness: 150,
            damping: 8,
            duration: 0.8,
          },
        }}
        viewport={{ once: true }}
        className="py-16"
      >
        <div className="max-w-[1000px] md:mt-16 mt-8 mx-auto">
          <Logo className="text-primary" />
        </div>
      </motion.div>
    </section>
  );
}
