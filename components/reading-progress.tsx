"use client";

import { useEffect, useRef } from "react";

/**
 * A 2px hairline at the top of the viewport that fills as you scroll
 * through an article. Writes the transform straight to the DOM node —
 * no per-frame React re-render. The only client-side JS on the site.
 */
export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const next =
        docHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / docHeight)) : 0;
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${next})`;
      }
      frame = 0;
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="reading-progress" aria-hidden="true">
      <div
        ref={barRef}
        className="reading-progress__bar"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
