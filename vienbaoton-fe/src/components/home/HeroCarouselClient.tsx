"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface HeroCarouselClientProps {
  slideCount: number;
}

export default function HeroCarouselClient({ slideCount }: HeroCarouselClientProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const showSlide = useCallback(
    (index: number) => {
      const slides = document.querySelectorAll(".hero-slide");
      const indicators = document.querySelectorAll(".indicator");

      slides.forEach((slide, i) => {
        slide.classList.remove("active");
        if (indicators[i]) indicators[i].classList.remove("active");
      });

      if (slides[index]) slides[index].classList.add("active");
      if (indicators[index]) indicators[index].classList.add("active");
      setCurrentSlide(index);
    },
    []
  );

  const nextSlide = useCallback(() => {
    const next = (currentSlide + 1) % slideCount;
    showSlide(next);
  }, [currentSlide, slideCount, showSlide]);

  const prevSlide = useCallback(() => {
    const prev = (currentSlide - 1 + slideCount) % slideCount;
    showSlide(prev);
  }, [currentSlide, slideCount, showSlide]);

  const resetInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(nextSlide, 7000);
  }, [nextSlide]);

  useEffect(() => {
    intervalRef.current = setInterval(nextSlide, 7000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [nextSlide]);

  const handleIndicatorClick = (index: number) => {
    showSlide(index);
    resetInterval();
  };

  return (
    <>
      <div className="carousel-controls">
        <button
          className="carousel-prev"
          aria-label="Previous"
          onClick={() => {
            prevSlide();
            resetInterval();
          }}
        >
          &larr;
        </button>
        <button
          className="carousel-next"
          aria-label="Next"
          onClick={() => {
            nextSlide();
            resetInterval();
          }}
        >
          &rarr;
        </button>
      </div>
      <div className="carousel-indicators">
        {Array.from({ length: slideCount }, (_, i) => (
          <span
            key={i}
            className={`indicator ${i === 0 ? "active" : ""}`}
            data-slide={i}
            onClick={() => handleIndicatorClick(i)}
          />
        ))}
      </div>
    </>
  );
}
