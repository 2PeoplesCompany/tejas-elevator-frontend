"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Compass,
  Clock,
  Wrench,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { submitAMCRequest } from "@/lib/api";

export default function ServicesPage() {
  const [amcForm, setAmcForm] = useState({
    contactName: "",
    phone: "",
    email: "",
    propertyName: "",
    propertyAddress: "",
    currentLiftsCount: 1,
    planType: "Platinum AMC (Comprehensive 100% Parts)",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleAMCSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const res = await submitAMCRequest(amcForm);
      setStatus({
        success: true,
        message: res.message || "Your AMC inquiry has been submitted successfully!",
      });
      setAmcForm({
        contactName: "",
        phone: "",
        email: "",
        propertyName: "",
        propertyAddress: "",
        currentLiftsCount: 1,
        planType: "Platinum AMC (Comprehensive 100% Parts)",
        message: "",
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to submit request. Please call directly.";
      setStatus({
        success: false,
        message: errorMessage,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Services Hero Header with Background Photo */}
      <section className="relative text-white py-20 lg:py-28 overflow-hidden border-b border-gray-800">
        <Image
          src="/images/technician-service.jpg"
          alt="Certified Engineering Services & AMC"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-600 bg-black/60 backdrop-blur-md text-xs font-mono tracking-wider uppercase text-gray-300">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-steel"></span>
              Lifecycle Support
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
              Certified Engineering Services & AMC
            </h1>
            <p className="text-gray-100 text-base sm:text-lg leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              From day-one civil shaft inspection to round-the-clock emergency maintenance and complete
              controller modernization, we keep vertical transit systems running at peak safety.
            </p>
          </div>
        </div>
      </section>

      {/* 3 Core Services Overview */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-[#f8f9fa] border border-brand-border rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-navy text-white flex items-center justify-center mb-6">
                <Compass className="w-6 h-6 text-brand-steel" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">
                Turnkey Installation & Commissioning
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Comprehensive on-site mechanical alignment and certified electrical integration. We
                handle civil shaft structural checks, laser rail plumbness, hoisting machine mounting,
                and statutory safety load approvals.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-gray-700 font-medium pt-4 border-t border-gray-200">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-navy" /> Laser-aligned guide rail mounting
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-navy" /> Full statutory load-testing certificate
              </li>
            </ul>
          </div>

          <div className="p-8 bg-[#f8f9fa] border border-brand-border rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-navy text-white flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-brand-steel" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">
                Annual Maintenance Contracts (AMC)
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Scheduled multi-point monthly preventative inspections to prevent sudden breakdowns,
                lubricate mechanical gears, test emergency governor interlocks, and ensure total
                passenger safety throughout the year.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-gray-700 font-medium pt-4 border-t border-gray-200">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-navy" /> Comprehensive & Non-Comprehensive plans
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-navy" /> 24/7 Breakdown emergency response
              </li>
            </ul>
          </div>

          <div className="p-8 bg-[#f8f9fa] border border-brand-border rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-navy text-white flex items-center justify-center mb-6">
                <Wrench className="w-6 h-6 text-brand-steel" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">
                Modernization & Upgrades
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Give aging or jerky elevators a second life. We upgrade obsolete relay controllers to
                modern VFD microprocessor panels, replace worn car frames, and install luxury cabin
                interiors and infrared safety sensors.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-gray-700 font-medium pt-4 border-t border-gray-200">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-navy" /> Up to 40% energy savings with VFD
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-navy" /> Fresh luxury cabin aesthetic overhaul
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* AMC Comparison Matrix */}
      <section className="py-20 bg-white border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-mono uppercase tracking-widest text-brand-navy font-semibold mb-2">
              Maintenance Packages
            </div>
            <h2 className="text-3xl font-extrabold text-[#000000]">
              Annual Maintenance Contract (AMC) Plans
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Transparent, reliable maintenance plans tailored to residential societies, corporate offices,
              and healthcare facilities.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Silver Plan: Basic Maintenance */}
            <div className="bg-[#f8f9fa] border border-brand-border rounded-2xl p-7 shadow-sm flex flex-col justify-between">
              <div>
                <div className="inline-block px-3 py-1 bg-gray-200 rounded text-xs font-mono font-semibold text-gray-700 mb-3">
                  Silver Package
                </div>
                <h3 className="text-xl font-bold text-black mb-1">Silver AMC (Basic Maintenance)</h3>
                <p className="text-xs text-gray-500 mb-6">
                  Essential preventative maintenance, routine servicing, and power inspections for smooth operation.
                </p>

                <div className="text-[11px] font-mono uppercase tracking-wider text-brand-navy font-semibold mb-3">
                  Included In Package:
                </div>
                <ul className="space-y-3 text-xs text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-navy shrink-0 mt-0.5" />
                    <span><strong>Basic Lift Maintenance:</strong> Routine monthly oiling &amp; greasing of mechanical parts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-navy shrink-0 mt-0.5" />
                    <span><strong>Main Power &amp; Electrical Inspection:</strong> Voltage, phase failure &amp; relay safety checks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-navy shrink-0 mt-0.5" />
                    <span><strong>Basic Servicing:</strong> Multi-point elevator leveling, governor &amp; brake checks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-navy shrink-0 mt-0.5" />
                    <span><strong>Customer Contact Support:</strong> Dedicated desk assistance for service logs &amp; status</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-navy shrink-0 mt-0.5" />
                    <span><strong>Emergency Rescue Operations:</strong> 24/7 on-call dispatch for passenger entrapment rescue</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-400">
                    <span className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-[10px] shrink-0 mt-0.5">✕</span>
                    <span>Replacement spare parts billed separately at pre-agreed rates</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 border-t border-gray-200 mt-6">
                <a
                  href="#amc-form"
                  onClick={() =>
                    setAmcForm((prev) => ({
                      ...prev,
                      planType: "Silver AMC (Basic Maintenance)",
                    }))
                  }
                  className="w-full block text-center py-3 bg-white border border-gray-300 hover:border-black text-black text-xs font-bold rounded transition-colors"
                >
                  Choose Silver Plan
                </a>
              </div>
            </div>

            {/* Gold Plan: Semi-Comprehensive / Shared Parts */}
            <div className="bg-[#f8f9fa] border border-brand-border rounded-2xl p-7 shadow-sm flex flex-col justify-between">
              <div>
                <div className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded text-xs font-mono font-semibold mb-3">
                  Gold Package
                </div>
                <h3 className="text-xl font-bold text-black mb-1">Gold AMC (Shared Parts)</h3>
                <p className="text-xs text-gray-500 mb-6">
                  Balanced coverage with all basic services plus shared parts liability between company and building owner.
                </p>

                <div className="text-[11px] font-mono uppercase tracking-wider text-brand-navy font-semibold mb-3">
                  Included In Package:
                </div>
                <ul className="space-y-3 text-xs text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-navy shrink-0 mt-0.5" />
                    <span><strong>Basic Lift Maintenance:</strong> Routine monthly oiling, greasing &amp; mechanical servicing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-navy shrink-0 mt-0.5" />
                    <span><strong>Main Power &amp; Drive Checks:</strong> Electrical power inspection, controller relays &amp; wiring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-navy shrink-0 mt-0.5" />
                    <span><strong>Shared Parts Maintenance:</strong> Routine wear parts replaced by company; major structural parts by owner</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-navy shrink-0 mt-0.5" />
                    <span><strong>Customer Contact Support:</strong> Dedicated engineering communication desk support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-navy shrink-0 mt-0.5" />
                    <span><strong>Emergency Rescue Operations:</strong> 24/7 rapid emergency passenger rescue dispatch</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-navy shrink-0 mt-0.5" />
                    <span>Free breakdown call-outs during working hours</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 border-t border-gray-200 mt-6">
                <a
                  href="#amc-form"
                  onClick={() =>
                    setAmcForm((prev) => ({
                      ...prev,
                      planType: "Gold AMC (Shared Parts Maintenance)",
                    }))
                  }
                  className="w-full block text-center py-3 bg-white border border-gray-300 hover:border-black text-black text-xs font-bold rounded transition-colors"
                >
                  Choose Gold Plan
                </a>
              </div>
            </div>

            {/* Platinum Plan: Comprehensive Full Parts */}
            <div className="bg-white border-2 border-brand-navy rounded-2xl p-7 shadow-lg relative flex flex-col justify-between">
              <div className="absolute -top-3.5 right-6 px-3 py-1 bg-brand-navy text-white text-[11px] font-bold rounded-full uppercase tracking-wider shadow">
                Recommended
              </div>

              <div>
                <div className="inline-block px-3 py-1 bg-brand-navy/10 text-brand-navy rounded text-xs font-mono font-semibold mb-3">
                  Platinum Package
                </div>
                <h3 className="text-xl font-bold text-black mb-1">Platinum AMC (Comprehensive)</h3>
                <p className="text-xs text-gray-500 mb-6">
                  Complete peace-of-mind coverage including all spare parts, electronics, and priority emergency response.
                </p>

                <div className="text-[11px] font-mono uppercase tracking-wider text-brand-navy font-semibold mb-3">
                  Included In Package:
                </div>
                <ul className="space-y-3 text-xs text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-navy shrink-0 mt-0.5" />
                    <span><strong>Basic Lift Maintenance:</strong> Comprehensive monthly oiling, greasing &amp; full alignment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-navy shrink-0 mt-0.5" />
                    <span><strong>Main Power &amp; Drive Systems:</strong> Full inspection of main power, VFD drives &amp; motors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-navy shrink-0 mt-0.5" />
                    <span><strong>100% Spare Parts Replacement:</strong> All electronic boards, motor coils, door locks, sensors covered</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-navy shrink-0 mt-0.5" />
                    <span><strong>Priority Customer Support:</strong> VIP fast-track customer contact support desk</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-navy shrink-0 mt-0.5" />
                    <span><strong>Priority Emergency Rescue:</strong> Highest-priority 24/7 emergency passenger rescue dispatch</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-navy shrink-0 mt-0.5" />
                    <span>Zero unexpected emergency bills for the society or property owner</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 border-t border-gray-200 mt-6">
                <a
                  href="#amc-form"
                  onClick={() =>
                    setAmcForm((prev) => ({
                      ...prev,
                      planType: "Platinum AMC (Comprehensive 100% Parts)",
                    }))
                  }
                  className="w-full block text-center py-3 bg-brand-navy hover:bg-brand-navy-dark text-white text-xs font-bold rounded transition-colors shadow-sm"
                >
                  Choose Platinum Plan
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive AMC Inquiry Form Section */}
      <section id="amc-form" className="py-20 bg-[#f8f9fa] border-t border-brand-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          <div className="bg-white border border-brand-border rounded-2xl p-8 sm:p-12 shadow-sm">
            <div className="max-w-2xl mb-8">
              <div className="text-xs font-mono uppercase tracking-widest text-brand-navy font-semibold mb-1">
                Maintenance Proposal
              </div>
              <h3 className="text-2xl font-extrabold text-black">
                Request an AMC Audit or Maintenance Quotation
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Fill in your elevator details below. Our senior maintenance engineer will inspect your equipment and provide an itemized proposal.
              </p>
            </div>

            {status && (
              <div
                className={`mb-6 p-4 rounded-xl border flex items-center gap-3 text-sm ${
                  status.success
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-red-50 border-red-200 text-red-800"
                }`}
              >
                {status.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                )}
                <span>{status.message}</span>
              </div>
            )}

            <form onSubmit={handleAMCSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase font-mono text-gray-700 mb-1.5">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alok Mishra / Society Secretary"
                    value={amcForm.contactName}
                    onChange={(e) => setAmcForm({ ...amcForm, contactName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-brand-navy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase font-mono text-gray-700 mb-1.5">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 93487 83051"
                    value={amcForm.phone}
                    onChange={(e) => setAmcForm({ ...amcForm, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-brand-navy"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase font-mono text-gray-700 mb-1.5">
                    Property / Society Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Silver Springs Apartments"
                    value={amcForm.propertyName}
                    onChange={(e) => setAmcForm({ ...amcForm, propertyName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-brand-navy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase font-mono text-gray-700 mb-1.5">
                    Number of Existing Lifts
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={amcForm.currentLiftsCount}
                    onChange={(e) =>
                      setAmcForm({ ...amcForm, currentLiftsCount: parseInt(e.target.value, 10) || 1 })
                    }
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded text-sm text-black focus:outline-none focus:border-brand-navy"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase font-mono text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. society@example.com"
                    value={amcForm.email}
                    onChange={(e) => setAmcForm({ ...amcForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-brand-navy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase font-mono text-gray-700 mb-1.5">
                    Preferred AMC Plan
                  </label>
                  <select
                    value={amcForm.planType}
                    onChange={(e) => setAmcForm({ ...amcForm, planType: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded text-sm text-black focus:outline-none focus:border-brand-navy"
                  >
                    <option value="Platinum AMC (Comprehensive 100% Parts)">Platinum AMC (Comprehensive 100% Parts)</option>
                    <option value="Gold AMC (Shared Parts Maintenance)">Gold AMC (Shared Parts Maintenance)</option>
                    <option value="Silver AMC (Basic Maintenance)">Silver AMC (Basic Maintenance)</option>
                    <option value="One-time Audit &amp; Safety Inspection">One-time Audit &amp; Safety Inspection</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase font-mono text-gray-700 mb-1.5">
                  Property Address / City
                </label>
                <input
                  type="text"
                  placeholder="e.g. Main Road, Bhubaneswar"
                  value={amcForm.propertyAddress}
                  onChange={(e) => setAmcForm({ ...amcForm, propertyAddress: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-brand-navy"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-brand-navy hover:bg-brand-navy-dark disabled:opacity-50 text-white font-semibold rounded text-sm transition-all shadow-sm flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span>Registering AMC Request in Backend...</span>
                ) : (
                  <>
                    <span>Submit AMC Audit Request</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
