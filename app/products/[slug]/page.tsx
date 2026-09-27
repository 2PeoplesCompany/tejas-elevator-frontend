import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Phone,
  Mail,
  Layers,
  Gauge,
  Maximize2,
  Compass,
} from "lucide-react";
import { PRODUCTS_DATA } from "@/lib/products-data";
import InquiryForm from "@/components/InquiryForm";

interface PageProps {
  params: {
    slug: string;
  };
}

interface ProductVariant {
  name: string;
  capacity: string;
  speed: string;
  stops: string;
  pitDepth: string;
  bestSuitedFor: string;
}

const PRODUCT_VARIANTS: Record<string, ProductVariant[]> = {
  "passenger-elevators": [
    {
      name: "Residential Standard (MRL)",
      capacity: "4 to 15 Persons (300 – 1020 kg)",
      speed: "0.5 – 1.5 m/s",
      stops: "Up to 24 Floors and above",
      pitDepth: "1500 mm",
      bestSuitedFor: "Residential complexes, housing societies & high-rise apartment towers",
    },
    {
      name: "Commercial Core (Gearless)",
      capacity: "6 to 18 Persons (450 – 1250 kg)",
      speed: "0.75 – 1.75 m/s",
      stops: "Up to 26+ Floors",
      pitDepth: "1500 – 1600 mm",
      bestSuitedFor: "Commercial complexes, corporate offices, IT parks & retail malls",
    },
    {
      name: "High-Speed Express Tower",
      capacity: "10 to 24 Persons (680 – 1632 kg)",
      speed: "1.5 m/s and above (Up to 2.5 m/s)",
      stops: "30+ Floors High-Rise",
      pitDepth: "1600 – 1800 mm",
      bestSuitedFor: "High-rise commercial towers, multi-tenant corporate headquarters",
    },
  ],
  "home-villa-lifts": [
    {
      name: "Stairwell Compact (Zero Deep Pit)",
      capacity: "2 to 4 Persons (180 – 300 kg)",
      speed: "0.3 – 0.5 m/s",
      stops: "G + 1 to G + 4 Floors",
      pitDepth: "200 – 300 mm (Pitless Option Available)",
      bestSuitedFor: "Retrofitting inside compact stairwells & private duplex homes",
    },
    {
      name: "Panoramic 360° Glass Capsule",
      capacity: "3 to 5 Persons (250 – 400 kg)",
      speed: "0.35 – 0.6 m/s",
      stops: "G + 2 to G + 5 Floors",
      pitDepth: "300 – 400 mm",
      bestSuitedFor: "Designer villas, glass atrium centers & luxury residences",
    },
    {
      name: "Prestige Villa / Hydraulic Home Lift",
      capacity: "4 to 8 Persons (320 – 600 kg)",
      speed: "0.4 – 0.75 m/s",
      stops: "G + 2 to G + 6 Floors",
      pitDepth: "400 – 500 mm",
      bestSuitedFor: "Multi-generation family estates & luxury penthouses",
    },
  ],
  "hospital-stretcher-lifts": [
    {
      name: "Compact Clinic & Patient Lift (Small Case)",
      capacity: "4 to 8 Persons / Compact Stretcher (300 – 600 kg)",
      speed: "0.75 – 1.0 m/s",
      stops: "Up to 12 Floors",
      pitDepth: "1400 – 1500 mm",
      bestSuitedFor: "Small clinics, nursing care, compact stretcher transit & day-care centers",
    },
    {
      name: "Hospital Bed & ICU Transport",
      capacity: "15 to 20 Persons / Standard Hospital Bed (1020 – 1360 kg)",
      speed: "1.0 – 1.5 m/s",
      stops: "Up to 18 Floors",
      pitDepth: "1500 mm",
      bestSuitedFor: "Multi-specialty hospitals, emergency wings & trauma centers",
    },
    {
      name: "Heavy Trauma & Emergency Suite",
      capacity: "20 to 26 Persons / Critical Care Bed + Medical Crew (1360 – 1800 kg)",
      speed: "1.25 – 1.75 m/s",
      stops: "Up to 24 Floors",
      pitDepth: "1600 mm",
      bestSuitedFor: "Tertiary medical institutes & major university hospital hubs",
    },
  ],
  "industrial-goods-lifts": [
    {
      name: "Light Duty Goods & Dumbwaiter",
      capacity: "250 – 500 kg",
      speed: "0.25 – 0.5 m/s",
      stops: "Up to 6 Floors",
      pitDepth: "500 mm",
      bestSuitedFor: "Restaurants, retail store stockrooms & small workshops",
    },
    {
      name: "Medium Industrial Cargo Freight",
      capacity: "1000 – 3000 kg",
      speed: "0.35 – 0.75 m/s",
      stops: "Up to 10 Floors",
      pitDepth: "1200 mm",
      bestSuitedFor: "Manufacturing units, warehouses, logistics centers",
    },
    {
      name: "Heavy-Duty Forklift-Rated Freight",
      capacity: "4000 – 5000+ kg",
      speed: "0.35 – 0.5 m/s",
      stops: "Up to 8 Floors",
      pitDepth: "1500 mm",
      bestSuitedFor: "Automotive assembly lines, heavy fabrication & industrial yards",
    },
  ],
};

export function generateStaticParams() {
  return PRODUCTS_DATA.map((prod) => ({
    slug: prod.slug,
  }));
}

