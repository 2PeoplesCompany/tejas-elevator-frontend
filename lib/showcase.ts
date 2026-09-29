export interface ShowcaseItem {
  id: string;
  publicId: string;
  title: string;
  category: string;
  description: string;
  mediaType: "image" | "video";
  url: string;
  thumbnailUrl: string;
  format?: string;
  bytes?: number;
  duration?: number;
  createdAt: string;
  isCustomUpload: boolean;
}

// 5 Curated default showcase items pre-populating the live carousel
export const DEFAULT_SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: "default-showcase-video-1",
    publicId: "tejas-elevator/showcase/default-video-1",
    title: "Panoramic Glass Elevator in Motion • Smooth PMSM Drive",
    category: "Panoramic & Home Lift",
    description: "High-precision gearless traction delivering smooth acceleration and panoramic shaft view.",
    mediaType: "video",
    url: "https://res.cloudinary.com/su04chgs/video/upload/v1727630000/tejas-elevator/sample-elevator-ride.mp4",
    thumbnailUrl: "/images/glass-atrium-elevator.jpg",
    duration: 18,
    createdAt: new Date().toISOString(),
    isCustomUpload: false,
  },
  {
    id: "default-showcase-img-1",
    publicId: "tejas-elevator/showcase/default-img-1",
    title: "Architectural Capsule Lift with Frameless Glass Panels",
    category: "Capsule Elevators",
    description: "Installed in commercial atrium with 360-degree glass visibility and luxury gold trims.",
    mediaType: "image",
    url: "/images/glass-atrium-elevator.jpg",
    thumbnailUrl: "/images/glass-atrium-elevator.jpg",
    createdAt: new Date().toISOString(),
    isCustomUpload: false,
  },
  {
    id: "default-showcase-img-2",
    publicId: "tejas-elevator/showcase/default-img-2",
    title: "Heavy-Duty Hospital Stretcher Elevator with Smooth Leveling",
    category: "Hospital & Healthcare",
    description: "Engineered with anti-jerk leveling (+/- 2mm) and wide 1200mm automatic telescoping doors.",
    mediaType: "image",
    url: "/images/hospital-elevator.jpg",
    thumbnailUrl: "/images/hospital-elevator.jpg",
    createdAt: new Date().toISOString(),
    isCustomUpload: false,
  },
  {
    id: "default-showcase-img-3",
    publicId: "tejas-elevator/showcase/default-img-3",
    title: "Luxury Villa Hydraulic Home Lift with Champagne Titanium Finish",
    category: "Home & Villa Lifts",
    description: "Ultra-compact pitless home elevator designed for private bungalows and duplexes.",
    mediaType: "image",
    url: "/images/home-elevator.jpg",
    thumbnailUrl: "/images/home-elevator.jpg",
    createdAt: new Date().toISOString(),
    isCustomUpload: false,
  },
  {
    id: "default-showcase-img-4",
    publicId: "tejas-elevator/showcase/default-img-4",
    title: "High-Traffic Commercial Passenger Cabin with Hairline Stainless Steel",
    category: "Passenger Elevators",
    description: "Built for busy office towers with smart destination dispatch and energy-efficient PMSM motor.",
    mediaType: "image",
    url: "/images/passenger-elevator.jpg",
    thumbnailUrl: "/images/passenger-elevator.jpg",
    createdAt: new Date().toISOString(),
    isCustomUpload: false,
  },
];
