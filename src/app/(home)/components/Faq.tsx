"use client";

import { motion } from "motion/react";
import { useState } from "react";

const faqItems = [
  {
    question: "Apa itu aplikasi Sedia?",
    answer:
      "Sedia adalah aplikasi berbasis teknologi yang dirancang untuk membantu masyarakat memantau kondisi cuaca secara real-time, menyediakan prakiraan cuaca, dan menganalisis curah hujan. Aplikasi ini juga berfungsi untuk meningkatkan kesiapsiagaan pengguna terhadap potensi bencana alam melalui peringatan dini.",
  },
  {
    question: "Peringatan bencana apa saja yang ada di aplikasi Sedia?",
    answer:
      "Aplikasi Sedia memiliki sistem peringatan dini yang akan memberikan notifikasi atau popup apabila terdeteksi potensi bencana seperti banjir, gempa bumi, hujan lebat disertai petir, serta cuaca ekstrem lainnya.",
  },
  {
    question: "Apakah Sedia memberikan saran keselamatan saat cuaca ekstrem?",
    answer:
      "Ya, Sedia memiliki fitur rekomendasi aksi berbasis AI yang akan memberikan tindakan spesifik untuk pengguna. Rekomendasi ini meliputi persiapan sebelum hujan lebat, tindakan yang harus dilakukan saat terjadi gempa, hingga langkah-langkah pencegahan banjir.",
  },
  {
    question: "Apa kegunaan fitur SediaBot di dalam aplikasi?",
    answer:
      "SediaBot adalah asisten berbasis AI yang berfungsi untuk menjawab pertanyaan pengguna dan memberikan panduan terkait kondisi cuaca, potensi bencana, serta langkah mitigasi keselamatan. Sistem ini dirancang dengan prompt khusus agar fokus pada topik cuaca dan keselamatan.",
  },
  {
    question: "Apakah saya bisa melihat perkiraan cuaca untuk besok?",
    answer:
      "Tentu bisa, Sedia menyediakan fitur prakiraan cuaca untuk beberapa waktu ke depan. Fitur ini ditujukan agar pengguna dapat merencanakan aktivitas mereka dengan jauh lebih baik.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <section id="faq" className="px-2 pb-8 pt-16 md:px-1 md:pt-24">
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
          viewport={{ once: true }}
          className="text-4xl text-slate-700"
        >
          Pertanyaan yang Sering Diajukan
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
          viewport={{ once: true }}
          className="text-xl text-slate-600"
        >
          Temukan jawaban cepat tentang cara kerja Sedia, sumber data, dan fitur
          utama yang membantu Anda lebih siap menghadapi cuaca ekstrem.
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
          className="h-0.5 w-full bg-slate-300"
        />
      </div>

      <div className="mt-8 grid gap-3 md:mt-12 md:gap-4">
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <motion.div
              key={item.question}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.2 + index * 0.1,
                type: "spring",
                stiffness: 200,
                damping: 14,
                duration: 0.9,
              }}
              viewport={{ once: true }}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm"
            >
              <motion.button
                type="button"
                initial={{ backgroundColor: "#f8fafc" }}
                whileHover={{ backgroundColor: "#f1f5f9" }}
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left md:px-6 md:py-5 cursor-pointer"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="text-base font-semibold text-slate-700 md:text-xl">
                  {item.question}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="text-2xl leading-none text-primary"
                >
                  +
                </motion.span>
              </motion.button>

              <motion.div
                id={`faq-answer-${index}`}
                initial={false}
                animate={{
                  height: isOpen ? "auto" : 0,
                  opacity: isOpen ? 1 : 0,
                }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-5 text-slate-600 md:px-6 md:pb-6">
                  {item.answer}
                </p>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
