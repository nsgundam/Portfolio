import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const depthReveal = (el: Element, delay = 0) =>
  gsap.fromTo(el,
    { opacity: 0, scale: 0.88, y: 40, filter: "blur(6px)" },
    { opacity: 1, scale: 1, y: 0, filter: "blur(0px)",
      duration: 1.1, ease: "power4.out", delay }
  );

export { gsap, ScrollTrigger, depthReveal };