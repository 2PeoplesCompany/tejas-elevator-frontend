import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#000000] text-gray-400 py-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-gray-800">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white p-1 rounded border border-gray-700 overflow-hidden flex items-center justify-center">
                <Image
                  src="/tejas-logo.jpg"
                  alt="Tejas Elevator Engineering Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div>
                <div className="text-white font-bold tracking-tight text-base font-mono uppercase">
                  Tejas Elevator
                </div>
                <div className="text-xs text-brand-steel tracking-widest uppercase font-semibold">
                  Engineering
                </div>
              </div>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Dedicated vertical mobility engineering firm specializing in home lifts, passenger
              elevators, hospital bed lifts, and industrial freight handlers. Built with certified
              passenger safety and hands-on engineering care.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <ShieldCheck className="w-4 h-4 text-brand-navy" />
              <span>ISO 9001:2015 Certified Manufacturing</span>
            </div>
          </div>

          {/* Products Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-white font-bold">
              Products
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/products/passenger-elevators" className="hover:text-white transition-colors">
                  Passenger Elevators
                </Link>
              </li>
              <li>
                <Link href="/products/home-villa-lifts" className="hover:text-white transition-colors">
                  Home & Villa Lifts
                </Link>
              </li>
              <li>
                <Link href="/products/hospital-stretcher-lifts" className="hover:text-white transition-colors">
                  Hospital Stretcher Lifts
                </Link>
              </li>
              <li>
                <Link href="/products/industrial-goods-lifts" className="hover:text-white transition-colors">
                  Goods & Freight Lifts
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-white font-bold">
              Navigation
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Services & AMC
                </Link>
              </li>
              <li>
                <Link href="/applications" className="hover:text-white transition-colors">
                  Applications
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Request Quote
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Contact Info */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-white font-bold">
              Engineering Consultation Desk
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="text-white font-medium text-sm">Tejas Elevator Engineering</div>
              <div className="text-gray-400">Technical Design & Project Operations</div>
              <div className="flex items-center gap-2 text-gray-300 pt-1">
                <Phone className="w-3.5 h-3.5 text-brand-steel" />
                <a href="tel:9348783051" className="hover:text-white font-mono font-medium">
                  +91 93487 83051
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Mail className="w-3.5 h-3.5 text-brand-steel" />
                <a href="mailto:tejaselevatorengineering@gmail.com" className="hover:text-white font-mono">
                  tejaselevatorengineering@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} Tejas Elevator Engineering. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Clean Architecture & Supabase Backend</span>
            <span>Local Engineering Accountability</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
