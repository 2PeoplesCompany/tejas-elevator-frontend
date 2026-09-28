"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Building2,
  HeartPulse,
  Truck,
  Home,
  Phone,
  Mail,
  ChevronRight,
  Star,
} from "lucide-react";
import { PRODUCTS_DATA } from "@/lib/products-data";
import InquiryForm from "@/components/InquiryForm";
import HeroCarousel from "@/components/HeroCarousel";
import ProjectShowcaseCarousel from "@/components/ProjectShowcaseCarousel";
import { getMediaUrl } from "@/lib/media";

export default function HomePage() {
  const [activeApplication, setActiveApplication] = useState<string>("residential");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const iconMap: Record<string, typeof Building2> = {
    "passenger-elevators": Building2,
    "home-villa-lifts": Home,
    "hospital-stretcher-lifts": HeartPulse,
    "industrial-goods-lifts": Truck,
  };

  const applications = [
    {
      id: "residential",
      name: "Residential",
      title: "Elevators for Modern Homes & Communities",
      desc: "From standalone luxury bungalows to multi-story housing societies, we deliver safe, quiet, and reliable vertical mobility that enhances daily convenience for families and elderly residents.",
      image: getMediaUrl("/images/home-elevator.jpg"),
      points: [
        "Quiet gearless drive preventing sound disturbance in living areas",
        "Compact footprint fitting into stairwells or exterior glass shafts",
        "Integrated child-safety locks and automatic rescue mechanisms",
      ],
    },
    {
      id: "commercial",
      name: "Commercial & Retail",
      title: "High-Traffic Mobility for Business & Retail",
      desc: "Keep crowds moving effortlessly in corporate offices, shopping arcades, and hospitality venues with rapid door cycling, intelligent dispatching, and sophisticated architectural finishes.",
      image: getMediaUrl("/images/passenger-elevator.jpg"),
      points: [
        "Fast cycle times and energy-efficient motor management",
        "Premium cabin interiors matching corporate interior decor",
        "Heavy-duty landing doors rated for continuous high-frequency usage",
      ],
    },
    {
      id: "hospital",
      name: "Healthcare",
      title: "Dedicated Stretcher & Medical Mobility",
      desc: "In medical environments, every second matters and ride smoothness is vital. Our healthcare elevators ensure steady patient transport, wide stretcher door clearance, and priority call features.",
      image: getMediaUrl("/images/hospital-elevator.jpg"),
      points: [
        "±2 mm precise floor leveling to prevent stretcher jolts",
        "Hygienic, anti-bacterial stainless steel surfaces",
        "Dedicated medical priority override keys",
      ],
    },
    {
      id: "industrial",
      name: "Industrial & Freight",
      title: "Rugged Logistics & Heavy Material Movement",
      desc: "Designed to endure grueling manufacturing conditions, heavy pallet movement, and forklift loading. Built with reinforced steel channels and fail-safe safety gear.",
      image: getMediaUrl("/images/industrial-elevator.jpg"),
      points: [
        "Reinforced structural sling with heavy safety margins",
        "Durable chequered steel plate flooring",
        "Microprocessor panels with audiovisual overload warning",
      ],
    },
  ];

  const currentApp = applications.find((a) => a.id === activeApplication) || applications[0];

  const faqs = [
    {
      q: "What is the minimum pit depth required for a Home / Villa lift?",
      a: "Our compact Home and Villa lifts require as little as 200 mm to 300 mm pit depth, making them ideal for existing residential bungalows where deep excavation is impossible.",
    },
    {
      q: "What happens during a sudden power outage?",
      a: "All Tejas elevators come equipped with an Automatic Rescue Device (ARD). When the power cuts, the system immediately switches to battery backup, brings the cabin smoothly to the nearest landing, and opens the doors automatically.",
    },
    {
      q: "Can you install an elevator in an existing building without a concrete shaft?",
      a: "Yes! We specialize in custom glass and mild steel self-supporting structural towers that can be erected outside the building facade or within existing stairwell cutouts with minimal civil disruption.",
    },
    {
      q: "What is the typical timeframe for elevator installation?",
      a: "Standard residential and commercial passenger elevators generally take 3 to 6 weeks from shaft handover to final commissioning and safety certification.",
    },
  ];

  const testimonials = [
    {
      quote:
        "Tejas Elevator solved a major challenge for our 4-story duplex. Other companies demanded a 1.2m pit, but the Tejas Elevator engineering team engineered a shallow-pit glass lift that fits seamlessly into our stairwell.",
      author: "Er. Ramesh Mohanty",
      role: "Architect & Villa Owner",
      rating: 5,
    },
    {
      quote:
        "The jerk-free leveling in their hospital stretcher elevators is outstanding. The stretcher rolls in effortlessly, and their 24/7 AMC breakdown team responds within 45 minutes whenever called.",
      author: "Dr. S. K. Patnaik",
      role: "Medical Director, Lifeline Hospital",
      rating: 5,
    },
    {
      quote:
        "We switched our society's 4 passenger lifts to Tejas Elevator's Comprehensive AMC. Breakdowns dropped to zero, and the ride quality is much quieter than before.",
      author: "Ananya Tripathy",
      role: "President, Silver Springs Society",
      rating: 5,
    },
  ];

  return (
    <div className="bg-white">
      {/* 1. Hero Multi-Slide Carousel (Automatic + Manual) */}
      <HeroCarousel />

      {/* 2. Products Grid in 1x4 Order (4 in a row on desktop) */}
      <section className="py-20 bg-white border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-brand-navy font-semibold mb-2">
                Our Products
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#000000]">
                Elevators Engineered for Every Building
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy hover:text-black transition-colors"
            >
              <span>View All 4 Product Lines</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 1x4 order layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS_DATA.map((prod) => {
              const Icon = iconMap[prod.id] || Building2;
              return (
                <div
                  key={prod.id}
                  className="group bg-white border border-brand-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gray-100">
                    <Image
                      src={prod.heroImage}
                      alt={prod.title}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/75 backdrop-blur-md border border-white/20 text-white rounded-full text-[11px] font-medium">
                        <Icon className="w-3 h-3 text-brand-steel" />
                        {prod.shortTag}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-lg font-bold text-white tracking-tight drop-shadow-sm">
                        {prod.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                      {prod.subtitle}
                    </p>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <Link
                        href={`/products/${prod.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-brand-navy hover:text-black transition-colors"
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        href={`/contact?product=${encodeURIComponent(prod.title)}`}
                        className="text-[11px] font-semibold text-gray-700 hover:text-black bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded transition-colors"
                      >
                        Inquire
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Project Showcase Carousel */}
      <section className="py-20 bg-white border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-brand-navy font-semibold mb-2">
                Project Gallery
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#000000]">
                Recent Installations & Cabin Finishes
              </h2>
            </div>
            <p className="text-sm text-gray-500 max-w-md">
              Browse our portfolio of custom residential glass shafts, high-traffic corporate lobbies, and specialized hospital bed lifts.
            </p>
          </div>

          <ProjectShowcaseCarousel />
        </div>
      </section>

      {/* 4. Interactive Applications Explorer */}
      <section className="py-20 bg-[#f8f9fa] border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-2xl mb-10">
            <div className="text-xs font-mono uppercase tracking-widest text-brand-navy font-semibold mb-2">
              Tailored Solutions
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#000000]">
              Solutions for Different Applications
            </h2>
            <p className="mt-3 text-brand-muted text-sm leading-relaxed">
              Every facility has distinct passenger rhythms, safety requirements, and architectural
              constraints. Select an application to see how we engineer for your environment:
            </p>
          </div>

          <div className="flex flex-wrap gap-2 border-b border-brand-border pb-4 mb-8">
            {applications.map((app) => (
              <button
                key={app.id}
                onClick={() => setActiveApplication(app.id)}
                className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  activeApplication === app.id
                    ? "bg-[#000000] text-white shadow-sm"
                    : "bg-white text-gray-700 hover:bg-gray-200 border border-gray-200"
                }`}
              >
                {app.name}
              </button>
            ))}
          </div>

          <div className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-6">
              <div>
                <div className="inline-block px-3 py-1 bg-[#f1f3f5] rounded text-xs font-mono font-medium text-brand-navy mb-4">
                  Application: {currentApp.name}
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#000000] mb-3">
                  {currentApp.title}
                </h3>
                <p className="text-brand-muted text-sm leading-relaxed mb-6">{currentApp.desc}</p>

                <div className="space-y-3 pt-2">
                  {currentApp.points.map((pt, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-gray-800">
                      <CheckCircle2 className="w-4 h-4 text-brand-navy shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex items-center gap-4">
                <Link
                  href={`/contact?building=${encodeURIComponent(currentApp.name)}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-navy hover:bg-brand-navy-dark text-white text-xs font-bold rounded transition-colors"
                >
                  <span>Inquire for {currentApp.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/applications"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-black"
                >
                  <span>Explore All Sectors</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full bg-gray-100">
              <Image
                src={currentApp.image}
                alt={currentApp.title}
                fill
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Client Trust & Testimonials */}
      <section className="py-20 bg-white border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-mono uppercase tracking-widest text-brand-navy font-semibold mb-2">
              Client Feedback
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-black">
              Trusted by Architects, Doctors & Building Societies
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Hear directly from clients who rely on Tejas Elevator Engineering for ride quality and maintenance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="p-8 bg-[#f8f9fa] border border-brand-border rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-4 text-amber-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 italic leading-relaxed mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="font-bold text-black text-sm">{t.author}</div>
                  <div className="text-xs text-brand-navy">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Elevator FAQs Accordion */}
      <section className="py-20 bg-[#f8f9fa] border-b border-brand-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-12">
            <div className="text-xs font-mono uppercase tracking-widest text-brand-navy font-semibold mb-2">
              Common Inquiries
            </div>
            <h2 className="text-3xl font-extrabold text-black">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Everything you need to know about shaft dimensions, installation time, and emergency safety.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-brand-border rounded-xl overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left font-bold text-black flex items-center justify-between text-sm sm:text-base gap-4"
                  >
                    <span>{faq.q}</span>
                    <span className="text-brand-navy font-mono text-lg shrink-0">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Quote Section */}
      <section id="quote" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-6">
              <div className="text-xs font-mono uppercase tracking-widest text-brand-navy font-semibold">
                Direct Engineering Desk
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#000000]">
                Ready to Elevate Your Building?
              </h2>
              <p className="text-brand-muted text-sm leading-relaxed">
                Connect directly with our technical design and consultation team. We provide free
                shaft feasibility assessments, civil dimension guidance, and transparent quotations.
              </p>

              <div className="p-6 bg-[#f8f9fa] border border-brand-border rounded-xl space-y-4">
                <div className="text-xs font-mono uppercase tracking-wider text-gray-500 font-bold">
                  Official Communication
                </div>
                <div className="text-sm">
                  <div className="font-bold text-gray-900">Engineering Consultation Desk</div>
                  <div className="text-xs text-brand-navy font-medium">Tejas Elevator Engineering</div>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-200 text-xs">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-brand-navy" />
                    <a href="tel:9348783051" className="font-mono font-bold hover:underline">
                      +91 93487 83051
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-brand-navy" />
                    <a href="mailto:tejaselevatorengineering@gmail.com" className="font-mono hover:underline truncate">
                      tejaselevatorengineering@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <InquiryForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