export function generateMetadata({ params }: PageProps) {
  const product = PRODUCTS_DATA.find((p) => p.slug === params.slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.title} | Tejas Elevator Engineering`,
    description: product.subtitle,
  };
}

export default function ProductDetailPage({ params }: PageProps) {
  const product = PRODUCTS_DATA.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  const variants = PRODUCT_VARIANTS[product.slug] || [];

  return (
    <div className="bg-white">
      {/* Product Hero Header with Photo & Gradient Overlay */}
      <section className="relative text-white py-20 lg:py-28 overflow-hidden border-b border-gray-800">
        <Image
          src={product.heroImage}
          alt={product.title}
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase text-gray-200 hover:text-white mb-6 transition-colors drop-shadow"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Products</span>
          </Link>

          <div className="max-w-3xl space-y-4">
            <div className="inline-block px-3 py-1 rounded bg-brand-navy text-xs font-mono font-medium text-white shadow-md">
              {product.shortTag}
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">{product.title}</h1>
            <p className="text-gray-100 text-lg leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">{product.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Main Content & Inquiry Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Product Overview, Features & Models/Variants */}
          <div className="lg:col-span-7 space-y-12">
            {/* Primary Hero Photo */}
            <div className="relative h-[360px] sm:h-[440px] rounded-2xl overflow-hidden shadow-lg border border-gray-200">
              <Image
                src={product.heroImage}
                alt={product.title}
                fill
                className="object-cover object-center"
                priority
              />
            </div>

            {/* Overview Section */}
            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-widest text-brand-navy font-semibold">
                Overview & Engineering
              </div>
              <h2 className="text-2xl font-bold text-black">
                Designed for Reliable Daily Performance
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed">{product.overview}</p>
            </div>

            {/* Key Advantages */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-bold text-black flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-navy" />
                <span>Core Performance Features</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.features.map((feat, idx) => (
                  <div key={idx} className="p-4 bg-[#f8f9fa] border border-brand-border rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-brand-navy mb-2" />
                    <p className="text-xs text-gray-800 font-medium leading-relaxed">{feat}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Models & Variants Section */}
            <div className="space-y-6 pt-4 border-t border-gray-200">
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-brand-navy font-semibold mb-1">
                  Configuration Options
                </div>
                <h3 className="text-2xl font-bold text-black">Available Models & Variants</h3>
                <p className="text-xs text-gray-600 mt-1">
                  Select the configuration suited to your building dimensions, traffic flow, and load parameters.
                </p>
              </div>

              <div className="space-y-4">
                {variants.map((v, idx) => (
                  <div
                    key={idx}
                    className="p-6 bg-[#f8f9fa] border border-brand-border rounded-2xl space-y-4 hover:border-brand-navy transition-colors shadow-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-3">
                      <div>
                        <div className="text-[11px] font-mono uppercase tracking-wider text-brand-navy font-semibold">
                          Variant {String(idx + 1).padStart(2, "0")}
                        </div>
                        <h4 className="text-base sm:text-lg font-bold text-black">{v.name}</h4>
                      </div>
                      <span className="px-2.5 py-1 bg-white border border-brand-border rounded text-[11px] font-mono text-gray-600 font-medium">
                        ISO 9001:2015 &amp; IS 14665 Compliant
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center gap-1.5 text-gray-500 text-[11px] mb-1 font-mono">
                          <Maximize2 className="w-3.5 h-3.5 text-brand-navy" />
                          <span>Capacity</span>
                        </div>
                        <div className="font-bold text-gray-900 leading-tight">{v.capacity}</div>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center gap-1.5 text-gray-500 text-[11px] mb-1 font-mono">
                          <Gauge className="w-3.5 h-3.5 text-brand-navy" />
                          <span>Speed</span>
                        </div>
                        <div className="font-bold text-gray-900 leading-tight">{v.speed}</div>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center gap-1.5 text-gray-500 text-[11px] mb-1 font-mono">
                          <Layers className="w-3.5 h-3.5 text-brand-navy" />
                          <span>Stops</span>
                        </div>
                        <div className="font-bold text-gray-900 leading-tight">{v.stops}</div>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center gap-1.5 text-gray-500 text-[11px] mb-1 font-mono">
                          <Compass className="w-3.5 h-3.5 text-brand-navy" />
                          <span>Pit Depth</span>
                        </div>
                        <div className="font-bold text-gray-900 leading-tight">{v.pitDepth}</div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-600 pt-1">
                      <strong className="text-gray-900 font-semibold">Recommended Application: </strong>
                      <span>{v.bestSuitedFor}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Product Quote Form & Direct Assistance */}
          <div className="lg:col-span-5 space-y-8">
            <div className="sticky top-28">
              <InquiryForm
                defaultLiftType={product.title}
                title={`Inquire for ${product.title}`}
                subtitle={`Submit your shaft or floor requirement to receive an engineering feasibility assessment.`}
              />

              <div className="mt-6 p-6 bg-[#f8f9fa] border border-brand-border rounded-xl">
                <div className="text-xs font-mono uppercase tracking-wider text-gray-500 font-bold mb-2">
                  Technical Consultation Desk
                </div>
                <div className="text-sm font-bold text-gray-900">Engineering Consultation Desk</div>
                <div className="text-xs text-brand-navy mb-4">Tejas Elevator Engineering</div>

                <div className="space-y-2 text-xs">
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
          </div>
        </div>
      </section>
    </div>
  );
}
