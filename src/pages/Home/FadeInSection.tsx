import React, { useEffect, useRef, useState } from "react";
import "./fadeinsection.css"
interface FadeInSectionProps {
  children: React.ReactNode;
  className?: string;
}

const FadeInSection: React.FC<FadeInSectionProps> = ({ children, className = "" }) => {
  const domRef = useRef<HTMLDivElement | null>(null); 
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === domRef.current) {
          setVisible(entry.isIntersecting);
        }
      });
    });

    const current = domRef.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return (
    <div
      className={`${className} fade-in ${isVisible ? "visible" : ""}`}
      ref={domRef}
    >
      {children}
    </div>
  );
};

export default FadeInSection;