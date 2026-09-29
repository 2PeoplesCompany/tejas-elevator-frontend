"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Maximize2,
  X,
  Camera,
  Film,
  Sparkles,
} from "lucide-react";
import { ShowcaseItem, DEFAULT_SHOWCASE_ITEMS } from "@/lib/showcase";

export default function ProductShowcaseCarousel() {
  const [items, setItems] = useState<ShowcaseItem[]>(DEFAULT_SHOWCASE_ITEMS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeModalItem, setActiveModalItem] = useState<ShowcaseItem | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(3); // 1 on mobile, 2 on tablet, 3 on desktop

  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Responsive items-per-view calculator
  const updateVisibleCount = useCallback(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    }
  }, []);

  useEffect(() => {
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, [updateVisibleCount]);

  // Fetch live showcase items from /api/showcase
  const fetchShowcaseItems = useCallback(async () => {
    try {
      const res = await fetch("/api/showcase");
      if (res.ok) {
        const data = await res.json();
        if (data.items && Array.isArray(data.items) && data.items.length > 0) {
          setItems(data.items);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch live showcase media, utilizing default items:", err);
    }
  }, []);

  useEffect(() => {
    fetchShowcaseItems();
  }, [fetchShowcaseItems]);

  const maxIndex = Math.max(0, items.length - visibleCount);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Autoplay handler
  useEffect(() => {
    if (isPlaying && items.length > visibleCount) {
      autoplayTimerRef.current = setInterval(() => {
        handleNext();
      }, 4500);
    }
    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [isPlaying, handleNext, items.length, visibleCount]);

  // Touch swipe support for phones
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
  };

  return (
    <section className="py-20 bg-[#0b1120] text-white border-t border-b border-slate-800 relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-navy/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-steel/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-steel/20 border border-brand-steel/30 text-xs font-mono text-brand-steel">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live Engineering Showcase • On-Site Installations &amp; Videos</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Product Showcase &amp; Real Installations
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore our real-world elevator installations, panoramic capsule finishes, and smooth PMSM gearless rides in action.
            </p>
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all text-xs flex items-center gap-2"
              title={isPlaying ? "Pause autoplay" : "Resume autoplay"}
            >
              {isPlaying ? <Pause className="w-4 h-4 text-brand-steel" /> : <Play className="w-4 h-4 text-emerald-400" />}
              <span className="hidden sm:inline font-mono">{isPlaying ? "Pause" : "Play"}</span>
            </button>

            <button
              onClick={handlePrev}
              disabled={items.length <= visibleCount}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all disabled:opacity-40"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              disabled={items.length <= visibleCount}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all disabled:opacity-40"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Outer Viewport */}
        <div
          className="relative overflow-hidden cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => setIsPlaying(true)}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${(currentIndex * 100) / visibleCount}%)`,
            }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="shrink-0 px-2 sm:px-3"
                style={{ width: `${100 / visibleCount}%` }}
              >
                <div
                  onClick={() => setActiveModalItem(item)}
                  className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-brand-steel/50 transition-all shadow-lg flex flex-col justify-end p-6 cursor-pointer"
                >
                  {/* Media Visual / Poster */}
                  <Image
                    src={item.thumbnailUrl}
                    alt={item.title}
                    fill
                    unoptimized={true}
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Gradient overlays for high text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className="px-2.5 py-1 bg-black/75 backdrop-blur-md border border-white/20 text-white rounded-full text-[11px] font-mono font-medium flex items-center gap-1.5">
                      {item.mediaType === "video" ? (
                        <>
                          <Film className="w-3 h-3 text-rose-400" />
                          <span>VIDEO CLIP</span>
                        </>
                      ) : (
                        <>
                          <Camera className="w-3 h-3 text-brand-steel" />
                          <span>PHOTO</span>
                        </>
                      )}
                    </span>

                    <span className="px-2.5 py-1 bg-brand-navy/80 backdrop-blur-md border border-brand-steel/30 text-white rounded-full text-[10px] font-mono">
                      {item.category}
                    </span>
                  </div>

                  {/* Centered Play Icon for Videos */}
                  {item.mediaType === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                      <div className="w-14 h-14 rounded-full bg-brand-navy/90 text-white border-2 border-white/30 backdrop-blur-md flex items-center justify-center shadow-2xl group-hover:scale-115 group-hover:bg-brand-navy group-hover:border-white transition-all">
                        <Play className="w-6 h-6 text-white ml-1 fill-white" />
                      </div>
                    </div>
                  )}

                  {/* Hover Expand Icon */}
                  <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center border border-white/20">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Content Overlay */}
                  <div className="relative z-10 space-y-1.5">
                    <h3 className="text-lg font-bold text-white tracking-tight leading-snug drop-shadow-md group-hover:text-brand-steel transition-colors line-clamp-2">
                      {item.title.replace(/^\d+[-_]/, "")}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Click to {item.mediaType === "video" ? "watch video" : "view photo"}</span>
                      {item.duration && <span>{item.duration}s</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        {items.length > visibleCount && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentIndex === idx
                    ? "w-8 bg-brand-steel"
                    : "w-2 bg-slate-700 hover:bg-slate-500"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox / Video Player Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-steel/20 border border-brand-steel/30 text-brand-steel uppercase">
                  {activeModalItem.mediaType}
                </span>
                <h3 className="font-bold text-white text-sm sm:text-base truncate max-w-md">
                  {activeModalItem.title.replace(/^\d+[-_]/, "")}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalItem(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Media Body */}
            <div className="relative bg-black flex items-center justify-center min-h-[300px] max-h-[70vh]">
              {activeModalItem.mediaType === "video" ? (
                <video
                  src={activeModalItem.url}
                  controls
                  autoPlay
                  playsInline
                  className="w-full max-h-[70vh] object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="relative w-full h-[60vh]">
                  <Image
                    src={activeModalItem.url}
                    alt={activeModalItem.title}
                    fill
                    unoptimized={true}
                    className="object-contain"
                  />
                </div>
              )}
            </div>

            {/* Modal Footer Description */}
            <div className="p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="text-xs font-mono text-brand-steel">{activeModalItem.category}</div>
                <div className="text-xs text-slate-300 leading-relaxed">{activeModalItem.description}</div>
              </div>
              <button
                onClick={() => setActiveModalItem(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold self-end sm:self-center transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
