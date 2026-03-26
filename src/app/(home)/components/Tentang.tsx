"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

type AnimatedUnderlineTextProps = {
  children: ReactNode;
  textClassName: string;
  underlineClassName: string;
  delay: number;
};

function AnimatedUnderlineText({
  children,
  textClassName,
  underlineClassName,
  delay,
}: AnimatedUnderlineTextProps) {
  return (
    <motion.span
      className={`font-bold relative inline-block ${textClassName}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {children}
      <motion.span
        className={`absolute left-0 -bottom-1 h-[6px] w-full ${underlineClassName}`}
        variants={{
          hidden: { scaleX: 0 },
          visible: { scaleX: 1 },
        }}
        style={{ originX: 0 }}
        transition={{
          delay,
          duration: 0.8,
          ease: "easeInOut",
        }}
      />{" "}
    </motion.span>
  );
}

export default function Tentang() {
  return (
    <section id="tentang" className="md:px-1 px-2 py-4 md:mt-16 mt-8">
      <motion.h2
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
          type: "spring",
          stiffness: 200,
          damping: 12,
        }}
        viewport={{ once: true }}
        className="text-2xl text-slate-700"
      >
        Tentang Sedia
      </motion.h2>
      <div className="w-full max-w-4xl mx-auto mt-8 md:text-7xl text-4xl md:leading-24 leading-14 px-4 md:px-0">
        <motion.span
          className="inline-block will-change-transform"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            type: "spring",
            stiffness: 200,
            damping: 12,
          }}
          viewport={{ once: true }}
        >
          Sedia adalah aplikasi untuk{" "}
          <AnimatedUnderlineText
            textClassName="text-primary"
            underlineClassName="bg-primary"
            delay={0.6}
          >
            memantau kondisi
          </AnimatedUnderlineText>{" "}
          dan{" "}
          <AnimatedUnderlineText
            textClassName="text-green-500"
            underlineClassName="bg-green-500"
            delay={0.8}
          >
            prakiraan cuaca
          </AnimatedUnderlineText>
          , menampilkan{" "}
          <AnimatedUnderlineText
            textClassName="text-pink-500"
            underlineClassName="bg-pink-500"
            delay={1}
          >
            data curah hujan
          </AnimatedUnderlineText>
          , memberikan{" "}
          <AnimatedUnderlineText
            textClassName="text-red-500"
            underlineClassName="bg-red-500"
            delay={1.2}
          >
            peringatan dini bencana
          </AnimatedUnderlineText>
          , serta menyediakan{" "}
          <AnimatedUnderlineText
            textClassName="text-yellow-500"
            underlineClassName="bg-yellow-500"
            delay={1.4}
          >
            rekomendasi tindakan
          </AnimatedUnderlineText>{" "}
          berdasarkan analisis AI.
        </motion.span>
      </div>
    </section>
  );
}
