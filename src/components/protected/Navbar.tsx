"use client";

import {
  IconDots,
  IconHome,
  IconLogout,
  IconMenu2,
  IconMessageCircle,
  IconX,
} from "@tabler/icons-react";
import { AnimatePresence, motion, useMotionValue } from "motion/react";
import Image from "next/image";
import { RedirectType, redirect, usePathname } from "next/navigation";
import type { ComponentType } from "react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";

type IconProps = {
  className?: string;
};

interface Navigations {
  name: string;
  title?: string;
  action: () => void | Promise<void>;
  icon: ComponentType<IconProps>;
}

export default function Navbar() {
  const supabase = createClient();
  const pathname = usePathname();
  const constraintsRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const mobileMenuContentRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isPositioned, setIsPositioned] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileMenuHeight, setMobileMenuHeight] = useState(0);
  const [mobileRevealDirection, setMobileRevealDirection] = useState<
    "down" | "up"
  >("down");

  const navigations: Navigations[] = [
    {
      name: "dashboard",
      title: "Redirect ke Dashboard.",
      action: () => {
        redirect("/dashboard", RedirectType.push);
      },
      icon: IconHome,
    },
    {
      name: "chat",
      title: "Redirect ke Chat.",
      action: () => {
        redirect("/chat", RedirectType.push);
      },
      icon: IconMessageCircle,
    },
    {
      name: "logout",
      title: "Keluar dari akun anda.",
      action: () => {
        const logout = async () => {
          const { error } = await supabase.auth.signOut();

          if (error) {
            console.error("Error signing out: ", error.cause);
          }
        };
        logout();
        redirect("/", RedirectType.push);
      },
      icon: IconLogout,
    },
  ];

  useLayoutEffect(() => {
    const node = navRef.current;
    if (!node) return;

    const placeNavbar = () => {
      const rect = node.getBoundingClientRect();
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      const startX = isDesktop
        ? 60
        : Math.max(window.innerWidth - rect.width - 2, 0);
      const startY = isDesktop
        ? Math.max((window.innerHeight - rect.height) / 2, 0)
        : Math.max((window.innerHeight - rect.height) / 2, 0);

      x.set(startX);
      y.set(startY);
      setIsPositioned(true);
    };

    placeNavbar();
    window.addEventListener("resize", placeNavbar);

    return () => {
      window.removeEventListener("resize", placeNavbar);
    };
  }, [x, y]);

  useLayoutEffect(() => {
    const node = mobileMenuContentRef.current;
    if (!node) return;

    const measureHeight = () => {
      setMobileMenuHeight(node.scrollHeight);
    };

    measureHeight();
    window.addEventListener("resize", measureHeight);

    return () => {
      window.removeEventListener("resize", measureHeight);
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const handleMediaChange = () => {
      if (mediaQuery.matches) {
        setIsMobileMenuOpen(false);
      }
    };

    handleMediaChange();
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  const updateMobileRevealDirection = useCallback(() => {
    const toggleNode = mobileToggleRef.current;
    if (!toggleNode) return;

    const buttonRect = toggleNode.getBoundingClientRect();
    const itemSize = 40;
    const itemGap = 8;
    const menuHeight =
      navigations.length * itemSize + (navigations.length - 1) * itemGap;
    const screenPadding = 16;
    const availableBelow =
      window.innerHeight - buttonRect.bottom - screenPadding;
    const availableAbove = buttonRect.top - screenPadding;

    setMobileRevealDirection(
      availableBelow >= menuHeight || availableBelow >= availableAbove
        ? "down"
        : "up",
    );
  }, [navigations.length]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    updateMobileRevealDirection();
    window.addEventListener("resize", updateMobileRevealDirection);

    return () => {
      window.removeEventListener("resize", updateMobileRevealDirection);
    };
  }, [isMobileMenuOpen, updateMobileRevealDirection]);

  const handleNavAction = (action: () => void | Promise<void>) => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }

    void Promise.resolve(action());
  };

  return (
    <div
      ref={constraintsRef}
      className="fixed inset-0 z-50 pointer-events-none"
    >
      <motion.nav
        ref={navRef}
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.5}
        dragMomentum={true}
        whileDrag={{ scale: 1.05 }}
        transition={{ type: "spring" }}
        dragTransition={{ power: 0.2 }}
        onDragEnd={updateMobileRevealDirection}
        style={{ x, y }}
        className={`pointer-events-auto absolute rounded-4xl md:px-3.5 md:py-4 px-2 py-2 overflow-hidden bg-primary/80 shadow-2xl cursor-grab active:cursor-grabbing transition-shadow duration-200 ease-out ${isMobileMenuOpen ? (mobileRevealDirection === "down" ? "pb-0" : "pt-0") : ""} ${isPositioned ? "opacity-100" : "opacity-0"}`}
        title="Navbar ini bisa dipindah."
      >
        <Image
          loading="eager"
          src="/bg-nav.jpeg"
          alt="nav page"
          fill
          className="absolute -z-10 top-0 left-0 opacity-30"
          draggable={false}
        />

        <div className="hidden md:flex flex-col md:gap-3 gap-2">
          {navigations.map((nav) => {
            const Icon = nav.icon;

            return (
              <motion.button
                key={nav.name}
                type="button"
                onClick={() => handleNavAction(nav.action)}
                title={nav.title}
                aria-label={nav.name}
                className={`rounded-full p-2 ${pathname === `/${nav.name.toLowerCase()}` ? "bg-background/80 hover:bg-background/90" : "bg-background/0 hover:bg-background/30"} transition-all ease-out cursor-pointer drop-shadow-2xl shadow-2xl border border-background/10`}
                whileTap={{ scale: 1.2 }}
                whileHover={{ scale: 1.1 }}
              >
                <Icon className="w-6 h-6 text-foreground/60 antialiased" />
              </motion.button>
            );
          })}
        </div>

        <div className="hidden md:flex justify-center items-center mt-4">
          <IconDots className="w-6 h-6 text-foreground/40" />
        </div>

        <div
          className={`md:hidden flex items-center gap-0 ${mobileRevealDirection === "down" ? "flex-col" : "flex-col-reverse"}`}
        >
          <button
            ref={mobileToggleRef}
            type="button"
            aria-label={
              isMobileMenuOpen ? "Close navbar menu" : "Open navbar menu"
            }
            title={isMobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => {
              if (!isMobileMenuOpen) {
                updateMobileRevealDirection();
              }
              setIsMobileMenuOpen((prev) => !prev);
            }}
            className="rounded-full p-2 bg-transparent hover:bg-background/15 cursor-pointer drop-shadow-2xl shadow-2xl border border-background/20"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isMobileMenuOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, scale: 0.8, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0.8, opacity: 0 }}
                  transition={{
                    type: "spring",
                    duration: 0.3,
                  }}
                  className="block"
                >
                  <IconX className="w-6 h-6 text-foreground/70 antialiased" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, scale: 0.8, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: -90, scale: 0.8, opacity: 0 }}
                  transition={{
                    type: "spring",
                    duration: 0.3,
                  }}
                  className="block"
                >
                  <IconMenu2 className="w-6 h-6 text-foreground/70 antialiased" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <motion.div
            initial={false}
            style={{
              transformOrigin:
                mobileRevealDirection === "down" ? "top" : "bottom",
            }}
            animate={{
              height: isMobileMenuOpen ? mobileMenuHeight : 0,
              opacity: isMobileMenuOpen ? 1 : 0,
              y: isMobileMenuOpen
                ? 0
                : mobileRevealDirection === "down"
                  ? -6
                  : 6,
            }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className={`overflow-hidden ${isMobileMenuOpen && "mt-2"}`}
          >
            <div ref={mobileMenuContentRef} className="flex flex-col gap-1">
              {navigations.map((nav, index) => {
                const Icon = nav.icon;
                const staggerIndex =
                  mobileRevealDirection === "down"
                    ? index
                    : navigations.length - 1 - index;

                return (
                  <motion.button
                    key={nav.name}
                    type="button"
                    onClick={() => handleNavAction(nav.action)}
                    title={nav.title}
                    aria-label={nav.name}
                    initial={false}
                    animate={{
                      opacity: isMobileMenuOpen ? 1 : 0,
                      y: isMobileMenuOpen
                        ? 0
                        : mobileRevealDirection === "down"
                          ? 6
                          : 6,
                    }}
                    transition={{
                      delay: isMobileMenuOpen ? staggerIndex * 0.04 : 0,
                      duration: 0.18,
                    }}
                    className={`rounded-full p-2 ${pathname === `/${nav.name.toLowerCase()}` ? "bg-background/80 border-foreground/40" : "bg-transparent border-background/20 hover:border-background/35"} cursor-pointer drop-shadow-2xl shadow-2xl ${isMobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
                  >
                    <Icon className="w-6 h-6 text-foreground/60 antialiased" />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </motion.nav>
    </div>
  );
}
