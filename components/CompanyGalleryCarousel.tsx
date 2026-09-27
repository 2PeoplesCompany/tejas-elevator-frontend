"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Camera } from "lucide-react";

interface GallerySlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  tag: string;
}

const GALLERY_SLIDES: GallerySlide[] = [
  {
    id: 1,
    image: "/images/company-team.jpg",
    title: "Engineering & Technical Operations Team",
    subtitle: "Our qualified elevator specialists, design engineers, and field coordinators ensuring precision on every project.",
    tag: "Leadership & Team",
  },
  {
    id: 2,
    image: "/images/about-engineering.jpg",
    title: "Component Workshop & Fabrication Rigor",
    subtitle: "Pre-assembly inspection and testing of high-tensile guide rails, car frames, and counterweight assemblies.",
    tag: "Workshop & Assembly",
  },
  {
    id: 3,
    image: "/images/controller-engineering.jpg",
    title: "Microprocessor & V3F Control Panel Calibration",
    subtitle: "Diagnostics and programming of energy-saving variable frequency drives and automatic rescue systems.",
    tag: "Control Systems",
  },
  {
    id: 4,
    image: "/images/installation-site.jpg",
    title: "On-Site Shaft Framing & Laser Alignment",
    subtitle: "Turnkey mechanical erection with sub-millimeter laser guide rail alignment for whisper-quiet travel.",
    tag: "Site Installation",
  },
  {
    id: 5,
    image: "/images/company-elevator.jpg",
    title: "Completed Project Handover & Commissioning",
    subtitle: "Fully certified passenger elevator installed in a premium commercial facility, operating at peak efficiency.",
    tag: "Completed Projects",
  },
  {
    id: 6,
    image: "/images/technician-service.jpg",
    title: "Dedicated Field Support & Maintenance Rigor",
    subtitle: "Certified technicians performing scheduled preventive maintenance and round-the-clock emergency support.",
    tag: "Service & AMC",
  },
];

export default function CompanyGalleryCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((prev) => (prev === 0 ? GALLERY_SLIDES.length - 1 : prev - 1));
  };

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev === GALLERY_SLIDES.length - 1 ? 0 : prev + 1));
  }, []);

  // Continuous auto-sliding every 4.5 seconds + manual controls
  useEffect(() => {
    const timer = setInterval(() => {
      next();
    }, 4500);
    return () => clearInterval(timer);
  }, [next]);

  const current = GALLERY_SLIDES[currentIndex];

  return (
    <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
      {/* Main Image Container */}
      <div className="relative h-[340px] sm:h-[440px] md:h-[500px] w-full overflow-hidden">
        {GALLERY_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={idx === 0}
              className="object-cover object-center"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
          </div>
        ))}

        {/* Top Badges */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-navy/90 text-white text-xs font-mono tracking-wider font-semibold backdrop-blur-sm border border-brand-navy/50">
            <Camera className="w-3.5 h-3.5" />
            <span>{current.tag}</span>
          </span>
          <span className="px-2.5 py-1 rounded-full bg-black/60 text-gray-300 text-xs font-mono backdrop-blur-sm border border-white/10">
            {String(currentIndex + 1).padStart(2, "0")} / {String(GALLERY_SLIDES.length).padStart(2, "0")}
          </span>
        </div>

        {/* Bottom Content / Caption */}
        <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 z-20">
          <div className="max-w-3xl space-y-2">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
              {current.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 sm:line-clamp-none max-w-2xl drop-shadow">
              {current.subtitle}
            </p>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prev}
          aria-label="Previous gallery photo"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-brand-navy text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm border border-white/20 hover:scale-105"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={next}
          aria-label="Next gallery photo"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-brand-navy text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm border border-white/20 hover:scale-105"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Dots Indicator Bar */}
      <div className="bg-black/90 px-6 py-4 flex items-center justify-between border-t border-white/10">
        <div className="flex items-center gap-2">
          {GALLERY_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Jump to photo ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "w-8 bg-brand-steel"
                  : "w-2 bg-gray-600 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
        <div className="text-xs font-mono text-gray-400">
          Auto-sliding • Click arrows or dots to explore
        </div>
      </div>
    </div>
  );
}
