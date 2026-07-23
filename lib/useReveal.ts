"use client";

import { useEffect, useRef } from "react";

/** Ports the design's scroll-reveal: staggers the reveal of each `.stagger` group's direct children. */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const groups = Array.from(root.querySelectorAll<HTMLElement>(".stagger"));

    if (!("IntersectionObserver" in window)) {
      groups.forEach((g) => Array.from(g.children).forEach((c) => c.classList.add("vis")));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const children = Array.from(entry.target.children);
          children.forEach((c, i) => setTimeout(() => c.classList.add("vis"), i * 80));
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    );
    groups.forEach((g) => io.observe(g));

    const fallback = setTimeout(() => {
      groups.forEach((g) => Array.from(g.children).forEach((c) => c.classList.add("vis")));
    }, 2500);

    return () => {
      io.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return ref;
}
