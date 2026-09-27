"use client";

import { useState } from "react";
import { submitInquiry } from "@/lib/api";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

interface InquiryFormProps {
  defaultLiftType?: string;
  title?: string;
  subtitle?: string;
}

export default function InquiryForm({
  defaultLiftType = "Passenger Elevators",
  title = "Request an Elevator Project Quote",
  subtitle = "Provide your building requirements below to receive layout recommendations and a formal estimate.",
}: InquiryFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    liftType: defaultLiftType,
    floors: "G + 3 Floors",
    buildingType: "Residential",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const res = await submitInquiry(formData);
      setStatus({
        success: true,
        message: res.message || "Your inquiry has been submitted successfully!",
      });
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        liftType: defaultLiftType,
        floors: "G + 3 Floors",
        buildingType: "Residential",
        message: "",
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to submit inquiry. Please call directly.";
      setStatus({
        success: false,
        message: errorMessage,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f8f9fa] border border-brand-border rounded-xl p-8 sm:p-10 shadow-sm">
      <h3 className="text-xl font-bold text-[#000000] mb-1">{title}</h3>
      <p className="text-xs text-gray-500 mb-6">{subtitle}</p>

      {status && (
        <div
          className={`mb-6 p-4 rounded-lg text-sm border flex items-start gap-3 ${
            status.success
              ? "bg-emerald-50 text-emerald-900 border-emerald-300"
              : "bg-red-50 text-red-900 border-red-300"
          }`}
        >
          {status.success ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          )}
          <span>{status.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase font-mono text-gray-700 mb-1.5">
              Full Name / Company *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. John Doe / Builder Name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-brand-navy"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase font-mono text-gray-700 mb-1.5">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-brand-navy"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase font-mono text-gray-700 mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="e.g. client@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-brand-navy"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase font-mono text-gray-700 mb-1.5">
              Building Type
            </label>
            <select
              value={formData.buildingType}
              onChange={(e) => setFormData({ ...formData, buildingType: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded text-sm text-black focus:outline-none focus:border-brand-navy"
            >
              <option value="Residential">Residential Villa / Apartment</option>
              <option value="Commercial">Commercial / Office Complex</option>
              <option value="Healthcare">Hospital / Healthcare Clinic</option>
              <option value="Industrial">Factory / Warehouse</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase font-mono text-gray-700 mb-1.5">
              Elevator Type Needed
            </label>
            <select
              value={formData.liftType}
              onChange={(e) => setFormData({ ...formData, liftType: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded text-sm text-black focus:outline-none focus:border-brand-navy"
            >
              <option value="Passenger Elevators">Passenger Elevators</option>
              <option value="Home & Villa Lifts">Home & Villa Lifts</option>
              <option value="Hospital & Stretcher Lifts">Hospital & Stretcher Lifts</option>
              <option value="Industrial Goods & Freight Lifts">Industrial Goods & Freight Lifts</option>
              <option value="AMC / Modernization Service">AMC / Modernization Service</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase font-mono text-gray-700 mb-1.5">
              Building Stops / Floors
            </label>
            <select
              value={formData.floors}
              onChange={(e) => setFormData({ ...formData, floors: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded text-sm text-black focus:outline-none focus:border-brand-navy"
            >
              <option value="G + 1 (2 Stops)">G + 1 Floor (2 Stops)</option>
              <option value="G + 2 (3 Stops)">G + 2 Floors (3 Stops)</option>
              <option value="G + 3 (4 Stops)">G + 3 Floors (4 Stops)</option>
              <option value="G + 4 to 6 (5-7 Stops)">G + 4 to 6 Floors</option>
              <option value="G + 7+ (8+ Stops)">G + 7+ High Rise</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase font-mono text-gray-700 mb-1.5">
            Project Notes / Specific Dimensions
          </label>
          <textarea
            rows={3}
            placeholder="Specify shaft dimensions, location, or custom finish preferences if known..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-brand-navy resize-none"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 bg-brand-navy hover:bg-brand-navy-dark disabled:opacity-50 text-white font-semibold rounded text-sm transition-all shadow-sm flex items-center justify-center gap-2"
        >
          {submitting ? (
            <span>Sending Inquiry to Supabase Backend...</span>
          ) : (
            <>
              <span>Submit Elevator Specification Inquiry</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
