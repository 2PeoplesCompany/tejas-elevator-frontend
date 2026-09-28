import { Suspense } from "react";
import Image from "next/image";
import { Phone, Mail, Clock, ShieldCheck, MapPin } from "lucide-react";
import InquiryForm from "@/components/InquiryForm";

export const metadata = {
  title: "Contact & Request Quote | Tejas Elevator Engineering",
  description:
    "Get an elevator project quotation or speak with Rajiv Kumar Sethi at Tejas Elevator Engineering.",
};

export default function ContactPage() {
  return (
    <div className="bg-white">
      {/* Header with Background Photo and Gradient Overlay */}
      <section className="relative text-white py-20 lg:py-28 overflow-hidden border-b border-gray-800">
        <Image
          src="/images/controller-engineering.jpg"
          alt="Contact Tejas Elevator Engineering"
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
              Consultation Desk
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
              Request a Project Quote & Technical Feasibility
            </h1>
            <p className="text-gray-100 text-base sm:text-lg leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Whether you are an architect designing a new building shaft or a society secretary
              benchmarking an AMC contract, our engineering team is here to assist.
            </p>
          </div>
        </div>
      </section>

      {/* Main Form & Contact Information */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Direct Contact Cards */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-brand-navy font-semibold mb-2">
                Consultation Desk
              </div>
              <h2 className="text-3xl font-extrabold text-black">Speak With Our Engineers</h2>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                We respond promptly to all site surveys and design inquiries. Reach out to our lead
                officer directly via phone or email.
              </p>
            </div>

            <div className="bg-[#f8f9fa] border border-brand-border rounded-2xl p-6 sm:p-8 space-y-5">
              <div className="text-xs font-mono uppercase tracking-wider text-gray-500 font-bold">
                Key Contact Officer
              </div>
              <div>
                <h3 className="text-xl font-bold text-black">Rajiv Kumar Sethi</h3>
                <p className="text-xs text-brand-navy font-semibold">Head of Engineering Consultation</p>
                <p className="text-xs text-gray-500">Tejas Elevator Engineering</p>
              </div>

              <div className="pt-3 border-t border-gray-200 space-y-3">
                <a
                  href="tel:9348783051"
                  className="flex items-center gap-3 p-3.5 bg-white border border-brand-border rounded-xl text-sm text-black hover:border-brand-navy transition-colors font-medium group shadow-sm"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-navy/10 text-brand-navy flex items-center justify-center group-hover:bg-brand-navy group-hover:text-white transition-colors shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-500">Direct Phone / Hotline</div>
                    <div className="font-mono font-bold text-sm sm:text-base">+91 93487 83051</div>
                  </div>
                </a>

                <a
                  href="mailto:tejaselevatorengineering@gmail.com"
                  className="flex items-center gap-3 p-3.5 bg-white border border-brand-border rounded-xl text-sm text-black hover:border-brand-navy transition-colors font-medium group shadow-sm"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-navy/10 text-brand-navy flex items-center justify-center group-hover:bg-brand-navy group-hover:text-white transition-colors shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <div className="text-[11px] text-gray-500">Official Project Desk</div>
                    <div className="font-mono text-xs sm:text-sm font-bold truncate">
                      tejaselevatorengineering@gmail.com
                    </div>
                  </div>
                </a>
              </div>
            </div>

            <div className="bg-[#f8f9fa] border border-brand-border rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-brand-navy font-bold">
                <MapPin className="w-4 h-4 text-brand-navy" />
                <span>Registered Office & Operations Hub</span>
              </div>
              <div className="text-xs font-mono text-gray-700 space-y-1 leading-relaxed bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div><span className="text-gray-900 font-bold">Building No./Flat no.:</span> KHATA NO 657/90 PLOT 1693/2205</div>
                <div><span className="text-gray-900 font-bold">Name of Premises/Building:</span> HOUSE NO-J-5</div>
                <div><span className="text-gray-900 font-bold">ROAD/STREET:</span> RAJABAGICHA, <span className="text-gray-900 font-bold">CITY:</span> CUTTACK</div>
                <div><span className="text-gray-900 font-bold">DISTRICT:</span> CUTTACK, <span className="text-gray-900 font-bold">STATE:</span> ODISHA, <span className="text-gray-900 font-bold">PIN CODE:</span> 753009</div>
              </div>
              <div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Rajabagicha+Cuttack+Odisha+753009"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-navy hover:underline"
                >
                  <span>Open Location in Google Maps</span>
                  <span>&rarr;</span>
                </a>
              </div>
            </div>

            <div className="p-6 bg-[#f8f9fa] border border-brand-border rounded-2xl space-y-4">
              <div className="flex items-center gap-3 text-xs text-gray-700">
                <div className="w-8 h-8 rounded-lg bg-brand-navy/10 text-brand-navy flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-black">Operating Hours</div>
                  <div className="text-gray-500">Monday – Saturday: 8:00 AM – 8:00 PM</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-700 pt-3 border-t border-gray-200">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-black">Emergency Support</div>
                  <div className="text-gray-500">24/7 Breakdown Dispatch for Active AMC Clients</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <Suspense fallback={<div className="p-8 text-center text-sm">Loading inquiry form...</div>}>
              <InquiryForm
                title="Elevator Specification & Quote Builder"
                subtitle="Your requirement will be registered in our database, and Rajiv Kumar Sethi will connect with you."
              />
            </Suspense>
          </div>
        </div>
      </section>
    </div>
  );
}
