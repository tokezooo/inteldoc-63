import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import LottieAnimation from "./LottieAnimation";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [lottieData, setLottieData] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile on mount and when window resizes
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    fetch("/loop-header.lottie")
      .then((response) => response.json())
      .then((data) => setLottieData(data))
      .catch((error) =>
        console.error("Error loading Lottie animation:", error)
      );
  }, []);

  useEffect(() => {
    // Skip effect on mobile
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !imageRef.current) return;

      const { left, top, width, height } =
        containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;

      imageRef.current.style.transform = `perspective(1000px) rotateY(${
        x * 2.5
      }deg) rotateX(${-y * 2.5}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = () => {
      if (!imageRef.current) return;
      imageRef.current.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)`;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [isMobile]);

  useEffect(() => {
    // Skip parallax on mobile
    if (isMobile) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const elements = document.querySelectorAll(".parallax");
          elements.forEach((el) => {
            const element = el as HTMLElement;
            const speed = parseFloat(element.dataset.speed || "0.1");
            const yPos = -scrollY * speed;
            element.style.transform = `translateY(${yPos}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  return (
    <section
      className="overflow-hidden z-9999 relative tech-gradient-bg"
      id="hero"
      style={{
        padding: isMobile ? "100px 12px 40px" : "120px 20px 60px",
      }}
    >
      <div className="absolute -top-[10%] -right-[5%] w-1/2 h-[70%] bg-blue-tech/20 blur-3xl rounded-full"></div>

      <div className="container px-4 sm:px-6 lg:px-8" ref={containerRef}>
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-center">
          <div className="w-full lg:w-1/2">
            <h1
              className="section-title text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight opacity-0 animate-fade-in font-inter"
              style={{ animationDelay: "0.3s" }}
            >
              Умные
              <br />
              Технологии
              <br />
              Заботы
            </h1>

            <p
              style={{ animationDelay: "0.5s" }}
              className="section-subtitle mt-3 sm:mt-6 mb-4 sm:mb-8 leading-relaxed opacity-0 animate-fade-in text-gray-950 font-normal text-base sm:text-lg text-left font-inter"
            >
              Мы создали приложение, забирающее все заботы о диабете!
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in"
              style={{ animationDelay: "0.7s" }}
            >
              <a
                href="#get-access"
                className="flex items-center justify-center group w-full sm:w-auto text-center tech-button font-inter text-white font-medium py-4 px-6 rounded-full border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105"
              >
                Связаться с Нами!
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          <div className="w-full lg:w-1/2 relative mt-6 lg:mt-0 flex justify-center md:justify-end lg:justify-end overflow-visible">
            {lottieData ? (
              <div
                className="relative z-10 animate-fade-in"
                style={{ animationDelay: "0.9s" }}
              >
                <LottieAnimation
                  animationPath={lottieData}
                  className="w-full h-auto max-w-lg mx-auto"
                  loop={true}
                  autoplay={true}
                />
              </div>
            ) : (
              <div
                className="relative transition-all duration-500 ease-out md:ml-[50%] lg:ml-0"
                style={{
                  transform: isMobile
                    ? "scale(1.8) translateY(10px)"
                    : window.innerWidth >= 768 && window.innerWidth < 1024
                    ? "scale(2.4) translateX(5%) translateY(-5%)"
                    : "scale(2)",
                  transformOrigin: isMobile ? "center center" : "right center",
                }}
              >
                <img
                  ref={imageRef}
                  src="/lovable-uploads/21061e37-0ba8-4eeb-a705-9cb5f5ec63a5.png"
                  alt="Мобильное приложение для диабетиков"
                  className="w-full h-auto object-contain transition-transform duration-500 ease-out max-w-md"
                  style={{
                    transformStyle: "preserve-3d",
                    marginRight: isMobile ? "0%" : "-10%",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className="hidden lg:block absolute bottom-0 left-1/4 w-64 h-64 bg-pulse-100/30 rounded-full blur-3xl -z-10 parallax"
        data-speed="0.05"
      ></div>
    </section>
  );
};

export default Hero;
