"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Gauge,
  Compass,
  Maximize2,
  Clock,
  ShieldCheck,
  FileText,
  PhoneCall,
  Sparkles,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";

interface SectorApplication {
  id: string;
  tabTitle: string;
  title: string;
  badge: string;
  classification: string;
  tagline: string;
  image: string;
  metrics: {
    capacity: string;
    speed: string;
    pitDepth: string;
    dutyCycle: string;
  };
  challenge: string;
  solution: string;
  engineeringFeatures: string[];
  recommendedDrive: string;
  recommendedDoor: string;
  recommendedFinishes: string;
  productSlug: string;
  productName: string;
  caseStudy: {
    project: string;
    location: string;
    highlight: string;
  };
}

const SECTORS_DATA: SectorApplication[] = [
  {
    id: "industrial",
    tabTitle: "Industrial & Manufacturing",
    title: "Industrial Plants, Warehouses & Manufacturing Hubs",
    badge: "Heavy Duty Freight",
    classification: "Freight Class A / C1–C3 Heavy Rated",
    tagline: "Rugged high-tonnage freight mobility built to endure grueling industrial duty cycles",
    image: "/images/industrial-elevator.jpg",
    metrics: {
      capacity: "1,000 kg – 5,000+ kg",
      speed: "0.35 – 0.75 m/s",
      pitDepth: "1,200 – 1,600 mm",
      dutyCycle: "24/7 Continuous Heavy Industrial",
    },
    challenge:
      "Factory and logistics facilities subject vertical transit systems to severe stresses: dynamic impact from motorized forklifts, heavy point loads, ambient dust, grease, and non-stop operational cycles where breakdown downtime directly damages production schedules.",
    solution:
      "Tejas heavy freight elevators are engineered with heavy-duty rolled steel I-beam car slings, reinforced anti-skid chequered floor plating, full-height mechanical door gate interlocks, and solid-state overload cutoffs preventing car dispatch when weight boundaries are exceeded.",
    engineeringFeatures: [
      "Reinforced heavy structural channel & I-beam car sling withstanding uneven forklift loading",
      "Chequered anti-skid steel floor plating with heavy perimeter impact side bumpers",
      "Motorized vertical bi-parting doors or rugged heavy-duty collapsible steel gates",
      "Audio-visual electronic overload sensor preventing dispatch when capacity is exceeded",
      "Heavy progressive mechanical safety gear with instant slack-rope brake locks",
      "Phase reversal, high-torque geared traction / heavy dual-hydraulic options",
    ],
    recommendedDrive: "Heavy Geared Traction / Heavy Dual Hydraulic",
    recommendedDoor: "Vertical Bi-Parting Motorized / Steel Collapsible Gates",
    recommendedFinishes: "Industrial Epoxy-Coated Steel / Heavy Chequered Mild Steel",
    productSlug: "industrial-goods-lifts",
    productName: "Industrial Goods & Freight Lifts",
    caseStudy: {
      project: "3,500 kg Heavy Industrial Freight Elevator",
      location: "Industrial Logistics Hub",
      highlight: "Equipped with motorized vertical bi-parting entrance doors and multi-point floor interlocks.",
    },
  },
  {
    id: "commercial",
    tabTitle: "Commercial & Corporate",
    title: "Commercial Plazas, Corporate Towers & IT Parks",
    badge: "High-Traffic Express",
    classification: "High-Traffic Group Control • IS 14665",
    tagline: "High-velocity passenger throughput, whisper-quiet acoustic dampening, and executive aesthetics",
    image: "/images/passenger-elevator.jpg",
    metrics: {
      capacity: "6 to 18 Persons (Core) | 10 to 24 Persons (Express)",
      speed: "0.75 – 1.75 m/s (Core) | 1.5 – 2.5 m/s (Express)",
      pitDepth: "1,500 – 1,800 mm",
      dutyCycle: "Peak-Hour Intensive Commercial Flow",
    },
    challenge:
      "Commercial office towers face severe rush-hour lobby bottlenecks during morning check-ins and evening departures. Elevators must dispatch rapidly without high energy consumption or jarring stops that disturb tenant comfort.",
    solution:
      "Our commercial passenger systems feature Permanent Magnet Synchronous Motor (PMSM) gearless drives that reduce power consumption by up to 40%. Intelligent microprocessor landing dispatch groups minimize passenger wait times, while hairline stainless steel and titanium finishes enhance corporate prestige.",
    engineeringFeatures: [
      "Permanent Magnet Synchronous Motor (PMSM) cutting energy consumption by up to 40%",
      "Intelligent microprocessor group dispatching minimizing lobby wait times",
      "Rapid variable frequency (VFD) automatic center-opening doors with multi-beam light curtains",
      "Integrated access control compatibility: RFID keycard scanners & visitor floor lockouts",
      "Acoustic dampening mounts maintaining cabin sound levels under 50 dB",
      "Full compliance with ISO 9001:2015 manufacturing quality and IS 14665 safety codes",
    ],
    recommendedDrive: "PMSM Gearless Traction Machine (MRL / MR)",
    recommendedDoor: "Center-Opening Automatic High-Speed Stainless Steel Doors",
    recommendedFinishes: "Hairline SS 304 / Titanium Gold PVD / Mirror Etched Panels",
    productSlug: "passenger-elevators",
    productName: "Commercial Passenger Elevators",
    caseStudy: {
      project: "Corporate Financial Plaza Core",
      location: "Commercial Business Hub",
      highlight: "Duplex 13-passenger high-speed bank with synchronized microprocessor landing dispatch.",
    },
  },
  {
    id: "healthcare",
    tabTitle: "Hospitals & Healthcare",
    title: "Multi-Specialty Hospitals, Clinics & Care Centers",
    badge: "Mission-Critical Medical",
    classification: "NABH Hospital Guidelines • Code Blue Ready",
    tagline: "Ultra-smooth precision leveling, deep stretcher clearances, and emergency medical recall",
    image: "/images/hospital-elevator.jpg",
    metrics: {
      capacity: "4 to 8 Persons (Clinic) | 15 to 26 Persons (Bed & ICU)",
      speed: "0.75 – 1.5 m/s",
      pitDepth: "1,400 – 1,600 mm",
      dutyCycle: "24/7 Mission-Critical Patient Transit",
    },
    challenge:
      "Transporting post-operative patients, critical care stretchers, and life-support carts demands absolute stability. Standard elevator jolts during starting, stopping, or uneven floor leveling can cause severe patient distress.",
    solution:
      "Tejas hospital elevators are built with VFD micro-leveling precision (±2 mm), ensuring stretcher wheels roll in with zero jarring. Deep cabins (up to 2,400 mm depth) easily fit standard hospital beds and medical crews, with emergency Code Blue priority keys for urgent ICU recall.",
    engineeringFeatures: [
      "VFD micro-leveling precision (±2 mm) preventing wheel roll-in jolts during bed transfers",
      "Extra-deep cabin dimensions (2,400 mm+) accommodating ICU beds, IV poles & attendants",
      "Compact Clinic Model available for smaller facilities requiring 4 to 8 person capacity",
      "Code Blue Medical Priority key switch instantly recalling car to emergency floor",
      "Full-height multi-beam infrared safety light curtains preventing door closure on moving beds",
      "Hygienic easy-to-sanitize antibacterial stainless steel panels and anti-skid vinyl flooring",
    ],
    recommendedDrive: "Smooth VFD Microprocessor Gearless Traction",
    recommendedDoor: "Two-Speed Telescopic Wide Entrance / Automatic Center-Opening",
    recommendedFinishes: "Antibacterial Hygienic Stainless Steel (SS 304 / SS 316)",
    productSlug: "hospital-stretcher-lifts",
    productName: "Hospital & Stretcher Lifts",
    caseStudy: {
      project: "20-Passenger Hospital Bed Transit Wing",
      location: "Multi-Specialty Healthcare Center",
      highlight: "Twin bed elevators with ±2 mm leveling precision and dedicated Code Blue priority override.",
    },
  },
  {
    id: "residential",
    tabTitle: "Residential High-Rise",
    title: "High-Rise Apartments, Gated Communities & Housing Societies",
    badge: "Society Comfort",
    classification: "IS 14665 Standard • ARD Integrated",
    tagline: "Reliable daily commuter transit, whisper-quiet operation, and low lifecycle operating costs",
    image: "/images/hero-elevator.jpg",
    metrics: {
      capacity: "4 to 15 Persons (300 – 1,020 kg)",
      speed: "0.5 – 1.5 m/s",
      pitDepth: "1,500 mm",
      dutyCycle: "Daily Frequent Residential Traffic (Up to 24+ Floors)",
    },
    challenge:
      "Residential societies require lifts that run continuously with minimal electricity costs, zero breakdown headaches for society management, and absolute safety for elderly residents and children during sudden grid power cuts.",
    solution:
      "We install robust Machine-Room-Less (MRL) residential elevators equipped with battery-backed Automatic Rescue Devices (ARD). When mains power trips, the elevator automatically moves to the nearest landing floor and opens doors safely within seconds.",
    engineeringFeatures: [
      "Integrated Automatic Rescue Device (ARD) for immediate safe landing during power outages",
      "Machine-Room-Less (MRL) layout eliminating bulky rooftop concrete machine rooms",
      "VFD door drives ensuring whisper-silent door operation without disturbing nearby bedrooms",
      "Capacity ranging from 4 to 15 persons accommodating small societies to high-rise towers",
      "Low maintenance PMSM motors reducing society monthly electricity and AMC expenditure",
      "Fireman emergency control switch and bi-directional intercom system",
    ],
    recommendedDrive: "MRL PMSM Gearless Traction Drive",
    recommendedDoor: "Automatic Stainless Steel Center Opening / Telescopic",
    recommendedFinishes: "Hairline Stainless Steel / Scratch-Resistant Interior Inserts",
    productSlug: "passenger-elevators",
    productName: "Residential Passenger Elevators",
    caseStudy: {
      project: "10-Passenger Residential Tower Lift",
      location: "Gated Housing Society",
      highlight: "Equipped with MRL technology, ARD battery rescue, and smart car energy sleep mode.",
    },
  },
  {
    id: "villas",
    tabTitle: "Private Villas & Homes",
    title: "Private Villas, Duplex Penthouses & Bungalows",
    badge: "Architectural Luxury",
    classification: "Shallow Pit (200–300 mm) • Single Phase 220V",
    tagline: "Custom luxury vertical mobility with shallow pit civil integration and 360° panoramic glass aesthetics",
    image: "/images/home-elevator.jpg",
    metrics: {
      capacity: "2 to 8 Persons (180 – 600 kg)",
      speed: "0.3 – 0.6 m/s",
      pitDepth: "200 – 400 mm (Pitless Options)",
      dutyCycle: "On-Demand Private Home Accessibility",
    },
    challenge:
      "Existing private residences and designer villas rarely have space for deep civil elevator pits or bulky rooftop machine rooms, and homeowners demand whisper-silent operation that runs on standard household electrical supply.",
    solution:
      "Our luxury home lifts require a pit depth of only 200 mm to 300 mm and can run directly on single-phase 220V domestic power. Featuring frameless 360-degree panoramic glass cabins and champagne bronze finishes, they elevate home accessibility into an architectural centerpiece.",
    engineeringFeatures: [
      "Ultra-compact pit requirement starting from just 200 mm (pitless ramp option available)",
      "Single-phase (220V standard domestic) or three-phase power support",
      "Whisper-silent acoustic isolation operating under 48 dB (quieter than a home refrigerator)",
      "Panoramic 360-degree glass cabin options maximizing natural interior lighting",
      "Tailor-made cabin footprints designed down to the millimeter for tight stairwells",
      "Emergency manual lowering & battery descent backup for independent family peace of mind",
    ],
    recommendedDrive: "Hydraulic In-Ground / MRL Gearless Home Drive",
    recommendedDoor: "Panoramic Frameless Glass Swing / Luxury Automatic Telescopic",
    recommendedFinishes: "Full Toughened Glass Panoramic Enclosure / Champagne Bronze SS",
    productSlug: "home-villa-lifts",
    productName: "Home & Villa Lifts",
    caseStudy: {
      project: "3-Stop Panoramic Glass Capsule Lift",
      location: "Private Luxury Residence",
      highlight: "Custom self-supporting steel shaft fitted cleanly inside an open spiral stairwell.",
    },
  },
];

