//! React Core
import { useEffect } from "react";

//! GSAP
import { gsap } from "gsap";

//! Styles
import styles from "./styles.module.css"

export default function Cursor() {

  useEffect(() => {
    const cursor = document.querySelector("#cursor") as HTMLElement;
    const links = document.querySelectorAll("link");
    const a = document.querySelectorAll("a");
    const buttons = document.querySelectorAll(".button");
    const workCards = document.querySelectorAll(".work-card");
    const projectCards = document.querySelectorAll(".project-card");

    if (!cursor) return;

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      gsap.set(cursor, {
        x: clientX,
        y: clientY,
      });
    }

    document.addEventListener("mousemove", onMouseMove);

    const onMouseEnter = () => {
      cursor.style.display = "none";
    }

    const onMouseLeave = () => {
      cursor.style.display = "inherit";
    }

    links.forEach(link => {
      link.addEventListener("mouseenter", onMouseEnter);
      link.addEventListener("mouseleave", onMouseLeave);
    })

    a.forEach(a => {
      a.addEventListener("mouseenter", onMouseEnter);
      a.addEventListener("mouseleave", onMouseLeave);
    })

    buttons.forEach(button => {
      button.addEventListener("mouseenter", onMouseEnter);
      button.addEventListener("mouseleave", onMouseLeave);
    })

    workCards.forEach(workCard => {
      workCard.addEventListener("mouseenter", onMouseEnter);
      workCard.addEventListener("mouseleave", onMouseLeave);
    })

    projectCards.forEach(projectCard => {
      projectCard.addEventListener("mouseenter", onMouseEnter);
      projectCard.addEventListener("mouseleave", onMouseLeave);
    })
  })

  return (
    <svg
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