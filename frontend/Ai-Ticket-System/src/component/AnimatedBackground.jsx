import React, { useEffect, useRef } from "react";

const AnimatedBackground = () => {
  const canvasRef = useRef(null);
  const dotsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const dotCount = 50;
    const mouse = { x: null, y: null };

    const createDots = () => {
      dotsRef.current = Array.from({ length: dotCount }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        baseR: Math.random() * 3 + 6, // base radius
        r: 0, // animated radius
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        glow: 0, // for shine effect
      }));
      // Set initial radius
      dotsRef.current.forEach(dot => dot.r = dot.baseR);
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createDots();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    const drawStar = (ctx, x, y, radius, glow = 0, points = 5, inset = 0.5) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.beginPath();
      ctx.shadowColor = "white";
      ctx.shadowBlur = glow;
      ctx.moveTo(0, 0 - radius);
      for (let i = 0; i < points; i++) {
        ctx.rotate(Math.PI / points);
        ctx.lineTo(0, 0 - radius * inset);
        ctx.rotate(Math.PI / points);
        ctx.lineTo(0, 0 - radius);
      }
      ctx.closePath();
      ctx.fillStyle = "#fffacd"; // light yellowish-white
      ctx.fill();
      ctx.restore();
    };

    const draw = () => {
      // 🌅 Soft gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0.2, "#CFE4FA"); 
      gradient.addColorStop(0.3, "#FFD6C6"); 
      gradient.addColorStop(0.5, "#FDE2D0"); 
      gradient.addColorStop(0.8, "#CFE4FA"); 

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      dotsRef.current.forEach((dot) => {
        const distX = dot.x - mouse.x;
        const distY = dot.y - mouse.y;
        const distance = Math.sqrt(distX * distX + distY * distY);
        const inHoverRange = distance < 80;

        if (inHoverRange) {
          // Increase glow & size smoothly
          dot.glow = Math.min(dot.glow + 2, 50);
          dot.r += (dot.baseR * 1.4 - dot.r) * 0.1; // smooth enlarge
        } else {
          // Fade glow & return size smoothly
          dot.glow = Math.max(dot.glow - 1, 0);
          dot.r += (dot.baseR - dot.r) * 0.1;
        }

        drawStar(ctx, dot.x, dot.y, dot.r, dot.glow);

        dot.x += dot.dx;
        dot.y += dot.dy;

        if (dot.x < 0 || dot.x > width) dot.dx *= -1;
        if (dot.y < 0 || dot.y > height) dot.dy *= -1;
      });

      requestAnimationFrame(draw);
    };

    createDots();
    draw();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
};

export default AnimatedBackground;