const COMPARISON_ROWS = [
  {
    sector: "Industrial Plants & Factories",
    payload: "1,000 – 5,000+ kg",
    speed: "0.35 – 0.75 m/s",
    pit: "1,200 – 1,600 mm",
    door: "Vertical Bi-Parting / Collapsible Steel",
    drive: "Heavy Geared / Heavy Hydraulic",
    code: "Freight Class A / C1–C3",
  },
  {
    sector: "Commercial Corporate Towers",
    payload: "6 – 24 Persons (450 – 1,632 kg)",
    speed: "0.75 – 2.5 m/s",
    pit: "1,500 – 1,800 mm",
    door: "Center Opening Automatic",
    drive: "PMSM Gearless Traction (MRL)",
    code: "IS 14665 & ISO 9001:2015",
  },
  {
    sector: "Hospitals & Medical Wings",
    payload: "4 – 26 Persons / Hospital Bed",
    speed: "0.75 – 1.5 m/s",
    pit: "1,400 – 1,600 mm",
    door: "Wide 2-Speed Telescopic",
    drive: "VFD Micro-Leveling (±2 mm)",
    code: "NABH & Code Blue Ready",
  },
  {
    sector: "Residential Housing Towers",
    payload: "4 – 15 Persons (300 – 1,020 kg)",
    speed: "0.5 – 1.5 m/s",
    pit: "1,500 mm",
    door: "Automatic Center / Telescopic",
    drive: "PMSM MRL Traction",
    code: "IS 14665 Standard",
  },
  {
    sector: "Private Villas & Duplexes",
    payload: "2 – 8 Persons (180 – 600 kg)",
    speed: "0.3 – 0.6 m/s",
    pit: "200 – 400 mm",
    door: "Glass Swing / Telescopic",
    drive: "Hydraulic / MRL Compact (220V)",
    code: "Shallow Pit Domestic",
  },
];

