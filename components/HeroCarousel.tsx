"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { getMediaUrl } from "@/lib/media";

interface SlideData {
  id: number;
  tag: string;
  headline: string;
  highlight: string;
  subtext: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  secondaryLink: string;
  secondaryText: string;
  badge: string;
}

const SLIDES: SlideData[] = [
  {
    id: 1,
    tag: "Certified Passenger Systems",
    headline: "Elevating Every Floor.",
    highlight: "Moving You Safely.",
    subtext:
      "High-performance gearless PMSM passenger elevators engineered for smooth, whisper-quiet travel in residential towers and corporate complexes.",
    image: getMediaUrl("/images/carousel-hero-1.jpg"),
    ctaText: "Explore Passenger Elevators",
    ctaLink: "/products/passenger-elevators",
    secondaryText: "Request Consultation",
    secondaryLink: "/contact",
    badge: "ISO 9001:2015 Certified",
  },
  {
    id: 2,
    tag: "Luxury Residential Mobility",
    headline: "Bespoke Villa Lifts.",
    highlight: "Vertical Elegance.",
    subtext:
      "Custom-crafted panoramic glass and hydraulic home elevators designed for modern duplexes and luxury villas with minimal pit depth.",
    image: getMediaUrl("/images/carousel-hero-2.jpg"),
    ctaText: "Explore Home & Villa Lifts",
    ctaLink: "/products/home-villa-lifts",
    secondaryText: "View Villa Specs",
    secondaryLink: "/applications",
    badge: "Shallow 200 mm Pit Fit",
  },
  {
    id: 3,
    tag: "High-Traffic Commercial Flow",
    headline: "Intelligent Dispatch.",
    highlight: "Maximum Throughput.",
    subtext:
      "Rapid-cycling corporate and retail vertical transit featuring energy-saving microprocessor controllers and luxury architectural finishes.",
    image: getMediaUrl("/images/carousel-hero-3.jpg"),
    ctaText: "Commercial Solutions",
    ctaLink: "/applications",
    secondaryText: "Modernize Old Lifts",
    secondaryLink: "/services",
    badge: "Up to 40% Energy Savings",
  },
  {
    id: 4,
    tag: "Heavy-Duty Freight Logistics",
    headline: "Industrial Freight Lifts.",
    highlight: "Unyielding Endurance.",
    subtext:
      "Heavy-load vertical handling capacity up to 5000+ kg, engineered with reinforced I-beam slings and anti-skid chequered steel flooring.",
    image: getMediaUrl("/images/carousel-hero-4.jpg"),
    ctaText: "Explore Goods Lifts",
    ctaLink: "/products/industrial-goods-lifts",
    secondaryText: "Request Load Study",
    secondaryLink: "/contact",
    badge: "5000+ kg Capacity",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState<number>(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  // Automatic slide rotation every 5 seconds (continuous + manual)
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const slide = SLIDES[current];

  return (
    <section className="relative bg-[#000000] text-white overflow-hidden min-h-[620px] lg:min-h-[700px] flex items-center select-none">
      {/* Background Image Carousel Transitions */}
      {SLIDES.map((s, idx) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === current ? "opacity-100 z-0" : "opacity-0 pointer-events-none -z-10"
          }`}
        >
          <Image
            src={s.image}
            alt={s.headline}
            fill
            className="object-cover object-center scale-105 transition-transform duration-10000 ease-out"
            priority={idx === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        </div>
      ))}

      {/* Slide Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-20 w-full z-10">
        <div className="max-w-3xl space-y-6">
          {/* Badge & Category Pill */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gray-700 bg-gray-900/90 text-xs font-mono tracking-wider uppercase text-gray-300 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-brand-navy animate-pulse"></span>
              {slide.tag}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs text-brand-steel font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-steel" />
              {slide.badge}
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
            {slide.headline}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-steel via-gray-200 to-white block sm:inline">
              {slide.highlight}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-100 max-w-2xl leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {slide.subtext}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href={slide.ctaLink}
              className="px-7 py-3.5 bg-brand-navy hover:bg-brand-navy-dark text-white rounded text-sm font-semibold flex items-center gap-2 shadow-lg hover:shadow-brand-navy/30 transition-all duration-200"
            >
              <span>{slide.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href={slide.secondaryLink}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded text-sm font-semibold backdrop-blur-sm border border-white/20 transition-all duration-200"
            >
              {slide.secondaryText}
            </Link>
          </div>
        </div>
      </div>

      {/* Manual Controls & Indicator Dots */}
      <div className="absolute bottom-8 left-4 right-4 sm:left-8 sm:right-8 flex items-center justify-between max-w-7xl mx-auto z-20 pointer-events-auto">
        {/* Clickable Progress Dots */}
        <div className="flex items-center gap-2.5">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              aria-label={`Jump to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === current ? "w-8 bg-brand-steel" : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
          <span className="text-xs font-mono text-gray-400 ml-2">
            0{current + 1} / 0{SLIDES.length}
          </span>
        </div>

        {/* Manual Arrow Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="w-10 h-10 rounded-full bg-black/60 hover:bg-brand-navy border border-white/20 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="w-10 h-10 rounded-full bg-black/60 hover:bg-brand-navy border border-white/20 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
