import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { PRODUCTS_DATA } from "@/lib/products-data";
import { getMediaUrl } from "@/lib/media";

export const metadata = {
  title: "Elevator Products | Tejas Elevator Engineering",
  description:
    "Explore our complete range of Passenger Elevators, Home & Villa Lifts, Hospital Stretcher Lifts, and Industrial Freight Lifts with architectural finishes.",
};

export default function ProductsPage() {
  const doorTypes = [
    {
      name: "Automatic Center Opening",
      desc: "Two panels sliding symmetrically to the left and right. Offers the fastest passenger entry/exit and cleanest symmetry for commercial towers.",
      bestFor: "Commercial Hubs, Corporate Offices, Residential Lobbies",
    },
    {
      name: "Two-Speed Telescopic",
      desc: "Two panels sliding into one side with synchronized speed. Maximizes entrance door width in narrow shafts where center opening cannot fit.",
      bestFor: "Hospital Stretcher Lifts, Compact Apartment Shafts",
    },
    {
      name: "Frameless Glass Swing",
      desc: "Manual or automated architectural glass swing doors providing an airy, panoramic aesthetic for luxury home interiors.",
      bestFor: "Private Villas, Duplex Penthouses, Scenic Atriums",
    },
  ];

  return (
    <div className="bg-white">
      {/* Page Header with Picture Background instead of black */}
      <section className="relative text-white py-20 lg:py-28 overflow-hidden border-b border-gray-800">
        <Image
          src={getMediaUrl("/images/hero-elevator.jpg")}
          alt="Elevator Products Catalog"
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
              Elevator Catalog
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
              Elevator Products Engineered for Every Space
            </h1>
            <p className="text-gray-100 text-base sm:text-lg leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Explore our core elevator models designed for residential elegance, high-traffic commercial
              flow, healthcare delicacy, and industrial strength. Built in full adherence to ISO 9001:2015 &amp; IS 14665 safety codes.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid Reshaped into 2x2 Order */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PRODUCTS_DATA.map((prod) => (
            <div
              key={prod.id}
              id={prod.slug}
              className="bg-[#f8f9fa] border border-brand-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              {/* Product Visual */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-gray-100">
                <Image
                  src={prod.heroImage}
                  alt={prod.title}
                  fill
                  className="object-cover object-center hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-black/75 backdrop-blur-md border border-white/20 text-white rounded-full text-xs font-medium font-mono">
                    {prod.shortTag}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-2xl font-bold text-white tracking-tight drop-shadow-sm">
                    {prod.title}
                  </h2>
                  <p className="text-xs text-gray-200 mt-1 line-clamp-1">{prod.subtitle}</p>
                </div>
              </div>

              {/* Details & Specifications */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-5">{prod.overview}</p>

                  <div className="space-y-2 pt-2 border-t border-gray-200">
                    <div className="text-xs font-mono uppercase tracking-wider text-gray-400 font-semibold mb-2">
                      Key Highlights & Engineering Features
                    </div>
                    {prod.features.slice(0, 3).map((f, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-brand-navy shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                  <Link
                    href={`/products/${prod.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-brand-navy hover:bg-brand-navy-dark px-4 py-2.5 rounded transition-colors"
                  >
                    <span>View Specifications</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href={`/contact?product=${encodeURIComponent(prod.title)}`}
                    className="text-xs font-semibold text-gray-800 hover:text-black bg-white border border-gray-300 hover:border-black px-4 py-2.5 rounded transition-colors"
                  >
                    Request Quote
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Landing Door Configurations */}
      <section className="py-20 bg-[#f8f9fa] border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-2xl mb-12">
            <div className="text-xs font-mono uppercase tracking-widest text-brand-navy font-semibold mb-2">
              Entrance Engineering
            </div>
            <h2 className="text-3xl font-extrabold text-[#000000]">
              Elevator Door Configurations
            </h2>
            <p className="text-brand-muted text-sm mt-2 leading-relaxed">
              We engineer landing and car doors to suit your shaft width, fire ratings, and foot-traffic frequency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {doorTypes.map((door, idx) => (
              <div key={idx} className="p-8 bg-white border border-brand-border rounded-2xl flex flex-col justify-between shadow-sm">
                <div>
                  <div className="w-10 h-10 rounded bg-brand-navy/10 text-brand-navy flex items-center justify-center font-mono font-bold text-sm mb-4">
                    0{idx + 1}
                  </div>
                  <h3 className="text-lg font-bold text-black mb-2">{door.name}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed mb-6">{door.desc}</p>
                </div>
                <div className="pt-4 border-t border-gray-100 text-xs">
                  <span className="font-semibold text-gray-500 block mb-1">Recommended for:</span>
                  <span className="text-brand-navy font-medium">{door.bestFor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
