//! React Core
import { useState, useEffect, useRef } from "react";

//! GSAP
import { gsap } from "gsap";

//! Styles
import styles from "./styles.module.css"

export default function Cursor() {

  const cursorRef = useRef<SVGSVGElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, });

  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      return ((window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches));
    };

    setIsMobileDevice(checkIfMobile());

    const handleResize = () => {
      setIsMobileDevice(checkIfMobile());
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (isMobileDevice) return;
    const cursor = cursorRef.current as SVGSVGElement;

    if (!cursor) return;

    const updateCursorPosition = () => {
      gsap.set(cursor, {
        x: mouseRef.current.x,
        y: mouseRef.current.y,
      });

      requestAnimationFrame(updateCursorPosition);
    }

    requestAnimationFrame(updateCursorPosition);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const isInteractive = target.closest("a") || target.closest("link") ||
        target.closest(".button") || target.closest(".work-card") || target.closest(".project-card");

      if (cursor) {
        cursor.style.display = isInteractive ? 'none' : 'inherit';
      }
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
    }
  }, [isMobileDevice])

  return (
    <svg
      ref={cursorRef}
      id="cursor"
      className={styles.cursor}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="var(--primary)"
        stroke="var(--primary)"
        strokeWidth={1}
        d="M1.464 2.825c.995 5.4 2.578 10.843 3.997 15.788a1.003 1.003 0 0 0 1.752.343l4.102-5.22a1 1 0 0 1 .47-.33l5.302-1.768a.996.996 0 0 0 .245-1.77C12.854 6.843 8.16 3.822 3.538 1.322a1.41 1.41 0 0 0-2.074 1.502Z"
      />
    </svg >
  );
};