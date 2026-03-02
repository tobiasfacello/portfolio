//! React Core
import { useState, useEffect, useRef } from "react";

//! GSAP
import { Expo } from "gsap";
import { gsap, useGSAP } from "../../lib/gsap";

//! Styles
import styles from "./styles.module.css"

export default function Cursor() {

  const cursorRef = useRef<SVGSVGElement | null>(null);
  const mouseRef = useRef<{ x: gsap.QuickToFunc | null; y: gsap.QuickToFunc | null }>({ x: null, y: null });

  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(hover: none) and (pointer: coarse)');
    setIsMobileDevice(mql.matches);

    const onChange = (e: MediaQueryListEvent) => {
      setIsMobileDevice(e.matches);
    };

    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useGSAP(() => {
    if (isMobileDevice || !cursorRef.current) return;

    const cursor = cursorRef.current;

    gsap.set(cursor, { x: -100, y: -100 });

    mouseRef.current = {
      x: gsap.quickTo(cursor, "x", { duration: 0.1, ease: Expo.easeOut }),
      y: gsap.quickTo(cursor, "y", { duration: 0.1, ease: Expo.easeOut })
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x?.(e.clientX);
      mouseRef.current.y?.(e.clientY);
    };

    const onMouseLeave = () => {
      gsap.to(cursor, { autoAlpha: 0, duration: 0.15 });
    };

    const onMouseEnter = () => {
      gsap.to(cursor, { autoAlpha: 1, duration: 0.15 });
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, {
    dependencies: [isMobileDevice],
    revertOnUpdate: true,
  });

  if (isMobileDevice) {
    return null;
  }

  return (
    <svg
      ref={cursorRef}
      id="cursor"
      className={styles.cursor}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fill="var(--primary)"
        stroke="var(--primary)"
        strokeWidth={1}
        d="M1.464 2.825c.995 5.4 2.578 10.843 3.997 15.788a1.003 1.003 0 0 0 1.752.343l4.102-5.22a1 1 0 0 1 .47-.33l5.302-1.768a.996.996 0 0 0 .245-1.77C12.854 6.843 8.16 3.822 3.538 1.322a1.41 1.41 0 0 0-2.074 1.502Z"
      />
    </svg >
  );
}
