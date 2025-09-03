import React, { useEffect, useRef, useState } from "react";

const HumanoidSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"down" | "up">("down");
  const ticking = useRef(false);
  const lastScrollY = useRef(0);

  // Card visibility state - can appear and disappear based on scroll direction
  const [cardsVisible, setCardsVisible] = useState({
    first: false,
    second: false,
    third: false,
  });

  // More responsive timing function with shorter duration
  const cardStyle = {
    height: "calc(80vh - 120px)",
    maxHeight: "800px",
    borderRadius: "20px",
    transition:
      "transform 0.5s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.5s cubic-bezier(0.19, 1, 0.22, 1)",
    willChange: "transform, opacity",
  };

  useEffect(() => {
    // Create intersection observer to detect when section is in view
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Optimized scroll handler using requestAnimationFrame
    const handleScroll = () => {
      if (!ticking.current) {
        const currentScrollY = window.scrollY;
        const direction = currentScrollY > lastScrollY.current ? "down" : "up";
        setScrollDirection(direction);
        lastScrollY.current = currentScrollY;

        window.requestAnimationFrame(() => {
          if (!sectionRef.current) return;
          const sectionRect = sectionRef.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const totalScrollDistance = viewportHeight * 1.5;

          // Calculate the scroll progress only when section is visible
          let progress = 0;
          if (sectionRect.top <= 0 && sectionRect.bottom > 0) {
            progress = Math.min(
              1,
              Math.max(0, Math.abs(sectionRect.top) / totalScrollDistance)
            );
          } else if (sectionRect.bottom <= 0) {
            // Section has passed
            progress = 1;
          }

          // Determine which card should be visible based on progress
          if (progress >= 0.6) {
            setActiveCardIndex(2);
          } else if (progress >= 0.35) {
            setActiveCardIndex(1);
          } else if (progress >= 0.05) {
            setActiveCardIndex(0);
          } else {
            setActiveCardIndex(-1); // No cards visible initially
          }
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Update card visibility based on scroll direction and active card
  useEffect(() => {
    if (!isIntersecting) return;

    if (scrollDirection === "down") {
      // При скролле вниз показываем карточки в порядке 1->2->3
      if (activeCardIndex >= 0) {
        setCardsVisible((prev) => ({ ...prev, first: true }));
      }
      if (activeCardIndex >= 1) {
        setCardsVisible((prev) => ({ ...prev, second: true }));
      }
      if (activeCardIndex >= 2) {
        setCardsVisible((prev) => ({ ...prev, third: true }));
      }
    } else {
      // При скролле вверх скрываем карточки в порядке 3->2->1
      if (activeCardIndex < 2) {
        setCardsVisible((prev) => ({ ...prev, third: false }));
      }
      if (activeCardIndex < 1) {
        setCardsVisible((prev) => ({ ...prev, second: false }));
      }
      if (activeCardIndex < 0) {
        setCardsVisible((prev) => ({ ...prev, first: false }));
      }
    }
  }, [isIntersecting, activeCardIndex, scrollDirection]);

  return (
    <div
      ref={sectionRef}
      className="relative z-0"
      style={{
        height: "250vh",
      }}
    >
      <section
        className="w-full min-h-screen py-4 pt-20 md:pt-24 pb-3 mb-4 md:mb-24 sticky top-0 overflow-visible"
        id="why-humanoid"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, transparent 0%, transparent 60%, white 100%), url('/abstract-blue-background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          className="h-[150px] absolute -top-[83px] left-0 w-full"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 55%, transparent 100%)",
          }}
        />
        <div className="container px-6 lg:px-8 mx-auto h-full flex flex-col">
          <div className="mb-8 md:mb-12 mt-4">
            <h2 className="section-title text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4">
              Почему ИнтелДок?
            </h2>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-light text-gray-600 mb-6 md:mb-8 opacity-0 animate-on-scroll">
              Свобода. Жизнь. Забота.
            </h3>
          </div>

          <div
            ref={cardsContainerRef}
            className="relative flex-1 perspective-1000"
          >
            {/* First Card */}
            <div
              className={`absolute inset-0 overflow-hidden shadow-xl ${
                cardsVisible.first ? "animate-card-enter" : ""
              }`}
              style={{
                ...cardStyle,
                zIndex: 10,
                transform: `translateY(${
                  cardsVisible.first ? "10px" : "200px"
                }) scale(0.9)`,
                opacity: cardsVisible.first ? 1 : 0,
              }}
            >
              <div
                className="absolute inset-0 z-0 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300"
                style={{
                  backgroundImage: "url('/background-section1.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "top center",
                }}
              ></div>

              <div className="relative z-10 p-5 sm:p-6 md:p-8 h-full flex items-start pt-8 sm:pt-10 md:pt-12 md:flex-col lg:flex-row">
                <div className="flex-1 max-w-lg">
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-display text-white font-bold leading-tight mb-2 mt-8">
                    Свобода вместо контроля.
                  </h3>
                  <p className="text-white/80 text-xl sm:text-2xl mt-8">
                    Больше никаких сложных расчетов и постоянного напряжения. ИИ
                    делает все за тебя.
                  </p>
                </div>

                <div className="absolute right-0 bottom-0 h-[50%] w-auto overflow-visible md:absolute md:right-0 md:bottom-0 md:h-[60%] md:w-auto lg:absolute lg:-right-4 lg:top-0 lg:h-[120%] lg:w-auto">
                  <img
                    src="/lovable-uploads/cc0bdcff-bcc3-415d-bebc-f6b4b99dd5b0.png"
                    alt="Screen Profile"
                    className="h-full w-auto object-cover opacity-100"
                  />
                </div>
              </div>
            </div>

            {/* Second Card */}
            <div
              className={`absolute inset-0 overflow-hidden shadow-xl ${
                cardsVisible.second ? "animate-card-enter" : ""
              }`}
              style={{
                ...cardStyle,
                zIndex: 20,
                transform: `translateY(${
                  cardsVisible.second ? "-20px" : "200px"
                }) scale(0.95)`,
                opacity: cardsVisible.second ? 1 : 0,
                pointerEvents: cardsVisible.second ? "auto" : "none",
              }}
            >
              <div
                className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-transparent to-white"
                style={{
                  backgroundImage: "url('/background-section1.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "top center",
                }}
              ></div>

              <div className="absolute right-0 bottom-0 h-[50%] w-auto overflow-hidden md:bottom-0 md:top-auto md:h-[60%] lg:h-[120%] lg:top-0 lg:bottom-auto">
                <img
                  src="/lovable-uploads/b9602702-e895-4c68-97f8-4773dfa36d3c.png"
                  alt="Жизнь без компромиссов"
                  className="h-full w-auto object-cover opacity-100"
                />
              </div>

              <div className="relative z-10 p-5 sm:p-6 md:p-8 h-full flex items-start pt-8 sm:pt-10 md:pt-12">
                <div className="max-w-lg">
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-display text-white font-bold leading-tight mb-2 mt-8">
                    Жизнь без компромиссов.
                  </h3>
                  <p className="text-white/80 text-xl sm:text-2xl mt-8">
                    Ешьте, пейте, занимайтесь спортом по своим правилам.
                    ИнтелДок легко и удобно собирает данные.
                  </p>
                </div>
              </div>
            </div>

            {/* Third Card */}
            <div
              className={`absolute inset-0 overflow-hidden shadow-xl ${
                cardsVisible.third ? "animate-card-enter" : ""
              }`}
              style={{
                ...cardStyle,
                zIndex: 30,
                transform: `translateY(${
                  cardsVisible.third ? "-50px" : "200px"
                }) scale(1)`,
                opacity: cardsVisible.third ? 1 : 0,
                pointerEvents: cardsVisible.third ? "auto" : "none",
              }}
            >
              <div
                className="absolute inset-0 z-0"
                style={{
                  background: "linear-gradient(to right, #d1d5db, #4a90e2)",
                  backgroundImage: "url('/background-section1.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "top center",
                  backgroundBlendMode: "multiply",
                  transform: "scaleX(-1)",
                }}
              ></div>

              {/* Mobile image */}
              <div className="absolute left-0 bottom-0 h-[60%] w-full overflow-hidden z-5 block md:hidden">
                <img
                  src="/lovable-uploads/61587c1a-1ad3-4936-bf88-b11f1d885588.png"
                  alt="Невидимая забота"
                  className="h-full w-full object-cover object-bottom opacity-100"
                />
              </div>

              {/* Desktop/Tablet image */}
              <div className="absolute left-0 top-0 h-full w-auto overflow-hidden z-5 hidden md:block">
                <img
                  src="/lovable-uploads/4fb3b5ec-a989-4bcf-90f2-94ce060de509.png"
                  alt="Невидимая забота"
                  className="h-full w-auto object-cover opacity-100"
                />
              </div>

              <div className="relative z-10 p-5 sm:p-6 md:p-8 h-full flex items-start justify-end pt-8 sm:pt-10 md:pt-12">
                <div className="max-w-lg text-right">
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-display text-white font-bold leading-tight mb-2 mt-8">
                    Невидимая забота.
                  </h3>
                  <p className="text-white/80 text-xl sm:text-2xl mt-8">
                    Приложение работает незаметно и точно.
                    <br />
                    Ты живешь, оно думает.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mascot behind cards */}
          <div className="absolute inset-0 z-0 flex items-center justify-start">
            <img
              src="/lovable-uploads/84596591-6e70-4ef3-b0e1-15e7fd6da3f9.png"
              alt="ИнтелДок маскот"
              className="w-full h-full object-contain md:w-3/4 md:h-3/4 lg:w-full lg:h-full"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HumanoidSection;