export default function ApplicationsPage() {
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredSectors =
    activeTab === "all"
      ? SECTORS_DATA
      : SECTORS_DATA.filter((sec) => sec.id === activeTab);

  return (
    <div className="bg-white">
      {/* Cinematic Hero Header */}
      <section className="relative text-white py-20 lg:py-28 overflow-hidden border-b border-gray-800">
        <Image
          src="/images/glass-atrium-elevator.jpg"
          alt="Elevator Applications by Sector"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-600 bg-black/60 backdrop-blur-md text-xs font-mono tracking-wider uppercase text-gray-300">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-steel"></span>
              Vertical Mobility by Sector • ISO 9001:2015 Certified
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
              Engineered Mobility for Every Built Environment
            </h1>
            <p className="text-gray-100 text-base sm:text-lg leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              From heavy-tonnage manufacturing plants and mission-critical hospital wards to corporate high-rises
              and luxury private villas—Tejas Elevator Engineering custom-engineers vertical transit to exact structural
              and passenger flow demands.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="#sector-explorer"
                className="px-5 py-2.5 bg-brand-navy hover:bg-brand-navy-dark text-white rounded text-xs font-bold transition-colors shadow-md flex items-center gap-1.5"
              >
                <span>Explore Sector Solutions</span>
                <ChevronRight className="w-4 h-4" />
              </a>
              <Link
                href="/contact?topic=Shaft%20Feasibility"
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded text-xs font-bold transition-colors backdrop-blur-sm"
              >
                Request Shaft Feasibility
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Sticky Sector Switcher / Filter Bar */}
      <section id="sector-explorer" className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-brand-border py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar py-1">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-gray-500 uppercase shrink-0 mr-2">
              <SlidersHorizontal className="w-4 h-4 text-brand-navy" />
              <span>Filter Sector:</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "all"
                    ? "bg-brand-navy text-white shadow-sm"
                    : "bg-[#f1f3f5] text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Sectors ({SECTORS_DATA.length})
              </button>

              {SECTORS_DATA.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveTab(sec.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === sec.id
                      ? "bg-brand-navy text-white shadow-sm"
                      : "bg-[#f1f3f5] text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {sec.tabTitle}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sector Deep-Dive Solutions (TK Elevator Style Split Showcase) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        {filteredSectors.map((sector) => (
          <div
            key={sector.id}
            id={sector.id}
            className="bg-[#f8f9fa] border border-brand-border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Top Bar with Classification & Standard Badges */}
            <div className="px-6 sm:px-10 py-4 bg-white border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-brand-navy/10 text-brand-navy rounded-full text-xs font-mono font-bold">
                  {sector.badge}
                </span>
                <span className="text-xs font-mono text-gray-500 font-medium">
                  {sector.classification}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ISO 9001:2015 &amp; IS 14665 Certified</span>
              </div>
            </div>

            {/* Split Editorial Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 p-6 sm:p-10 items-start">
              {/* Left Column: Visual Asset & Live Metric Chips */}
              <div className="lg:col-span-5 space-y-6">
                <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden shadow border border-gray-200 bg-gray-100">
                  <Image
                    src={sector.image}
                    alt={sector.title}
                    fill
                    className="object-cover object-center hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-[11px] font-mono text-gray-300 uppercase tracking-wider">
                      Target Sector
                    </div>
                    <div className="text-xl font-bold">{sector.tabTitle}</div>
                  </div>
                </div>

                {/* 4 Metric Chips */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-white border border-gray-200 rounded-xl shadow-xs">
                    <div className="flex items-center gap-1.5 text-gray-500 text-[11px] font-mono mb-1">
                      <Maximize2 className="w-3.5 h-3.5 text-brand-navy" />
                      <span>Payload Range</span>
                    </div>
                    <div className="font-bold text-gray-900 leading-snug">
                      {sector.metrics.capacity}
                    </div>
                  </div>

                  <div className="p-3.5 bg-white border border-gray-200 rounded-xl shadow-xs">
                    <div className="flex items-center gap-1.5 text-gray-500 text-[11px] font-mono mb-1">
                      <Gauge className="w-3.5 h-3.5 text-brand-navy" />
                      <span>Rated Speed</span>
                    </div>
                    <div className="font-bold text-gray-900 leading-snug">
                      {sector.metrics.speed}
                    </div>
                  </div>

                  <div className="p-3.5 bg-white border border-gray-200 rounded-xl shadow-xs">
                    <div className="flex items-center gap-1.5 text-gray-500 text-[11px] font-mono mb-1">
                      <Compass className="w-3.5 h-3.5 text-brand-navy" />
                      <span>Pit Depth</span>
                    </div>
                    <div className="font-bold text-gray-900 leading-snug">
                      {sector.metrics.pitDepth}
                    </div>
                  </div>

                  <div className="p-3.5 bg-white border border-gray-200 rounded-xl shadow-xs">
                    <div className="flex items-center gap-1.5 text-gray-500 text-[11px] font-mono mb-1">
                      <Clock className="w-3.5 h-3.5 text-brand-navy" />
                      <span>Duty Rating</span>
                    </div>
                    <div className="font-bold text-gray-900 leading-snug">
                      {sector.metrics.dutyCycle}
                    </div>
                  </div>
                </div>

                {/* Case Study Callout Box */}
                <div className="p-4 bg-white border border-brand-border rounded-xl text-xs space-y-1 shadow-xs">
                  <div className="flex items-center gap-1.5 text-brand-navy font-bold uppercase tracking-wider text-[10px] font-mono">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Real-World Installation:</span>
                  </div>
                  <div className="font-bold text-gray-900">{sector.caseStudy.project}</div>
                  <p className="text-gray-600 text-[11px] leading-relaxed">{sector.caseStudy.highlight}</p>
                </div>
              </div>

              {/* Right Column: Challenge, Engineering Solution & Technical Bullet Points */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight mb-2">
                    {sector.title}
                  </h2>
                  <p className="text-sm font-medium text-brand-navy leading-relaxed">
                    {sector.tagline}
                  </p>
                </div>

                {/* Challenge & Solution Cards */}
                <div className="space-y-4">
                  <div className="p-4 sm:p-5 bg-white border border-red-100 rounded-2xl">
                    <div className="text-[11px] font-mono uppercase tracking-widest text-red-600 font-bold mb-1.5">
                      Sector Architectural Challenge:
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">{sector.challenge}</p>
                  </div>

                  <div className="p-4 sm:p-5 bg-white border border-blue-100 rounded-2xl">
                    <div className="text-[11px] font-mono uppercase tracking-widest text-brand-navy font-bold mb-1.5">
                      Tejas Engineering Solution:
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">{sector.solution}</p>
                  </div>
                </div>

                {/* Key Engineering Features */}
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-gray-500 font-bold mb-3">
                    Technical &amp; Safety Engineering Highlights
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {sector.engineeringFeatures.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 p-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800">
                        <CheckCircle2 className="w-4 h-4 text-brand-navy shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sub-specifications: Drive, Doors, Finishes */}
                <div className="p-4 bg-white border border-gray-200 rounded-2xl space-y-2 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="font-mono text-[11px] text-gray-400 block uppercase">Recommended Drive</span>
                      <span className="font-semibold text-gray-900">{sector.recommendedDrive}</span>
                    </div>
                    <div>
                      <span className="font-mono text-[11px] text-gray-400 block uppercase">Entrance Configuration</span>
                      <span className="font-semibold text-gray-900">{sector.recommendedDoor}</span>
                    </div>
                    <div>
                      <span className="font-mono text-[11px] text-gray-400 block uppercase">Standard Cabin Finish</span>
                      <span className="font-semibold text-gray-900">{sector.recommendedFinishes}</span>
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="pt-4 border-t border-gray-200 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/products/${sector.productSlug}`}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-brand-navy hover:bg-brand-navy-dark text-white rounded text-xs font-bold transition-colors shadow-sm"
                  >
                    <span>View {sector.productName} Specs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href={`/contact?building=${encodeURIComponent(sector.tabTitle)}`}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-gray-50 border border-gray-300 hover:border-black text-black rounded text-xs font-bold transition-colors"
                  >
                    <span>Request Quotation for {sector.tabTitle}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Comprehensive Sector Comparison Matrix */}
      <section className="py-20 bg-[#f8f9fa] border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-2xl mb-12">
            <div className="text-xs font-mono uppercase tracking-widest text-brand-navy font-semibold mb-2">
              Architectural Planning Guide
            </div>
            <h2 className="text-3xl font-extrabold text-black">
              Sector Technical Planning Matrix
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              High-level technical specifications and civil guidelines for architects, structural consultants, and building developers.
            </p>
          </div>

          <div className="overflow-x-auto bg-white border border-brand-border rounded-2xl shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#111827] text-white font-mono uppercase text-[11px]">
                <tr>
                  <th className="p-4 sm:p-5">Building Sector</th>
                  <th className="p-4 sm:p-5">Payload Range</th>
                  <th className="p-4 sm:p-5">Rated Speed</th>
                  <th className="p-4 sm:p-5">Pit Depth</th>
                  <th className="p-4 sm:p-5">Door Configuration</th>
                  <th className="p-4 sm:p-5">Drive Technology</th>
                  <th className="p-4 sm:p-5">Compliance Standard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-700">
                {COMPARISON_ROWS.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-black flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-navy shrink-0"></span>
                      <span>{row.sector}</span>
                    </td>
                    <td className="p-4 sm:p-5 font-semibold text-gray-900">{row.payload}</td>
                    <td className="p-4 sm:p-5 font-mono">{row.speed}</td>
                    <td className="p-4 sm:p-5 font-mono font-bold text-brand-navy">{row.pit}</td>
                    <td className="p-4 sm:p-5">{row.door}</td>
                    <td className="p-4 sm:p-5">{row.drive}</td>
                    <td className="p-4 sm:p-5">
                      <span className="px-2 py-1 bg-gray-100 rounded text-[11px] font-mono text-gray-800 font-semibold border border-gray-200">
                        {row.code}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Architect & Structural Consultant Feasibility Banner */}
      <section className="py-16 bg-white border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-xl">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none">
              <Image
                src="/images/installation-site.jpg"
                alt="Shaft Feasibility Engineering"
                fill
                className="object-cover"
              />
            </div>

            <div className="max-w-3xl space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-steel/20 border border-brand-steel/30 text-xs font-mono text-brand-steel">
                <FileText className="w-3.5 h-3.5" />
                <span>Architect &amp; Builder Engineering Support</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Designing a New Building Shaft or Retrofitting an Existing Property?
              </h3>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Our senior elevator engineers assist architects and structural designers with custom civil shaft layouts,
                reaction load diagrams, machine-room-less (MRL) headroom requirements, and statutory clearances under ISO 9001:2015 and IS 14665 standards.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="font-bold text-white mb-1">01. Civil Shaft Sizing</div>
                  <div className="text-gray-400">Clear width, depth, pit depth, and overhead calculations.</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="font-bold text-white mb-1">02. Power &amp; Electrical</div>
                  <div className="text-gray-400">Supply amperage, breaker sizing, and DG backup power specs.</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="font-bold text-white mb-1">03. 24h Feasibility Turnaround</div>
                  <div className="text-gray-400">Receive customized civil drawing estimates within 1 business day.</div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  href="/contact?topic=Shaft%20Consultation"
                  className="px-6 py-3.5 bg-brand-navy hover:bg-brand-navy-dark text-white rounded text-xs font-bold transition-all shadow-md flex items-center gap-2"
                >
                  <span>Request Engineering Feasibility Pack</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="tel:9348783051"
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold text-gray-300 hover:text-white transition-colors"
                >
                  <PhoneCall className="w-4 h-4 text-brand-steel" />
                  <span>Direct Hotline: +91 93487 83051</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
