import { useEffect, useRef } from "react"
import { gsap } from "../../lib/gsap"

const RING_DURATION = 0.5
const RING_SIZE     = 32   

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot  = dotRef.current!
    const ring = ringRef.current!

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    let hoveredEl: HTMLElement | null = null
    let isLeavingButton = false
    let leaveTimeout: ReturnType<typeof setTimeout>

    // We set initial position to avoid jumping from top-left
    gsap.set(dot, { x: mouse.x, y: mouse.y })
    gsap.set(ring, { x: mouse.x, y: mouse.y })

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      
      // Dot: instant
      gsap.set(dot, { x: mouse.x, y: mouse.y })
      
      if (!hoveredEl && !isLeavingButton) {
        // Ring: lagged position follows mouse
        gsap.to(ring, {
          x: mouse.x,
          y: mouse.y,
          duration: RING_DURATION,
          ease: 'power4.inout', // softened ease for smoother follow
        })
      } else if (isLeavingButton) {
         // Keep following mouse when leaving, to prevent stopping mid-air
         gsap.to(ring, {
          x: mouse.x,
          y: mouse.y,
          duration: RING_DURATION,
          ease: 'power4.inout',
        })
      }
    }

    const render = () => {

      if (hoveredEl && !isLeavingButton) return
 
      const ringX = gsap.getProperty(ring, "x") as number || 0;
      const ringY = gsap.getProperty(ring, "y") as number || 0;
      
      const deltaX = mouse.x - ringX;
      const deltaY = mouse.y - ringY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

      const baseScale = 1;
      
      // Stretch calculation: scaleX increases with distance, scaleY decreases slightly to preserve volume
      const stretchX = baseScale + Math.min(distance * 0.015, 2);
      const stretchY = baseScale - Math.min(distance * 0.001 , baseScale * 5 );

      if (distance > 1) {
        gsap.set(ring, {
          rotation: angle,
          scaleX: stretchX,
          scaleY: stretchY
        });
      } else {
        // Return to normal baseScale when stopped
        gsap.set(ring, {
          scaleX: baseScale,
          scaleY: baseScale
        });
      }
    }
    
    gsap.ticker.add(render);

    const onEnter = (e: MouseEvent) => { 
      hoveredEl = e.currentTarget as HTMLElement 
      isLeavingButton = false;
      clearTimeout(leaveTimeout);

      const rect = hoveredEl.getBoundingClientRect();
      const padding = 16; 

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const computedStyle = window.getComputedStyle(hoveredEl);
      let targetRadius = computedStyle.borderRadius;
      if (targetRadius === "0px") targetRadius = "8px"; // default if none

      // Wrap the element
      gsap.to(ring, {
        x: centerX,
        y: centerY,
        width: rect.width + padding,
        height: rect.height + padding,
        borderRadius: targetRadius,
        scaleX: 1, 
        scaleY: 1,
        rotation: 0,
        duration: 0.3,
        ease: 'power1.out',
        overwrite: 'auto',
      });
    }
    
    const onLeave = () => { 
      hoveredEl = null 
      isLeavingButton = true;
      clearTimeout(leaveTimeout);
      leaveTimeout = setTimeout(() => {
        isLeavingButton = false;
      }, 300);
      
      // Restore ring to circle
      gsap.to(ring, {
        width: RING_SIZE,
        height: RING_SIZE,
        borderRadius: "9999px",
        scaleX: 1,
        scaleY: 1,
        duration: 0.3,
        ease: 'power3.out',
      });
      
      // Resume following mouse smoothly
      gsap.to(ring, {
        x: mouse.x,
        y: mouse.y,
        duration: RING_DURATION,
        ease: 'power3.out',
      });
    }

    document.addEventListener('mousemove', onMove)
    const interactives = document.querySelectorAll('a, button')
    interactives.forEach(el => {
      el.addEventListener('mouseenter', onEnter as EventListener)
      el.addEventListener('mouseleave', onLeave as EventListener)
    })

    return () => {
      gsap.ticker.remove(render)
      clearTimeout(leaveTimeout)
      document.removeEventListener('mousemove', onMove)
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', onEnter as EventListener)
        el.removeEventListener('mouseleave', onLeave as EventListener)
      })
    }
  }, [])

  return (
    <>
      {/* Dot — center */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-9999 -translate-x-1/2 -translate-y-1/2 size-[6px] rounded-full bg-white"
        style={{ mixBlendMode: 'difference' }}
      />

      {/* Ring — trailing */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-9998 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        style={{
          width:  `${RING_SIZE}px`,
          height: `${RING_SIZE}px`,
          mixBlendMode: 'difference',
        }}
      />
    </>
  )
}