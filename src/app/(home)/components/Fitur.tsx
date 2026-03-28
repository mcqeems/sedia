"use client";
import { motion } from "motion/react";
import Image from "next/image";

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

      <div className="flex flex-col md:flex-row gap-2 md:gap-4 md:mt-12 mt-8">
        <div className="relative flex-1 md:py-20 md:px-8 py-8 px-4 flex flex-col gap-4 justify-center items-center rounded-2xl overflow-hidden ">
          <div className="absolute inset-0 z-[1] pointer-events-none">
            <Image
              src="/bg-card.png"
              alt="background card"
              fill
              className="object-cover object-center"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
          <p className="text-2xl font-semibold text-slate-700 w-full z-2">
            Sistem Peringatan Dini Bencana
          </p>
          <p className="text-slate-600 w-full z-2">
            Dapatkan notifikasi peringatan instan apabila terdeteksi potensi
            bahaya seperti banjir, gempa bumi, atau hujan lebat disertai petir.
            Selalu selangkah lebih maju untuk meminimalkan risiko dan melindungi
            diri Anda.
          </p>

          <Image
            src="/exclamation-mark-glass.png"
            alt="exclamation mark glass"
            className="w-[200px] h-[200px] z-2 md:mt-12 mt-4 hidden md:block"
            width={200}
            height={200}
          />

          <Image
            src="/exclamation-mark-glass.png"
            alt="exclamation mark glass"
            className="w-[250px] h-[250px] z-1 absolute -bottom-15 -right-15 md:hidden block opacity-50"
            width={200}
            height={200}
          />
        </div>
        <div className="flex-2 flex flex-col gap-4">
          <div className="py-8 px-4 relative overflow-hidden rounded-2xl flex-1">
            <div className="absolute inset-0 -z-1 pointer-events-none">
              <Image
                src="/bg-card.png"
                alt="background card"
                fill
                className="object-cover object-center"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
            <Image
              src="/live-glass.png"
              alt="Live glass"
              className="md:w-[200px] md:h-[200px] w-[250px] h-[250px] z-2 absolute md:top-0 md:right-0 -bottom-15 -right-15 md:opacity-100 opacity-50"
              width={200}
              height={200}
            />
            <div className="flex flex-col h-full justify-end gap-4">
              <p className="text-2xl font-semibold text-slate-700 w-full z-2">
                Pemantauan & Prakiraan Real-time
              </p>
              <p className="text-slate-600 w-full z-2">
                Akses kondisi cuaca terkini, data curah hujan, dan prakiraan
                cuaca akurat untuk beberapa hari ke depan agar Anda dapat
                merencanakan aktivitas dengan lebih baik.
              </p>
            </div>
          </div>
          <div className="py-8 px-4 relative overflow-hidden rounded-2xl flex-1">
            <div className="absolute inset-0 -z-1 pointer-events-none">
              <Image
                src="/bg-card.png"
                alt="background card"
                fill
                className="object-cover object-center"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
            <Image
              src="/sparkles-glass.png"
              alt="sparkles glass"
              className="md:w-[200px] md:h-[200px] w-[250px] h-[250px] z-2 absolute md:top-0 md:right-0 -bottom-15 -right-15 md:opacity-100 opacity-50"
              width={200}
              height={200}
            />
            <div className="flex flex-col h-full justify-end gap-4">
              <p className="text-2xl font-semibold text-slate-700 w-full z-2">
                Asisten AI SediaBot & Rekomendasi{" "}
              </p>
              <p className="text-slate-600 w-full z-2">
                Dapatkan panduan keselamatan dan rekomendasi tindakan dari
                kecerdasan buatan kami. Ketahui langkah tepat yang harus
                dipersiapkan sebelum, saat, dan sesudah kondisi cuaca ekstrem.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
