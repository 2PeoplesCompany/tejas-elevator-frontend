import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Mail,
  ArrowRight,
  MapPin,
  Building2,
  Navigation,
} from "lucide-react";
import CompanyGalleryCarousel from "@/components/CompanyGalleryCarousel";
import { getMediaUrl } from "@/lib/media";

export const metadata = {
  title: "About Us | Tejas Elevator Engineering",
  description:
    "Learn about Tejas Elevator Engineering, our leadership, and mission for vertical mobility excellence.",
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Header with Background Image and Gradient Overlay */}
      <section className="relative text-white py-20 lg:py-28 overflow-hidden border-b border-gray-800">
        <Image
          src={getMediaUrl("/images/cuttack-facility-drone.jpg")}
          alt="Tejas Elevator Engineering Headquarters & Central Operations"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-700 bg-gray-900/80 text-xs font-mono tracking-wider uppercase text-gray-300 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-navy"></span>
              Our Story & Leadership
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
              Engineering Reliability. Elevating Trust.
            </h1>
            <p className="text-gray-100 text-base sm:text-lg leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Tejas Elevator Engineering was established to provide precision-manufactured, safety-certified
              vertical transportation with direct engineering accountability and transparent service.
            </p>
          </div>
        </div>
      </section>

      {/* Main Narrative & Philosophy */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-mono uppercase tracking-widest text-brand-navy font-semibold">
              Who We Are
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-black leading-tight">
              A Dedicated Engineering Firm with Local Roots and National Standards.
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              In an industry dominated by impersonal corporate conglomerates with rigid dimensions,
              <strong> Tejas Elevator Engineering</strong> delivers the responsiveness and flexibility
              of an engineering-driven partner. We work directly with architects, builders, society
              secretaries, and private villa owners to deliver customized vertical mobility solutions.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Every lift system we assemble is subjected to multi-point statutory safety inspections,
              progressive safety governor tests, and laser-aligned rail verification before hand-over.
            </p>

            <div className="pt-2 border-t border-gray-100 flex items-center gap-6">
              <div>
                <div className="text-2xl font-bold text-black font-mono">ISO 9001:2015</div>
                <div className="text-xs text-gray-500">Certified Standard</div>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div>
                <div className="text-2xl font-bold text-black font-mono">100%</div>
                <div className="text-xs text-gray-500">Laser Rail Alignment</div>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div>
                <div className="text-2xl font-bold text-black font-mono">24/7</div>
                <div className="text-xs text-gray-500">Breakdown Support</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative h-[420px] rounded-2xl overflow-hidden shadow-xl border border-gray-200">
              <Image
                src={getMediaUrl("/images/pmsm-gearless-motor.jpg")}
                alt="Tejas Elevator Engineering - PMSM Gearless Traction Drive Technical Review"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Profile */}
      <section className="py-20 bg-[#f8f9fa] border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-4xl mx-auto bg-white border border-brand-border rounded-2xl p-8 sm:p-12 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 relative h-72 md:h-full min-h-[300px] rounded-xl overflow-hidden bg-gray-100 shadow-md">
              <Image
                src={getMediaUrl("/images/rajiv-kumar-sethi.jpg")}
                alt="Rajiv Kumar Sethi — Head of Engineering Consultation"
                fill
                className="object-cover object-top"
              />
            </div>

            <div className="md:col-span-7 space-y-4">
              <div className="inline-block px-3 py-1 bg-brand-navy/10 text-brand-navy rounded text-xs font-mono font-bold">
                Engineering Leadership Desk
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-black">
                Rajiv Kumar Sethi
              </h3>
              <p className="text-xs text-brand-navy font-semibold font-mono uppercase tracking-wider">
                Head of Engineering Consultation & Operations
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                With comprehensive domain expertise in vertical transportation engineering, Rajiv Kumar Sethi
                personally oversees project feasibility assessments, technical civil shaft drawings,
                statutory safety certifications, and post-installation maintenance quality across all client sites.
              </p>

              <div className="pt-4 border-t border-gray-100 space-y-2 text-xs">
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

              <div className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-navy hover:bg-brand-navy-dark text-white rounded text-xs font-bold transition-colors"
                >
                  <span>Connect for Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company & Team Gallery Carousel */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-brand-navy font-semibold mb-2">
            Company & Team Gallery
          </div>
          <h2 className="text-3xl font-extrabold text-black">
            Inside Our Engineering & Operations
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            A snapshot of our technical personnel, precision workshop assemblies, site installations,
            and completed projects.
          </p>
        </div>

        <CompanyGalleryCarousel />
      </section>

      {/* Registered Headquarters & Operations Facility */}
      <section className="py-20 bg-[#f8f9fa] border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 relative h-[360px] sm:h-[420px] rounded-2xl overflow-hidden shadow-xl border border-gray-200">
              <Image
                src={getMediaUrl("/images/cuttack-facility-drone.jpg")}
                alt="Tejas Elevator Engineering Headquarters & Central Operations Hub in Cuttack, Odisha"
                fill
                className="object-cover object-center"
              />
              <div className="absolute top-4 left-4 bg-brand-navy/90 text-white text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm border border-brand-navy/50">
                Central Operations Facility
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-navy/10 text-brand-navy text-xs font-mono font-bold">
                <Building2 className="w-3.5 h-3.5" />
                <span>Registered Office & Hub</span>
              </div>

              <h2 className="text-3xl font-extrabold text-black leading-tight">
                Our Central Engineering Hub in Cuttack, Odisha
              </h2>

              <p className="text-sm text-gray-600 leading-relaxed">
                Operating from our registered facility in Cuttack, Tejas Elevator Engineering coordinates
                turnkey lift installations, structural shaft framing, laser guide rail alignments, and
                24/7 emergency breakdown dispatches across Cuttack, Bhubaneswar, and all surrounding districts.
              </p>

              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-2 text-xs font-mono">
                <div className="flex items-start gap-2.5 text-brand-navy font-bold text-sm">
                  <MapPin className="w-4 h-4 text-brand-steel mt-0.5 shrink-0" />
                  <span>Official Registered Premises</span>
                </div>
                <div className="text-gray-700 pl-6 space-y-1">
                  <div><strong>Building No./Flat no.:</strong> KHATA NO 657/90 PLOT 1693/2205</div>
                  <div><strong>Name of Premises/Building:</strong> HOUSE NO-J-5</div>
                  <div><strong>ROAD/STREET:</strong> RAJABAGICHA, <strong>CITY:</strong> CUTTACK</div>
                  <div><strong>DISTRICT:</strong> CUTTACK, <strong>STATE:</strong> ODISHA, <strong>PIN CODE:</strong> 753009</div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Rajabagicha+Cuttack+Odisha+753009"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-navy hover:bg-brand-navy-dark text-white rounded text-xs font-bold transition-colors shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>View Location on Google Maps</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
