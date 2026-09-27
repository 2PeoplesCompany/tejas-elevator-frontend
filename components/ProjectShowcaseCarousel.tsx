"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, CheckCircle2 } from "lucide-react";

interface ProjectItem {
  id: number;
  title: string;
  category: string;
  image: string;
  location: string;
  details: string;
  link: string;
}

const PROJECTS: ProjectItem[] = [
  {
    id: 1,
    title: "Panoramic Glass Villa Elevator",
    category: "Residential Luxury",
    image: "/images/glass-atrium-elevator.jpg",
    location: "Executive Duplex Bungalow",
    details: "3-Stop custom hydraulic glass lift with frameless cabin, shallow pit depth, and whisper-quiet operation.",
    link: "/products/home-villa-lifts",
  },
  {
    id: 2,
    title: "Corporate High-Rise Passenger Core",
    category: "Commercial Office",
    image: "/images/carousel-hero-1.jpg",
    location: "IT Business Park",
    details: "Twin gearless PMSM passenger elevators featuring intelligent group dispatch and Hairline SS 304 finishes.",
    link: "/products/passenger-elevators",
  },
  {
    id: 3,
    title: "Dedicated Stretcher & Medical Elevator",
    category: "Healthcare Facility",
    image: "/images/hospital-elevator.jpg",
    location: "Multi-Specialty Care Hospital",
    details: "Extended 2400 mm depth cabin with ±2 mm micro-leveling and Code Blue emergency priority recall.",
    link: "/products/hospital-stretcher-lifts",
  },
  {
    id: 4,
    title: "Heavy-Duty 3000 kg Freight Handler",
    category: "Industrial & Logistics",
    image: "/images/carousel-hero-4.jpg",
    location: "Automobile Distribution Center",
    details: "Reinforced I-beam sling assembly with chequered steel flooring and motorized bi-parting landing doors.",
    link: "/products/industrial-goods-lifts",
  },
  {
    id: 5,
    title: "Modern Architectural Lobby Installation",
    category: "Commercial Towers",
    image: "/images/carousel-hero-3.jpg",
    location: "Commercial Shopping Arcade",
    details: "Energy-saving VFD controllers reducing power draw by 35% with ambient ceiling lighting.",
    link: "/products/passenger-elevators",
  },
];

export default function ProjectShowcaseCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((prev) => (prev === 0 ? PROJECTS.length - 1 : prev - 1));
  };

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev === PROJECTS.length - 1 ? 0 : prev + 1));
  }, []);

  // Automatic slide rotation every 5.5 seconds (continuous + manual)
  useEffect(() => {
    const timer = setInterval(() => {
      next();
    }, 5500);
    return () => clearInterval(timer);
  }, [next]);

  const current = PROJECTS[currentIndex];

  return (
    <div className="bg-[#f8f9fa] border border-brand-border rounded-2xl overflow-hidden shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
        {/* Visual Carousel Image */}
        <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-[460px] bg-gray-900 overflow-hidden">
          <Image
            src={current.image}
            alt={current.title}
            fill
            className="object-cover object-center transition-all duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

          {/* Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-black/80 backdrop-blur-md border border-white/20 text-white rounded-full text-xs font-mono font-medium">
              {current.category}
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="text-xs text-gray-200 font-mono drop-shadow">{current.location}</div>
            <div className="text-xl sm:text-2xl font-bold mt-1 drop-shadow-md">{current.title}</div>
          </div>
        </div>

        {/* Details & Interactive Controls */}
        <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-gray-500 pb-3 border-b border-gray-200">
              <span>PROJECT {currentIndex + 1} OF {PROJECTS.length}</span>
              <span className="text-brand-navy font-bold">{current.category}</span>
            </div>

            <h3 className="text-2xl font-extrabold text-black mt-4 mb-3">
              {current.title}
            </h3>

            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              {current.details}
            </p>

            <div className="space-y-2 pt-2 border-t border-gray-200">
              <div className="flex items-center gap-2 text-xs text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-brand-navy" />
                <span>Engineered in compliance with ISO 9001:2015 standards</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-brand-navy" />
                <span>Automatic Rescue Device (ARD) and laser rail alignment</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 flex items-center justify-between">
            <Link
              href={current.link}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-navy hover:text-black transition-colors"
            >
              <span>Explore Product Specs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Slider Navigation Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                aria-label="Previous project"
                className="w-9 h-9 rounded-full bg-white border border-gray-300 hover:border-black text-gray-700 hover:text-black flex items-center justify-center transition-colors shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={next}
                aria-label="Next project"
                className="w-9 h-9 rounded-full bg-brand-navy hover:bg-brand-navy-dark text-white flex items-center justify-center transition-colors shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
