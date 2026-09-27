import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Tejas Elevator Engineering | Vertical Mobility & Engineered Lift Systems",
  description:
    "Manufacturer, installer, and maintenance provider of Passenger, Home & Villa, Hospital Stretcher, and Industrial Goods Elevators. ISO 9001:2015 Certified.",
  icons: {
    icon: "/tejas-logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-brand-charcoal antialiased selection:bg-brand-navy selection:text-white flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
