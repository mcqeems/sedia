"use client";

import { motion } from "motion/react";
import Image from "next/image";

export default function Outro() {
  return (
    <section className="px-2 pb-8 pt-16 md:px-1 md:pt-24 w-full">
      <div className="relative rounded-2xl overflow-hidden px-2 py-12 bg-primary">
        <div className="flex flex-col gap-2 justify-center items-center z-2 text-background text-center">
          <h2 className="text-4xl max-w-3xl drop-shadow-lg/15 z-2">
            Sudah siap menghadapi perubahan cuaca dan potensi bencana?
          </h2>
          <p className="drop-shadow-lg/15 max-w-md z-2">
            Gunakan Sedia sekarang untuk membantu anda menghindari potensi dan
            resiko bencana.
          </p>
          <motion.a
            href="/dashboard"
            className="z-2 mt-8 bg-primary px-6 py-2 rounded-full cursor-pointer"
          >
            Mulai Sekarang
          </motion.a>
        </div>
        <div className="absolute inset-0 z-1 pointer-events-none">
          <Image
            src="/blue-ambient-outro-2.jpg"
            alt="background card"
            fill
            className="object-cover object-center opacity-75"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
      </div>
    </section>
  );
}
