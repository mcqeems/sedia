"use client";

import type { Variants } from "motion/react";
import { AnimatePresence, stagger } from "motion/react";
import * as motion from "motion/react-client";
import { useState } from "react";

export default function NavbarMobile() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="z-[120] h-12 w-12">
      <MenuToggle isOpen={isOpen} toggle={() => setIsOpen((prev) => !prev)} />

      <AnimatePresence>
        {isOpen ? (
          <motion.nav
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-[110]"
            aria-label="Mobile navigation"
          >
            <motion.div
              className="absolute inset-0 bg-background"
              variants={sidebarVariants}
            />

            <Navigation onNavigate={() => setIsOpen(false)} />
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

const navVariants = {
  open: {
    transition: { delayChildren: stagger(0.07, { startDelay: 0.2 }) },
  },
  closed: {
    transition: { delayChildren: stagger(0.05, { from: "last" }) },
  },
};

const navItems = [
  { label: "Tentang", href: "/#tentang" },
  { label: "Fitur", href: "/#fitur" },
  { label: "FAQ", href: "/#faq" },
  { label: "Mulai", href: "/dashboard", isCta: true },
];

const itemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

const Navigation = ({ onNavigate }: { onNavigate: () => void }) => (
  <motion.ul
    className="absolute top-24 left-0 w-full box-border px-7"
    variants={navVariants}
    initial={false}
  >
    {navItems.map((item) => (
      <MenuItem key={item.href} item={item} onNavigate={onNavigate} />
    ))}
  </motion.ul>
);

const MenuItem = ({
  item,
  onNavigate,
}: {
  item: (typeof navItems)[number];
  onNavigate: () => void;
}) => {
  const baseClass =
    "block w-full rounded-full border px-5 py-3 text-base tracking-wider transition-colors text-center";
  const className = item.isCta
    ? `${baseClass} border-primary bg-primary text-primary-foreground`
    : `${baseClass} border-border text-slate-700 bg-white/90`;

  return (
    <motion.li
      className="mb-4 list-none"
      variants={itemVariants}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <a href={item.href} className={className} onClick={onNavigate}>
        {item.label}
      </a>
    </motion.li>
  );
};

const sidebarVariants: Variants = {
  open: {
    clipPath: "circle(150vmax at calc(100% - 2.5rem) 2.5rem)",
    transition: {
      type: "spring",
      stiffness: 30,
      restDelta: 2,
    },
  },
  closed: {
    clipPath: "circle(1.5rem at calc(100% - 2.5rem) 2.5rem)",
    transition: {
      delay: 0.05,
      type: "spring",
      stiffness: 380,
      damping: 36,
    },
  },
};

interface PathProps {
  d?: string;
  variants: Variants;
  transition?: { duration: number };
}

const Path = (props: PathProps) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="hsl(0, 0%, 18%)"
    strokeLinecap="round"
    {...props}
  />
);

const MenuToggle = ({
  toggle,
  isOpen,
}: {
  toggle: () => void;
  isOpen: boolean;
}) => (
  <motion.button
    initial="closed"
    animate={isOpen ? "open" : "closed"}
    type="button"
    className={`${
      isOpen ? "fixed top-3 right-3" : "relative"
    } z-[130] flex h-12 w-12 items-center justify-center rounded-full bg-background/95 backdrop-blur`}
    onClick={toggle}
    aria-expanded={isOpen}
    aria-label={isOpen ? "Close menu" : "Open menu"}
  >
    <motion.svg width="24" height="24" viewBox="0 0 24 24">
      <title>{isOpen ? "Close menu" : "Open menu"}</title>
      <Path
        d="M 2 2.5 L 20 2.5"
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5" },
          open: { d: "M 3 16.5 L 17 2.5" },
        }}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        d="M 2 16.346 L 20 16.346"
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346" },
          open: { d: "M 3 2.5 L 17 16.346" },
        }}
      />
    </motion.svg>
  </motion.button>
);
