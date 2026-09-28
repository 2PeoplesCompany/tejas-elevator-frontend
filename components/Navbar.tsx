"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Mail, Award, ArrowRight, Menu, X } from "lucide-react";
import { getMediaUrl } from "@/lib/media";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Products", href: "/products" },
    { name: "Services & AMC", href: "/services" },
    { name: "Applications", href: "/applications" },
    { name: "About Us", href: "/about" },
    { name: "Contact & Quote", href: "/contact" },
  ];

  return (
    <>
      {/* Top Corporate Contact Strip */}
      <div className="bg-[#000000] text-gray-300 text-xs sm:text-sm py-2 px-4 sm:px-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="flex items-center gap-1.5 text-gray-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Engineering & Support Active
            </span>
            <span className="hidden md:inline-block text-gray-600">|</span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-gray-300">
              <Award className="w-3.5 h-3.5 text-brand-steel" />
              ISO 9001:2015 Certified & IS 14665 Standard
            </span>
          </div>

          <div className="flex items-center gap-5 ml-auto">
            <a
              href="tel:9348783051"
              className="flex items-center gap-2 text-white hover:text-brand-steel transition-colors font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-brand-steel" />
              <span>+91 93487 83051</span>
            </a>
            <span className="text-gray-700">|</span>
            <a
              href="mailto:tejaselevatorengineering@gmail.com"
              className="flex items-center gap-2 text-white hover:text-brand-steel transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-brand-steel" />
              <span className="hidden sm:inline">tejaselevatorengineering@gmail.com</span>
              <span className="sm:hidden">Email</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          {/* Logo Brand with Official Artwork */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center p-1 border border-brand-border rounded-lg bg-white shadow-sm overflow-hidden">
              <Image
                src={getMediaUrl("/tejas-logo.jpg")}
                alt="Tejas Elevator Engineering Logo"
                width={64}
                height={64}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold tracking-tight text-[#000000] uppercase font-mono group-hover:text-brand-navy transition-colors">
                Tejas Elevator
              </div>
              <div className="text-[11px] sm:text-xs tracking-widest uppercase text-brand-navy font-semibold">
                Engineering
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-700">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`transition-colors py-1 ${
                    isActive
                      ? "text-brand-navy font-bold border-b-2 border-brand-navy"
                      : "hover:text-brand-navy"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action CTA Button */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-brand-navy hover:bg-brand-navy-dark transition-all rounded shadow-sm hover:shadow"
            >
              <span>Get a Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-black focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-brand-border px-6 py-5 shadow-lg">
            <div className="flex flex-col gap-4 text-base font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`transition-colors ${
                    pathname === link.href ? "text-brand-navy font-bold" : "text-gray-800 hover:text-brand-navy"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
                <a
                  href="tel:9348783051"
                  className="flex items-center gap-2 text-sm text-brand-navy font-semibold"
                >
                  <Phone className="w-4 h-4" /> Call: +91 93487 83051
                </a>
                <a
                  href="mailto:tejaselevatorengineering@gmail.com"
                  className="flex items-center gap-2 text-xs text-gray-600 truncate"
                >
                  <Mail className="w-3.5 h-3.5" /> tejaselevatorengineering@gmail.com
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
