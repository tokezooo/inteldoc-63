import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}
const FeatureCard = ({
  icon,
  title,
  description,
  index
}: FeatureCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);
  return <div ref={cardRef} className={cn("feature-card glass-card opacity-0 p-4 sm:p-6", "lg:hover:bg-gradient-to-br lg:hover:from-white lg:hover:to-pulse-50", "transition-all duration-300")} style={{
    animationDelay: `${0.1 * index}s`
  }}>
      <div className="rounded-full bg-pulse-50 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-pulse-500 mb-4 sm:mb-5">
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{title}</h3>
      <p className="text-gray-600 text-sm sm:text-base">{description}</p>
    </div>;
};
const Features = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const elements = entry.target.querySelectorAll(".fade-in-element");
          elements.forEach((el, index) => {
            setTimeout(() => {
              el.classList.add("animate-fade-in");
            }, index * 100);
          });
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  const features = [{
    icon: "⚡",
    title: "Fast Performance",
    description: "Lightning-fast processing and response times for optimal efficiency."
  }, {
    icon: "🔒",
    title: "Secure",
    description: "Enterprise-grade security with end-to-end encryption."
  }, {
    icon: "📱",
    title: "Mobile Ready",
    description: "Fully responsive design that works on all devices."
  }];
  return <section ref={sectionRef} className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 fade-in-element opacity-0">Тут что то надо написать как будто</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} index={index} />)}
        </div>
      </div>
    </section>;
};
export default Features;