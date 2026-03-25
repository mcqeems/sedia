"use client";

import { motion } from "motion/react";
import type React from "react";
import Logo from "../Logo";

export function ItemNav({
  children,
  link,
}: {
  children: React.ReactNode;
  link: string;
}) {
  return (
    <motion.a
      whileHover={{ scale: 1.05, color: "#62748e" }}
      whileTap={{ scale: 0.9, color: "##314158" }}
      href={link}
    >
      {children}
    </motion.a>
  );
}

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-100 md:px-2 md:py-4 p-1">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 12,
          duration: 0.8,
        }}
        className="max-w-6xl border border-slate-200 bg-background rounded-full mx-auto md:py-2 md:px-6 py-1.5 px-0.5"
      >
        <div className="flex flex-row justify-between">
          <motion.a
            whileHover={{ scale: 1.05, color: "#4a83fe" }}
            whileTap={{ scale: 0.9, color: "#3b61b1" }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            href="/"
            className="text-primary h-12 w-24 p-2"
          >
            <Logo />
          </motion.a>
          <div className="hidden md:flex flex-row gap-4 font-normal text-[15px] tracking-wider text-slate-600 justify-center items-center">
            <ItemNav link="/#tentang">Tentang</ItemNav>
            <ItemNav link="/#fitur">Fitur</ItemNav>
            <ItemNav link="/#faq">FAQ</ItemNav>

            <motion.a
              whileHover={{ scale: 1.05, backgroundColor: "#4a83fe" }}
              whileTap={{ scale: 0.9, backgroundColor: "#3b61b1" }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="!tracking-widest bg-primary text-background py-2 px-6 rounded-full font-medium"
              href="/dashboard"
            >
              Mulai
            </motion.a>
          </div>
        </div>
      </motion.div>
    </nav>
  );
}
