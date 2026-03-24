"use client";

import { useRef } from "react";

export default function DragContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {typeof children === "function" ? children(ref) : children}
    </div>
  );
}
