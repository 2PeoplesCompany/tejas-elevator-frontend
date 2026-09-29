"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
  Check,
  X,
  Sparkles,
  Film,
  Camera,
  Play,
  Trash2,
  Plus,
  Maximize2,
} from "lucide-react";
import { MEDIA_CATALOG, ManagedMediaItem } from "@/lib/media-catalog";
import { getMediaUrl } from "@/lib/media";
import { ShowcaseItem, DEFAULT_SHOWCASE_ITEMS } from "@/lib/showcase";
import { getAuthHeaders } from "@/lib/admin-api";

interface LiveVersionInfo {
  version: number;
  format: string;
  url: string;
  updatedAt?: string;
  bytes?: number;
}

const SHOWCASE_CATEGORIES = [
  "Passenger Elevators",
  "Home & Villa Lifts",
  "Hospital Stretcher Lifts",
  "Industrial Goods Lifts",
  "Panoramic & Capsule Lifts",
  "Entrance & Door Systems",
  "Shaft Engineering",
  "General Showcase",
];

export default function AdminMediaManager() {
  // Mode toggle: 'core' = 19 core website assets, 'showcase' = dynamic product carousel feed
  const [mediaMode, setMediaMode] = useState<"core" | "showcase">("core");

  // --------------------------------------------------------------------------
  // Core Website Media (19 assets) State
  // --------------------------------------------------------------------------
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<{ id: string; msg: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<{ id: string; msg: string } | null>(null);
  const [liveVersions, setLiveVersions] = useState<Record<string, LiveVersionInfo>>({});
  const [isSyncing, setIsSyncing] = useState<boolean>(true);
  const [cacheBusters, setCacheBusters] = useState<Record<string, number>>({});
  const [activeItem, setActiveItem] = useState<ManagedMediaItem | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // --------------------------------------------------------------------------
  // Dynamic Product Showcase Feed State
  // --------------------------------------------------------------------------
  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[]>(DEFAULT_SHOWCASE_ITEMS);
  const [loadingShowcase, setLoadingShowcase] = useState<boolean>(false);
  const [showcaseFilter, setShowcaseFilter] = useState<"all" | "image" | "video">("all");
  const [showcaseSearch, setShowcaseSearch] = useState<string>("");

  // Showcase Upload Modal State
  const [isUploadShowcaseOpen, setIsUploadShowcaseOpen] = useState<boolean>(false);
  const [showcaseFile, setShowcaseFile] = useState<File | null>(null);
  const [showcasePreviewUrl, setShowcasePreviewUrl] = useState<string | null>(null);
  const [showcaseTitle, setShowcaseTitle] = useState<string>("");
  const [showcaseCategory, setShowcaseCategory] = useState<string>("Passenger Elevators");
  const [showcaseDescription, setShowcaseDescription] = useState<string>("");
  const [uploadingShowcase, setUploadingShowcase] = useState<boolean>(false);
  const [showcaseError, setShowcaseError] = useState<string | null>(null);
  const [showcaseSuccess, setShowcaseSuccess] = useState<string | null>(null);
  const [deletingShowcaseId, setDeletingShowcaseId] = useState<string | null>(null);
  const [previewModalItem, setPreviewModalItem] = useState<ShowcaseItem | null>(null);
  const showcaseFileInputRef = useRef<HTMLInputElement | null>(null);

  // --------------------------------------------------------------------------
  // Core Asset Sync
  // --------------------------------------------------------------------------
  const fetchLiveVersions = useCallback(async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/admin/upload-media", { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        if (data.versions) {
          setLiveVersions(data.versions);
          if (typeof window !== "undefined") {
            localStorage.setItem("tejas_media_live_versions", JSON.stringify(data.versions));
          }
        }
      }
    } catch (err) {
      console.warn("Failed to fetch live Cloudinary versions:", err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // --------------------------------------------------------------------------
  // Showcase Feed Sync
  // --------------------------------------------------------------------------
  const fetchShowcaseItems = useCallback(async () => {
    setLoadingShowcase(true);
    try {
      const res = await fetch("/api/showcase");
      if (res.ok) {
        const data = await res.json();
        if (data.items && Array.isArray(data.items)) {
          setShowcaseItems(data.items);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch showcase items:", err);
    } finally {
      setLoadingShowcase(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("tejas_media_live_versions");
        if (cached) {
          setLiveVersions(JSON.parse(cached));
        }
      } catch {
        // Ignore JSON parse errors
      }
    }
    fetchLiveVersions();
    fetchShowcaseItems();
  }, [fetchLiveVersions, fetchShowcaseItems]);

  // --------------------------------------------------------------------------
  // Core Filters
  // --------------------------------------------------------------------------
  const filteredCoreItems = MEDIA_CATALOG.filter((item) => {
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

  // --------------------------------------------------------------------------
  // Core Upload Logic
  // --------------------------------------------------------------------------
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

      const authHeaders = getAuthHeaders();
      const res = await fetch("/api/admin/upload-media", {
        method: "POST",
        headers: {
          ...authHeaders,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image.");
      }

      const baseName = activeItem.filename.replace(/\.[^/.]+$/, "");
      const newVersionInfo: LiveVersionInfo = {
        version: data.version,
        format: data.format,
        url: data.url,
        bytes: data.bytes,
      };

      const updatedVersions = {
        ...liveVersions,
        [baseName]: newVersionInfo,
      };
      setLiveVersions(updatedVersions);

      if (typeof window !== "undefined") {
        localStorage.setItem("tejas_media_live_versions", JSON.stringify(updatedVersions));
      }

      setCacheBusters((prev) => ({
        ...prev,
        [activeItem.filename]: Date.now(),
      }));

      setSuccessMessage({
        id: activeItem.id,
        msg: `Photo successfully uploaded to Cloudinary (v${data.version}, ${data.format?.toUpperCase()})! Live across the website.`,
      });

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

  // --------------------------------------------------------------------------
  // Showcase Filter Logic
  // --------------------------------------------------------------------------
  const filteredShowcaseItems = showcaseItems.filter((item) => {
    const matchesFilter = showcaseFilter === "all" || item.mediaType === showcaseFilter;
    const matchesSearch =
      item.title.toLowerCase().includes(showcaseSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(showcaseSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(showcaseSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // --------------------------------------------------------------------------
  // Showcase Upload Logic (Photos & Videos)
  // --------------------------------------------------------------------------
  const handleShowcaseFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isImg = file.type.startsWith("image/");
      const isVid = file.type.startsWith("video/");

      if (!isImg && !isVid) {
        alert("Please select a valid image (JPG, PNG, WebP) or video file (MP4, WebM).");
        return;
      }

      setShowcaseFile(file);
      setShowcasePreviewUrl(URL.createObjectURL(file));

      // Auto-populate title if empty
      if (!showcaseTitle) {
        const cleanName = file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        setShowcaseTitle(cleanName);
      }
    }
  };

  const handleUploadShowcaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showcaseFile || !showcaseTitle.trim()) {
      setShowcaseError("Please select a file and provide a title.");
      return;
    }

    setUploadingShowcase(true);
    setShowcaseError(null);
    setShowcaseSuccess(null);

    try {
      const formData = new FormData();
      formData.append("file", showcaseFile);
      formData.append("title", showcaseTitle.trim());
      formData.append("category", showcaseCategory.trim());
      formData.append("description", showcaseDescription.trim());

      const authHeaders = getAuthHeaders();
      const res = await fetch("/api/showcase", {
        method: "POST",
        headers: {
          ...authHeaders,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload showcase item.");
      }

      // Prepend newly uploaded item to showcase state immediately
      if (data.item) {
        setShowcaseItems((prev) => [data.item, ...prev]);
      }

      setShowcaseSuccess(`Successfully uploaded "${showcaseTitle}" to the Products carousel!`);

      setTimeout(() => {
        setIsUploadShowcaseOpen(false);
        setShowcaseFile(null);
        setShowcasePreviewUrl(null);
        setShowcaseTitle("");
        setShowcaseDescription("");
        setShowcaseSuccess(null);
      }, 1500);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to upload showcase media.";
      setShowcaseError(errorMsg);
    } finally {
      setUploadingShowcase(false);
    }
  };

  // --------------------------------------------------------------------------
  // Showcase Delete & Restore Logic
  // --------------------------------------------------------------------------
  const handleDeleteShowcase = async (item: ShowcaseItem) => {
    const isDefault = !item.isCustomUpload;
    const cleanTitle = item.title.replace(/^\d+[-_]/, "");
    const confirmed = window.confirm(
      `Are you sure you want to remove "${cleanTitle}" from the live Products page carousel?`
    );
    if (!confirmed) return;

    setDeletingShowcaseId(item.id);
    try {
      const authHeaders = getAuthHeaders();
      const res = await fetch("/api/showcase", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify({
          id: item.id,
          publicId: item.publicId,
          mediaType: item.mediaType,
          isDefault: isDefault,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete showcase item.");
      }

      setShowcaseItems((prev) => prev.filter((i) => i.id !== item.id && i.publicId !== item.publicId));
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete item.";
      alert(errorMsg);
    } finally {
      setDeletingShowcaseId(null);
    }
  };

  const handleRestoreDefaults = async () => {
    const confirmed = window.confirm("Restore all default sample elevator photos and video to the carousel?");
    if (!confirmed) return;

    try {
      const authHeaders = getAuthHeaders();
      const formData = new FormData();
      formData.append("action", "restore_defaults");
      const res = await fetch("/api/showcase", {
        method: "POST",
        headers: {
          ...authHeaders,
        },
        body: formData,
      });
      if (res.ok) {
        fetchShowcaseItems();
      }
    } catch (err) {
      console.warn("Failed to restore defaults:", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Media Manager Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-brand-navy-dark to-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-steel/20 border border-brand-steel/30 text-xs font-mono text-brand-steel">
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Cloudinary CDN Media &amp; Product Showcase Manager</span>
            </div>
            {mediaMode === "core" ? (
              <button
                onClick={fetchLiveVersions}
                disabled={isSyncing}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs text-white transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
                <span>{isSyncing ? "Syncing..." : "Sync Live Versions"}</span>
              </button>
            ) : (
              <button
                onClick={fetchShowcaseItems}
                disabled={loadingShowcase}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs text-white transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${loadingShowcase ? "animate-spin" : ""}`} />
                <span>{loadingShowcase ? "Refreshing..." : "Refresh Feed"}</span>
              </button>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Website Media &amp; Product Showcase Manager
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Manage your static website assets and the live product showcase carousel (photos &amp; video clips) displayed on the Products page.
          </p>
        </div>
      </div>

      {/* TOP TOGGLE: Option A - Core Website Photos vs Product Showcase Feed */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 sm:p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-md">
        <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
          <button
            onClick={() => setMediaMode("core")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              mediaMode === "core"
                ? "bg-brand-navy text-white shadow-md border border-brand-steel/40"
                : "bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/50"
            }`}
          >
            <ImageIcon className="w-4 h-4 text-brand-steel" />
            <span>Core Website Photos</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/20 text-white">
              19
            </span>
          </button>

          <button
            onClick={() => setMediaMode("showcase")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              mediaMode === "showcase"
                ? "bg-brand-navy text-white shadow-md border border-brand-steel/40"
                : "bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/50"
            }`}
          >
            <Film className="w-4 h-4 text-rose-400" />
            <span>Product Showcase Feed</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/20 text-white">
              {showcaseItems.length}
            </span>
          </button>
        </div>

        {/* Action Button for Showcase */}
        {mediaMode === "showcase" && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleRestoreDefaults}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium rounded-xl text-xs transition-all border border-slate-700 flex items-center gap-1.5 shadow-sm"
              title="Restore built-in sample photos if any were deleted"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>Restore Samples</span>
            </button>
            <button
              onClick={() => {
                setIsUploadShowcaseOpen(true);
                setShowcaseFile(null);
                setShowcasePreviewUrl(null);
                setShowcaseError(null);
                setShowcaseSuccess(null);
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-brand-navy to-blue-700 hover:from-brand-navy-dark hover:to-blue-800 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 border border-brand-steel/40 shrink-0"
            >
              <Plus className="w-4 h-4 text-brand-steel" />
              <span>Upload New Photo / Video</span>
            </button>
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* VIEW 1: CORE WEBSITE PHOTOS (19 Static Assets)                       */}
      {/* ==================================================================== */}
      {mediaMode === "core" && (
        <div className="space-y-6">
          {/* Categories & Filter Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                    selectedCategory === cat.id
                      ? "bg-brand-navy text-white shadow-md font-semibold border border-brand-steel/40"
                      : "bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/50"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      selectedCategory === cat.id ? "bg-white/20 text-white" : "bg-slate-900 text-slate-400"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by photo name, description, section, or filename..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-800 rounded-lg text-xs bg-slate-950/70 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-steel/50 focus:border-brand-steel/50 transition-all"
              />
            </div>
          </div>

          {/* Media Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoreItems.map((item) => {
              const baseName = item.filename.replace(/\.[^/.]+$/, "");
              const liveInfo = liveVersions[baseName];
              const timestamp = cacheBusters[item.filename] || "";
              const rawUrl = liveInfo?.url || getMediaUrl(item.filename);
              const liveImageUrl = timestamp ? `${rawUrl}?t=${timestamp}` : rawUrl;

              return (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  {/* Image Preview Area */}
                  <div className="relative h-48 w-full bg-slate-950 overflow-hidden group">
                    <Image
                      src={liveImageUrl}
                      alt={item.title}
                      fill
                      unoptimized={true}
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-black/75 backdrop-blur-md border border-white/20 text-white rounded text-[10px] font-mono uppercase">
                        {item.categoryLabel}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {liveInfo?.format && (
                          <span className="px-1.5 py-0.5 bg-emerald-600/90 text-white rounded text-[9px] font-mono uppercase font-bold">
                            {liveInfo.format}
                          </span>
                        )}
                        <span className="px-2 py-0.5 bg-brand-navy/90 text-white rounded text-[10px] font-mono border border-white/10">
                          {item.aspectRatio}
                        </span>
                      </div>
                    </div>

                    {/* Bottom filename overlay */}
                    <div className="absolute bottom-2 left-3 right-3 text-white">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-slate-300 truncate">
                          tejas-elevator/{item.filename}
                        </span>
                        {liveInfo?.version && (
                          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/60">
                            v{liveInfo.version}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-white text-sm leading-snug">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-800">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Live Placement:</span>
                        <Link
                          href={item.pageRoute}
                          target="_blank"
                          className="font-medium text-brand-steel hover:text-white transition-colors flex items-center gap-1"
                        >
                          <span>{item.appearsOn}</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>

                      {/* Success Message Banner */}
                      {successMessage?.id === item.id && (
                        <div className="p-2.5 bg-emerald-950/60 border border-emerald-800/80 rounded-lg text-emerald-300 text-[11px] flex items-center gap-1.5 animate-in fade-in">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <span className="leading-tight">{successMessage.msg}</span>
                        </div>
                      )}

                      {/* Action Button */}
                      <button
                        onClick={() => handleOpenUpload(item)}
                        className="w-full py-2 px-3 bg-slate-800 hover:bg-brand-navy text-slate-200 hover:text-white border border-slate-700/80 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm"
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
          {filteredCoreItems.length === 0 && (
            <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-xl">
              <ImageIcon className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No media items found</h3>
              <p className="text-xs text-slate-400 mt-1">
                Try searching with a different keyword or select another category filter.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* VIEW 2: PRODUCT SHOWCASE FEED (Dynamic Photos & Videos)               */}
      {/* ==================================================================== */}
      {mediaMode === "showcase" && (
        <div className="space-y-6">
          {/* Showcase Filter & Search Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Media Type Filter */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowcaseFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    showcaseFilter === "all"
                      ? "bg-brand-navy text-white shadow-md border border-brand-steel/40"
                      : "bg-slate-800 text-slate-300 border border-slate-700/50"
                  }`}
                >
                  All Showcase Media ({showcaseItems.length})
                </button>

                <button
                  onClick={() => setShowcaseFilter("image")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    showcaseFilter === "image"
                      ? "bg-brand-navy text-white shadow-md border border-brand-steel/40"
                      : "bg-slate-800 text-slate-300 border border-slate-700/50"
                  }`}
                >
                  <Camera className="w-3.5 h-3.5 text-brand-steel" />
                  <span>Photos ({showcaseItems.filter((i) => i.mediaType === "image").length})</span>
                </button>

                <button
                  onClick={() => setShowcaseFilter("video")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    showcaseFilter === "video"
                      ? "bg-brand-navy text-white shadow-md border border-brand-steel/40"
                      : "bg-slate-800 text-slate-300 border border-slate-700/50"
                  }`}
                >
                  <Film className="w-3.5 h-3.5 text-rose-400" />
                  <span>Videos ({showcaseItems.filter((i) => i.mediaType === "video").length})</span>
                </button>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                Placement: <span className="text-white font-semibold">/products (Carousel Section)</span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search showcase by title, tag, or description..."
                value={showcaseSearch}
                onChange={(e) => setShowcaseSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-800 rounded-lg text-xs bg-slate-950/70 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-steel/50 focus:border-brand-steel/50 transition-all"
              />
            </div>
          </div>

          {/* Showcase Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShowcaseItems.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                {/* Visual Thumbnail Area */}
                <div
                  onClick={() => setPreviewModalItem(item)}
                  className="relative h-48 w-full bg-slate-950 overflow-hidden group cursor-pointer"
                >
                  <Image
                    src={item.thumbnailUrl}
                    alt={item.title}
                    fill
                    unoptimized={true}
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-black/75 backdrop-blur-md border border-white/20 text-white rounded text-[10px] font-mono uppercase flex items-center gap-1">
                      {item.mediaType === "video" ? (
                        <>
                          <Film className="w-3 h-3 text-rose-400" />
                          <span>VIDEO</span>
                        </>
                      ) : (
                        <>
                          <Camera className="w-3 h-3 text-brand-steel" />
                          <span>PHOTO</span>
                        </>
                      )}
                    </span>

                    <span className="px-2 py-0.5 bg-brand-navy/90 text-white rounded text-[10px] font-mono border border-white/10">
                      {item.category}
                    </span>
                  </div>

                  {/* Centered Play Button if Video */}
                  {item.mediaType === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-brand-navy/90 text-white border-2 border-white/30 backdrop-blur-md flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 text-white ml-0.5 fill-white" />
                      </div>
                    </div>
                  )}

                  {/* Bottom Meta */}
                  <div className="absolute bottom-2 left-3 right-3 text-white flex items-center justify-between text-[10px] font-mono text-slate-300">
                    <span>{item.isCustomUpload ? "Custom Upload" : "Sample Installation"}</span>
                    {item.duration && <span>{item.duration}s</span>}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-white text-sm leading-snug line-clamp-2">
                      {item.title.replace(/^\d+[-_]/, "")}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-800">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Live on Carousel</span>
                      </span>
                      <button
                        onClick={() => setPreviewModalItem(item)}
                        className="text-brand-steel hover:text-white flex items-center gap-1 font-medium transition-colors"
                      >
                        <Maximize2 className="w-3 h-3" />
                        <span>Preview</span>
                      </button>
                    </div>

                    {/* Actions: Delete Button for All Items */}
                    <button
                      onClick={() => handleDeleteShowcase(item)}
                      disabled={deletingShowcaseId === item.id}
                      className="w-full py-2 px-3 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-white border border-rose-800/60 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50"
                      title={item.isCustomUpload ? "Delete uploaded photo from Cloudinary & carousel" : "Remove sample photo from live carousel"}
                    >
                      {deletingShowcaseId === item.id ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Removing...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                          <span>Delete From Carousel</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredShowcaseItems.length === 0 && (
            <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-xl">
              <Film className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No showcase media found</h3>
              <p className="text-xs text-slate-400 mt-1">
                Click &quot;+ Upload New Photo / Video&quot; above to add new product media.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 1: CORE PHOTO REPLACEMENT MODAL                                */}
      {/* ==================================================================== */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-800 text-white">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div>
                <h3 className="text-sm font-bold text-white">Replace Website Photo</h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  Target: tejas-elevator/{activeItem.filename}
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveItem(null);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-white">{activeItem.title}</div>
                <div className="text-[11px] text-slate-400 leading-relaxed">
                  Recommended format: {activeItem.aspectRatio} (JPG, PNG, or WebP).
                </div>
              </div>

              {/* Upload Drop Zone / Picker */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                  previewUrl
                    ? "border-brand-steel bg-brand-navy/20"
                    : "border-slate-700 hover:border-brand-steel/60 hover:bg-slate-800/50 bg-slate-950/50"
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
                    <div className="relative h-44 w-full rounded-lg overflow-hidden border border-brand-steel/40 shadow-inner">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        unoptimized={true}
                        className="object-cover object-center"
                      />
                    </div>
                    <div className="text-xs text-slate-300 font-medium">
                      Selected: <span className="font-mono text-brand-steel">{selectedFile?.name}</span> ({(selectedFile?.size || 0) / 1024 > 1024 ? `${((selectedFile?.size || 0) / 1024 / 1024).toFixed(2)} MB` : `${Math.round((selectedFile?.size || 0) / 1024)} KB`})
                    </div>
                    <span className="text-[11px] text-brand-steel underline hover:text-white">Click to choose a different photo</span>
                  </div>
                ) : (
                  <div className="space-y-2 py-4">
                    <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 text-brand-steel flex items-center justify-center mx-auto">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-semibold text-white">
                      Click to browse or drag &amp; drop your image here
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Supports JPG, PNG, WebP (Max 10 MB)
                    </div>
                  </div>
                )}
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-lg text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage.msg}</span>
                </div>
              )}

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-[11px] text-slate-300 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-brand-steel flex-shrink-0 mt-0.5" />
                <span>
                  Uploading invalidates Cloudinary CDN caches and generates a new version (v...). Both this admin panel and public visitors will immediately load the newly uploaded photo.
                </span>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setActiveItem(null);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                disabled={Boolean(uploadingId)}
                className="px-4 py-2 border border-slate-700 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadSubmit}
                disabled={!selectedFile || Boolean(uploadingId)}
                className="px-5 py-2 bg-brand-navy hover:bg-brand-navy-dark text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed border border-brand-steel/30"
              >
                {uploadingId ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading &amp; Invalidating CDN...</span>
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

      {/* ==================================================================== */}
      {/* MODAL 2: UPLOAD NEW SHOWCASE MEDIA (PHOTOS & VIDEOS)                 */}
      {/* ==================================================================== */}
      {isUploadShowcaseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-800 text-white flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div>
                <h3 className="text-sm font-bold text-white">Upload to Product Showcase Carousel</h3>
                <p className="text-[11px] text-slate-400">
                  Upload a photo (JPG, PNG, WebP) or video clip (MP4, WebM) to display on the live Products page.
                </p>
              </div>
              <button
                onClick={() => setIsUploadShowcaseOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUploadShowcaseSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              {showcaseError && (
                <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{showcaseError}</span>
                </div>
              )}

              {showcaseSuccess && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{showcaseSuccess}</span>
                </div>
              )}

              {/* Media File Picker & Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Select Photo or Video File *
                </label>
                <div
                  onClick={() => showcaseFileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                    showcasePreviewUrl
                      ? "border-brand-steel bg-brand-navy/20"
                      : "border-slate-700 hover:border-brand-steel/60 hover:bg-slate-800/50 bg-slate-950/50"
                  }`}
                >
                  <input
                    ref={showcaseFileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                    onChange={handleShowcaseFileChange}
                    className="hidden"
                  />

                  {showcasePreviewUrl ? (
                    <div className="space-y-3 w-full flex flex-col items-center">
                      <div className="relative h-44 w-full rounded-lg overflow-hidden border border-brand-steel/40 bg-black flex items-center justify-center">
                        {showcaseFile?.type.startsWith("video/") ? (
                          <video
                            src={showcasePreviewUrl}
                            controls
                            className="max-h-44 w-full object-contain"
                          />
                        ) : (
                          <Image
                            src={showcasePreviewUrl}
                            alt="Showcase Preview"
                            fill
                            unoptimized={true}
                            className="object-cover object-center"
                          />
                        )}
                      </div>
                      <div className="text-xs text-slate-300 font-medium">
                        Selected: <span className="font-mono text-brand-steel">{showcaseFile?.name}</span> ({(showcaseFile?.size || 0) / 1024 > 1024 ? `${((showcaseFile?.size || 0) / 1024 / 1024).toFixed(2)} MB` : `${Math.round((showcaseFile?.size || 0) / 1024)} KB`})
                      </div>
                      <span className="text-[11px] text-brand-steel underline hover:text-white">
                        Click to choose a different file
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2 py-3">
                      <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 text-brand-steel flex items-center justify-center mx-auto">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div className="text-xs font-semibold text-white">
                        Click to browse photo or video file
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Supports JPG, PNG, WebP or MP4, WebM (Direct Upload)
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Title Field */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Showcase Title *
                </label>
                <input
                  type="text"
                  required
                  value={showcaseTitle}
                  onChange={(e) => setShowcaseTitle(e.target.value)}
                  placeholder="e.g. Glass Panoramic Lift at Cuttack Corporate Hub"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-steel/50 focus:border-brand-steel"
                />
              </div>

              {/* Category Field */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Product Category / Tag *
                </label>
                <select
                  value={showcaseCategory}
                  onChange={(e) => setShowcaseCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-steel/50 focus:border-brand-steel"
                >
                  {SHOWCASE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Description / Specification Notes
                </label>
                <textarea
                  rows={2}
                  value={showcaseDescription}
                  onChange={(e) => setShowcaseDescription(e.target.value)}
                  placeholder="e.g. Hairline stainless steel cabin with smart destination dispatch and whisper-quiet PMSM drive."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-steel/50 focus:border-brand-steel"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!showcaseFile || !showcaseTitle.trim() || uploadingShowcase}
                  className="w-full py-3 bg-brand-navy hover:bg-brand-navy-dark text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed border border-brand-steel/30"
                >
                  {uploadingShowcase ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Uploading to Cloudinary CDN &amp; Publishing Live...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-brand-steel" />
                      <span>Upload &amp; Add to Live Carousel</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 3: PREVIEW LIGHTBOX / VIDEO PLAYER                             */}
      {/* ==================================================================== */}
      {previewModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-steel/20 border border-brand-steel/30 text-brand-steel uppercase">
                  {previewModalItem.mediaType}
                </span>
                <h3 className="font-bold text-white text-sm sm:text-base truncate max-w-md">
                  {previewModalItem.title.replace(/^\d+[-_]/, "")}
                </h3>
              </div>
              <button
                onClick={() => setPreviewModalItem(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative bg-black flex items-center justify-center min-h-[300px] max-h-[70vh]">
              {previewModalItem.mediaType === "video" ? (
                <video
                  src={previewModalItem.url}
                  controls
                  autoPlay
                  className="w-full max-h-[70vh] object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="relative w-full h-[60vh]">
                  <Image
                    src={previewModalItem.url}
                    alt={previewModalItem.title}
                    fill
                    unoptimized={true}
                    className="object-contain"
                  />
                </div>
              )}
            </div>

            <div className="p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="text-xs font-mono text-brand-steel">{previewModalItem.category}</div>
                <div className="text-xs text-slate-300 leading-relaxed">{previewModalItem.description}</div>
              </div>
              <button
                onClick={() => setPreviewModalItem(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold self-end sm:self-center transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
