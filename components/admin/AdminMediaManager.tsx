"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  UploadCloud,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  ExternalLink,
  FolderOpen,
  Info,
  Check,
  X,
} from "lucide-react";
import { MEDIA_CATALOG, ManagedMediaItem } from "@/lib/media-catalog";
import { getMediaUrl } from "@/lib/media";

export default function AdminMediaManager() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<{ id: string; msg: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<{ id: string; msg: string } | null>(null);
  
  // Cache busting map to force image refresh after upload
  const [cacheBusters, setCacheBusters] = useState<Record<string, number>>({});

  // Active replacement modal or selected file state
  const [activeItem, setActiveItem] = useState<ManagedMediaItem | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Filter items
  const filteredItems = MEDIA_CATALOG.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.appearsOn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: "all", label: "All Photos", count: MEDIA_CATALOG.length },
    { id: "hero", label: "Hero Carousel", count: MEDIA_CATALOG.filter((i) => i.category === "hero").length },
    { id: "leadership", label: "Leadership & Hub", count: MEDIA_CATALOG.filter((i) => i.category === "leadership").length },
    { id: "technology", label: "Technology & Safety", count: MEDIA_CATALOG.filter((i) => i.category === "technology").length },
    { id: "products", label: "Product Catalog", count: MEDIA_CATALOG.filter((i) => i.category === "products").length },
    { id: "branding", label: "Branding & Banners", count: MEDIA_CATALOG.filter((i) => i.category === "branding").length },
  ];

  const handleOpenUpload = (item: ManagedMediaItem) => {
    setActiveItem(item);
    setSelectedFile(null);
    setPreviewUrl(null);
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file (JPG, PNG, or WebP).");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUploadSubmit = async () => {
    if (!activeItem || !selectedFile) return;

    setUploadingId(activeItem.id);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("targetFilename", activeItem.filename);

      const res = await fetch("/api/admin/upload-media", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image.");
      }

      // Update cache buster to force image thumbnail reload
      setCacheBusters((prev) => ({
        ...prev,
        [activeItem.filename]: Date.now(),
      }));

      setSuccessMessage({
        id: activeItem.id,
        msg: `Photo successfully updated! Live on ${activeItem.appearsOn}.`,
      });

      // Close modal after brief delay
      setTimeout(() => {
        setActiveItem(null);
        setSelectedFile(null);
        setPreviewUrl(null);
      }, 1500);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to upload image. Please try again.";
      setErrorMessage({
        id: activeItem.id,
        msg: errorMsg,
      });
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Media Manager Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-brand-navy-dark to-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-steel/20 border border-brand-steel/30 text-xs font-mono text-brand-steel">
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Cloudinary Media Manager • Zero Storage Lag</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Manage Website Photos &amp; Banners
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Replace any photo across the website in seconds. All uploads are automatically optimized (WebP/AVIF) and served via Cloudinary CDN with zero credit card risk.
          </p>
        </div>
      </div>

      {/* Categories & Filter Bar */}
      <div className="bg-white border border-brand-border rounded-xl p-5 shadow-sm space-y-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? "bg-brand-navy text-white shadow-md font-semibold"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  selectedCategory === cat.id ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by photo name, description, section, or filename..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-brand-border rounded-lg text-xs bg-gray-50/50 focus:outline-none focus:ring-1 focus:ring-brand-navy focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Media Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const timestamp = cacheBusters[item.filename] || "";
          const liveImageUrl = getMediaUrl(item.filename) + (timestamp ? `?t=${timestamp}` : "");

          return (
            <div
              key={item.id}
              className="bg-white border border-brand-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Image Preview Area */}
              <div className="relative h-48 w-full bg-gray-950 overflow-hidden group">
                <Image
                  src={liveImageUrl}
                  alt={item.title}
                  fill
                  unoptimized={Boolean(timestamp)}
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-black/75 backdrop-blur-md border border-white/20 text-white rounded text-[10px] font-mono uppercase">
                    {item.categoryLabel}
                  </span>
                  <span className="px-2 py-0.5 bg-brand-navy/90 text-white rounded text-[10px] font-mono">
                    {item.aspectRatio}
                  </span>
                </div>

                {/* Bottom filename overlay */}
                <div className="absolute bottom-2 left-3 right-3 text-white">
                  <div className="text-[11px] font-mono text-gray-300 truncate">
                    tejas-elevator/{item.filename}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="font-bold text-gray-900 text-sm leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">Live Placement:</span>
                    <Link
                      href={item.pageRoute}
                      target="_blank"
                      className="font-medium text-brand-navy hover:underline flex items-center gap-1"
                    >
                      <span>{item.appearsOn}</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* Success Message Banner */}
                  {successMessage?.id === item.id && (
                    <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-[11px] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{successMessage.msg}</span>
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    onClick={() => handleOpenUpload(item)}
                    className="w-full py-2 px-3 bg-gray-900 hover:bg-brand-navy text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <UploadCloud className="w-4 h-4 text-brand-steel" />
                    <span>Replace Photo</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-16 bg-white border border-brand-border rounded-xl">
          <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">No media items found</h3>
          <p className="text-xs text-gray-500 mt-1">
            Try searching with a different keyword or select another category filter.
          </p>
        </div>
      )}

      {/* Upload & Replacement Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Replace Website Photo</h3>
                <p className="text-[11px] text-gray-500 font-mono">
                  Target: tejas-elevator/{activeItem.filename}
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveItem(null);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-gray-800">{activeItem.title}</div>
                <div className="text-[11px] text-gray-500 leading-relaxed">
                  Recommended format: {activeItem.aspectRatio} (JPG, PNG, or WebP).
                </div>
              </div>

              {/* Upload Drop Zone / Picker */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                  previewUrl
                    ? "border-brand-navy bg-brand-navy/5"
                    : "border-gray-300 hover:border-brand-navy hover:bg-gray-50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {previewUrl ? (
                  <div className="space-y-3 w-full flex flex-col items-center">
                    <div className="relative h-44 w-full rounded-lg overflow-hidden border border-brand-navy/30 shadow-inner">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-cover object-center"
                      />
                    </div>
                    <div className="text-xs text-gray-700 font-medium">
                      Selected: <span className="font-mono text-brand-navy">{selectedFile?.name}</span> ({(selectedFile?.size || 0) / 1024 > 1024 ? `${((selectedFile?.size || 0) / 1024 / 1024).toFixed(2)} MB` : `${Math.round((selectedFile?.size || 0) / 1024)} KB`})
                    </div>
                    <span className="text-[11px] text-brand-steel underline">Click to choose a different photo</span>
                  </div>
                ) : (
                  <div className="space-y-2 py-4">
                    <div className="w-12 h-12 rounded-full bg-brand-navy/10 text-brand-navy flex items-center justify-center mx-auto">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-semibold text-gray-800">
                      Click to browse or drag &amp; drop your image here
                    </div>
                    <div className="text-[11px] text-gray-400">
                      Supports JPG, PNG, WebP (Max 10 MB)
                    </div>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage.msg}</span>
                </div>
              )}

              {/* Info Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-[11px] text-blue-800 flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>
                  Uploading will immediately overwrite the existing asset in your Cloudinary media storage and purge the CDN edge cache. Visitors will see the new image automatically.
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setActiveItem(null);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                disabled={Boolean(uploadingId)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadSubmit}
                disabled={!selectedFile || Boolean(uploadingId)}
                className="px-5 py-2 bg-brand-navy hover:bg-brand-navy-dark text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadingId ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading to Cloudinary...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Upload &amp; Publish Live</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
