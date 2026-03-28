"use client";
import { motion } from "motion/react";

export default function Fitur() {
  return (
    <section className="md:px-1 px-2 md:pt-24 pt-16 pb-4" id="fitur">
      <div className="flex flex-col gap-2 md:gap-4">
        <motion.h2
          initial={{ opacity: 0, x: -75 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{
            type: "spring",
            stiffness: 250,
            damping: 13,
            duration: 0.8,
            ease: "easeOut",
          }}
          className="text-4xl text-slate-700"
        >
          Pantau Cuaca dan Hadapi Bencana dengan Cerdas
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, x: -75 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 250,
            damping: 13,
            duration: 0.8,
            ease: "easeOut",
          }}
          className="text-xl text-slate-600"
        >
          Sedia adalah aplikasi pintar yang membantu Anda memantau kondisi cuaca
          real-time, memberikan peringatan dini, dan meningkatkan kesiapsiagaan
          terhadap potensi bencana alam di sekitar Anda.
        </motion.p>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          style={{ originX: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          viewport={{ once: true }}
          className="h-0.5 bg-slate-300 w-full"
        ></motion.div>
      </div>
    </section>
  );
}
