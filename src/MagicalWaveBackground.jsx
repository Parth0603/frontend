import React, { useEffect, useRef } from "react";

/**
 * MagicalWaveBackground
 * - Shows a background image (light/dark) and reveals it with cursor glow + click ripples.
 * - Designed to fill its parent (absolute inset-0). Works best when parent is position: relative.
 *
 * Props:
 *  - isDark: boolean (required) -> selects imageDark vs imageLight
 *  - imageDark: string (required) -> URL/path for dark theme hero image
 *  - imageLight: string (required) -> URL/path for light theme hero image
 *  - overlayAlpha: number [0..1] (optional) -> darkness of the mask, default 0.85
 */
const MagicalWaveBackground = ({
  isDark,
  imageDark,
  imageLight,
  overlayAlpha = 0.85,
}) => {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;
    const ctx = canvas.getContext("2d");

    let width = 0;
    let height = 0;
    let rect = canvas.getBoundingClientRect();
    let rafId = null;
    const ripples = [];
    const mouse = { x: 0, y: 0, hasMoved: false };
    let time = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const sizeToParent = () => {
      const r = wrapper.getBoundingClientRect();
      width = Math.max(1, Math.floor(r.width));
      height = Math.max(1, Math.floor(r.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      rect = canvas.getBoundingClientRect();
    };

    // Initial sizing
    sizeToParent();

    // Resize handling (window + ResizeObserver for parent)
    const ro = new (window.ResizeObserver || function () {})((entries) => {
      if (!Array.isArray(entries) || !entries.length) return;
      sizeToParent();
    });
    ro.observe(wrapper);

    const onResize = () => sizeToParent();
    window.addEventListener("resize", onResize);

    const onScroll = () => {
      // keep rect updated if the page scrolls
      rect = canvas.getBoundingClientRect();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const onMouseMove = (e) => {
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.hasMoved = true;
    };

    const onClick = (e) => {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ripples.push({ x, y, radius: 0, alpha: 1 });
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onClick);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Dark overlay
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(0,0,0," + overlayAlpha + ")";
      ctx.fillRect(0, 0, width, height);

      // Reveal with destination-out
      ctx.globalCompositeOperation = "destination-out";

      // Cursor glow waves (when cursor has moved at least once)
      if (mouse.hasMoved) {
        for (let i = 0; i < 3; i++) {
          const radius = 120 + Math.sin(time * 0.05 + i) * 40 + i * 30;
          const inner = radius * 0.3;

          const gradient = ctx.createRadialGradient(
            mouse.x,
            mouse.y,
            inner,
            mouse.x,
            mouse.y,
            radius
          );
          gradient.addColorStop(0, "rgba(255,255,255,0.5)");
          gradient.addColorStop(1, "rgba(0,0,0,0)");

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Click ripples (update via map/filter to avoid splice issues)
      for (let i = 0; i < ripples.length; i++) {
        const r = ripples[i];
        r.radius += 4; // speed
        r.alpha -= 0.01; // fade
      }

      // Draw after updating
      for (let i = 0; i < ripples.length; i++) {
        const r = ripples[i];
        const inner = r.radius * 0.2;

        const gradient = ctx.createRadialGradient(
          r.x,
          r.y,
          inner,
          r.x,
          r.y,
          r.radius
        );
        // Note: no template string to avoid ${} issues
        gradient.addColorStop(0, "rgba(255,255,255," + r.alpha + ")");
        gradient.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Remove faded ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        if (ripples[i].alpha <= 0) ripples.splice(i, 1);
      }

      ctx.globalCompositeOperation = "source-over";

      time += 1;
      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
      if (ro && ro.disconnect) ro.disconnect();
    };
  }, [overlayAlpha]);

  const bgUrl = isDark ? imageDark : imageLight;

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none", // do not block UI
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      {/* Background image (revealed by canvas masking) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: url('${bgUrl}'),
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "saturate(1.05)",
        }}
      />
      {/* Canvas effect */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, display: "block" }}
      />
    </div>
  );
};

export default MagicalWaveBackground;
