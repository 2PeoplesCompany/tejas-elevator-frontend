import { getMediaUrl } from "./media";

export interface ProductItem {
  id: string;
  slug: string;
  title: string;
  shortTag: string;
  subtitle: string;
  heroImage: string;
  galleryImages: string[];
  overview: string;
  features: string[];
  architecturalBenefits: string[];
  cabinFinishes: string[];
  safetySystems: string[];
  idealFor: string[];
}

export const PRODUCTS_DATA: ProductItem[] = [
  {
    id: "passenger-elevators",
    slug: "passenger-elevators",
    title: "Passenger Elevators",
    shortTag: "Residential & Commercial",
    subtitle: "Smooth, whisper-quiet vertical transit engineered for daily passenger comfort",
    heroImage: getMediaUrl("/images/passenger-elevator.jpg"),
    galleryImages: [
      getMediaUrl("/images/passenger-elevator.jpg"),
      getMediaUrl("/images/hero-elevator.jpg"),
      getMediaUrl("/images/company-elevator.jpg"),
    ],
    overview:
      "Designed for multi-story residential towers, commercial corporate hubs, and busy shopping complexes. Powered by advanced Permanent Magnet Synchronous Motor (PMSM) gearless drives, delivering whisper-quiet travel, reduced energy consumption, and exceptionally smooth leveling at every floor.",
    features: [
      "Permanent Magnet Synchronous Motor (PMSM) for up to 40% energy reduction",
      "VFD door operator ensuring smooth, quiet, and fast door cycles",
      "Sophisticated microprocessor control with intelligent landing dispatch",
      "Low noise and vibration isolation dampening mounts",
    ],
    architecturalBenefits: [
      "Machine-Room-Less (MRL) design saving precious rooftop space",
      "Flexible shaft dimension adaptability for new or retrofit builds",
      "Wide range of cabin lighting: soft ambient LED panels and spot downlights",
    ],
    cabinFinishes: [
      "Hairline Stainless Steel (SS 304)",
      "Mirror Gold & Rose Gold PVD Titanium Coating",
      "Panoramic Glass with Stainless Steel Structural Trims",
      "Scratch-resistant laminate wood-grain inserts",
    ],
    safetySystems: [
      "Integrated Automatic Rescue Device (ARD) during power outages",
      "Full-height infrared multi-beam door safety light curtains",
      "Overspeed governor with progressive instantaneous mechanical safety gear",
      "Bi-directional intercom and emergency alarm",
    ],
    idealFor: [
      "Residential Apartment Complexes",
      "Corporate Towers & Offices",
      "Retail Centers & Shopping Malls",
      "Hotels & Hospitality Complexes",
    ],
  },
  {
    id: "home-villa-lifts",
    slug: "home-villa-lifts",
    title: "Home & Villa Lifts",
    shortTag: "Bungalows & Duplexes",
    subtitle: "Custom luxury vertical mobility tailored for private residences and villas",
    heroImage: getMediaUrl("/images/home-elevator.jpg"),
    galleryImages: [
      getMediaUrl("/images/home-elevator.jpg"),
      getMediaUrl("/images/company-elevator.jpg"),
      getMediaUrl("/images/hero-elevator.jpg"),
    ],
    overview:
      "Transform your home living experience with custom-crafted residential elevators. Designed with minimal civil requirements, shallow pit depth, and whisper-silent operation, our home lifts integrate harmoniously into existing stairwells or dedicated glass shafts.",
    features: [
      "Ultra-compact pit requirement starting from just 200 mm",
      "Single-phase (220V standard household) or three-phase power support",
      "Whisper-quiet acoustic damping operating under 48 dB",
      "Manual swing glass doors or automatic luxury telescopic doors",
    ],
    architecturalBenefits: [
      "Requires no bulky rooftop machine room",
      "Panoramic 360-degree glass cabin options for natural light flow",
      "Tailor-made cabin sizes designed down to the millimeter for custom villa layouts",
    ],
    cabinFinishes: [
      "Full Toughened Glass Panoramic Enclosure",
      "Champagne Bronze Stainless Steel Finish",
      "Custom Italian Marble Flooring inserts",
      "Touchless capacitive floor call buttons",
    ],
    safetySystems: [
      "Automatic battery-operated lower-floor descent during power interruption",
      "Emergency manual release hand-pump (Hydraulic) or manual brake release",
      "Child safety lock and key-switch cabin control",
      "Emergency GSM auto-dialer for immediate family contact",
    ],
    idealFor: [
      "Luxury Independent Villas",
      "Duplex & Triplex Homes",
      "Row Houses & Penthouses",
      "Senior Citizen Home Accessibility",
    ],
  },
  {
    id: "hospital-stretcher-lifts",
    slug: "hospital-stretcher-lifts",
    title: "Hospital & Stretcher Lifts",
    shortTag: "Healthcare & Care Facilities",
    subtitle: "Ultra-smooth precision leveling designed for patient care and stretcher mobility",
    heroImage: getMediaUrl("/images/hospital-elevator.jpg"),
    galleryImages: [
      getMediaUrl("/images/hospital-elevator.jpg"),
      getMediaUrl("/images/passenger-elevator.jpg"),
      getMediaUrl("/images/technician-service.jpg"),
    ],
    overview:
      "Engineered specifically for medical centers, hospitals, and nursing homes where passenger stability and equipment protection are paramount. Features extra-deep cabins to transport patient stretchers, beds, and intensive medical equipment with ±2 mm precision leveling to prevent transfer jolts.",
    features: [
      "Extended cabin depth (2400 mm+) accommodating full-size hospital beds and attendants",
      "Micro-leveling precision (±2 mm) ensuring bump-free stretcher wheel roll-in",
      "Wide center-opening and two-speed telescopic doors for unhindered transit",
      "Emergency Code Blue medical priority key switch for urgent floor recall",
    ],
    architecturalBenefits: [
      "Seamless integration with hospital fire alarm and building management systems",
      "Heavy-duty protective stainless steel bumper rails on all internal cabin walls",
      "Antibacterial easy-to-sanitize wall panel materials",
    ],
    cabinFinishes: [
      "Hygienic Anti-Bacterial Stainless Steel (SS 304 / 316)",
      "High-durability vinyl hospital flooring",
      "Flush-mounted control operating panels with braille buttons",
      "Full-width glare-free medical ceiling illumination",
    ],
    safetySystems: [
      "Automatic Rescue Device (ARD) with medical priority evacuation",
      "Infrared light curtain preventing door closure on moving stretchers",
      "Dual emergency communication link directly to hospital control room",
      "Phase failure and voltage fluctuation safety relays",
    ],
    idealFor: [
      "Multi-Specialty Hospitals",
      "Nursing Homes & Care Centers",
      "Medical Diagnostic & Imaging Facilities",
      "Day-Surgery Clinics",
    ],
  },
  {
    id: "industrial-goods-lifts",
    slug: "industrial-goods-lifts",
    title: "Industrial Goods & Freight Lifts",
    shortTag: "Factories & Warehouses",
    subtitle: "Heavy-duty vertical load handlers built for grueling industrial cycles",
    heroImage: getMediaUrl("/images/industrial-elevator.jpg"),
    galleryImages: [
      getMediaUrl("/images/industrial-elevator.jpg"),
      getMediaUrl("/images/technician-service.jpg"),
      getMediaUrl("/images/hero-elevator.jpg"),
    ],
    overview:
      "Rugged, reliable, and powerful vertical freight handlers designed to transport heavy pallet loads, forklift freight, and industrial machinery across factory floors, warehouses, and logistics distribution centers.",
    features: [
      "Heavy load-bearing capacity from 500 kg up to 5000+ kg",
      "Reinforced structural channel and I-beam sling assembly",
      "Durable chequered anti-skid steel floor plating",
      "High-torque heavy geared traction or heavy dual-hydraulic drives",
    ],
    architecturalBenefits: [
      "Motorized bi-parting vertical doors or heavy collapsible steel gates",
      "Custom cabin dimensions adapted to standard pallet jack clearances",
      "Rugged exterior landing push stations built to endure factory environments",
    ],
    cabinFinishes: [
      "Heavy Chequered Mild Steel / Stainless Steel Floor Plate",
      "Reinforced sheet metal walls with industrial epoxy coating",
      "Impact-resistant corner protectors and heavy side bumpers",
      "Vibration-resistant high-lumen protective cage lighting",
    ],
    safetySystems: [
      "Overload audio-visual sensor alarm preventing dispatch when capacity exceeded",
      "Heavy mechanical safety gear locking car instantly during overspeed",
      "Door interlocks preventing operation until all gates are completely secured",
      "Phase reversal and slack-rope safety limit switches",
    ],
    idealFor: [
      "Manufacturing & Assembly Plants",
      "E-Commerce & Logistics Hubs",
      "Automobile Showrooms & Service Centers",
      "Cold Storages & Commercial Kitchens",
    ],
  },
];
