"use client";

import { motion } from "motion/react";
import type React from "react";
import Logo from "../Logo";
import NavbarMobile from "./NavbarMobile";

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
    <nav className="fixed inset-x-0 top-0 z-100 overflow-x-clip md:px-2 md:py-4 py-1 px-0">
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 12,
          duration: 0.8,
        }}
        className="box-border w-[calc(100%-0.5rem)] max-w-6xl border border-slate-200 bg-background rounded-full mx-auto md:py-2 md:px-6 py-1.5 px-2"
      >
        <div className="flex flex-row justify-between items-center">
          <motion.a
            whileHover={{ scale: 1.05, color: "#4a83fe" }}
            whileTap={{ scale: 0.9, color: "#3b61b1" }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            href="/"
            className="text-primary h-12 w-24 p-2"
          >
            <Logo />
          </motion.a>
          <div className="md:hidden block">
            <NavbarMobile />
          </div>
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
