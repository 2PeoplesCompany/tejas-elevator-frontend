"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  MessageSquare,
  Search,
  Filter,
  RefreshCw,
  Download,
  LogOut,
  ExternalLink,
  CheckCircle2,
  Clock,
  Building2,
  Calendar,
  AlertCircle,
  Eye,
  EyeOff,
  Trash2,
  PhoneCall,
  Send,
  Layers,
  Sparkles,
  ArrowRight,
  KeyRound,
  Image as ImageIcon,
} from "lucide-react";
import AdminMediaManager from "@/components/admin/AdminMediaManager";
import {
  checkAdminSetup,
  setupAdmin,
  adminLogin,
  getAdminStats,
  getAdminInquiries,
  updateInquiryStatus,
  deleteInquiryRecord,
  getAdminAMCRequests,
  updateAMCStatus,
  deleteAMCRecord,
  changeAdminPassword,
  updateAdminProfile,
} from "@/lib/admin-api";

interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

interface Inquiry {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  lift_type: string;
  floors: string;
  building_type: string;
  message: string;
  status: string;
  assigned_to: string;
  created_at: string;
}

interface AMCRequest {
  id: string;
  contact_name: string;
  phone: string;
  email: string;
  property_name: string;
  property_address: string;
  current_lifts_count: number;
  plan_type: string;
  message: string;
  status: string;
  created_at: string;
}

interface Stats {
  totalInquiries: number;
  newInquiries: number;
  contactedInquiries: number;
  surveyScheduledInquiries: number;
  quoteSentInquiries: number;
  closedInquiries: number;
  totalAMC: number;
  pendingAMC: number;
  activeAMC: number;
}

const INQUIRY_STATUSES = [
  { value: "new", label: "New Lead", color: "bg-amber-950/80 text-amber-300 border-amber-800/80" },
  { value: "contacted", label: "Contacted", color: "bg-blue-950/80 text-blue-300 border-blue-800/80" },
  { value: "survey_scheduled", label: "Survey Scheduled", color: "bg-purple-950/80 text-purple-300 border-purple-800/80" },
  { value: "quote_sent", label: "Quote Dispatched", color: "bg-indigo-950/80 text-indigo-300 border-indigo-800/80" },
  { value: "finalized", label: "Contract Finalized", color: "bg-emerald-950/80 text-emerald-300 border-emerald-800/80" },
  { value: "closed", label: "Archived / Closed", color: "bg-slate-800 text-slate-300 border-slate-700" },
];

const AMC_STATUSES = [
  { value: "pending", label: "Pending Audit", color: "bg-amber-950/80 text-amber-300 border-amber-800/80" },
  { value: "survey_scheduled", label: "Site Inspection Scheduled", color: "bg-blue-950/80 text-blue-300 border-blue-800/80" },
  { value: "active", label: "Active Contract", color: "bg-emerald-950/80 text-emerald-300 border-emerald-800/80" },
  { value: "completed", label: "Service Completed", color: "bg-purple-950/80 text-purple-300 border-purple-800/80" },
  { value: "cancelled", label: "Archived", color: "bg-slate-800 text-slate-300 border-slate-700" },
];

export default function AdminPage() {
  // Auth state
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);

  // Form states
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("Rajiv Kumar Sethi");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Dashboard Data states
  const [activeTab, setActiveTab] = useState<"inquiries" | "amc" | "media" | "security">("inquiries");
  const [stats, setStats] = useState<Stats | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [amcRequests, setAmcRequests] = useState<AMCRequest[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [savingInquiryId, setSavingInquiryId] = useState<string | null>(null);
  const [savingAmcId, setSavingAmcId] = useState<string | null>(null);

  // 1. Initial Authentication & Setup Check
  useEffect(() => {
    async function initAuth() {
      try {
        const savedSession = localStorage.getItem("tejas_admin_session");
        if (savedSession) {
          const parsed = JSON.parse(savedSession);
          // Ensure both user and valid accessToken are present
          if (parsed && parsed.user && parsed.accessToken) {
            setCurrentUser(parsed.user);
            setIsInitializing(false);
            return;
          } else {
            // Stale or incomplete session without token, clear it
            localStorage.removeItem("tejas_admin_session");
          }
        }

        // If no local session, check if any admin accounts exist in Supabase
        const setupCheck = await checkAdminSetup();
        setNeedsSetup(setupCheck.needsSetup);
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setIsInitializing(false);
      }
    }
    initAuth();
  }, []);

  // 2. Fetch Data when logged in
  const fetchData = useCallback(async () => {
    if (!currentUser) return;
    setLoadingData(true);
    try {
      const [statsRes, inqRes, amcRes] = await Promise.all([
        getAdminStats(),
        getAdminInquiries(statusFilter, searchQuery),
        getAdminAMCRequests(statusFilter, searchQuery),
      ]);
      setStats(statsRes.stats);
      setInquiries(inqRes.inquiries || []);
      setAmcRequests(amcRes.amcRequests || []);
    } catch (err: unknown) {
      console.error("Failed to load dashboard data:", err);
      const msg = err instanceof Error ? err.message : "";
      if (
        msg.includes("Authentication") ||
        msg.includes("token") ||
        msg.includes("Admin access")
      ) {
        // Token has expired or is invalid! Clear session and prompt login
        localStorage.removeItem("tejas_admin_session");
        setCurrentUser(null);
        setAuthError("Session expired or authentication required. Please log in again.");
      }
    } finally {
      setLoadingData(false);
    }
  }, [currentUser, statusFilter, searchQuery]);

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser, fetchData]);

  // Temporary action flash notice
  const triggerNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      const res = await adminLogin({ email: authEmail, password: authPassword });
      localStorage.setItem("tejas_admin_session", JSON.stringify(res.session));
      setCurrentUser(res.session.user);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Login failed";
      setAuthError(errorMsg);
    } finally {
      setAuthLoading(false);
    }
  };

  // Initial Setup handler
  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      await setupAdmin({
        email: authEmail,
        password: authPassword,
        fullName: authName,
      });
      // Auto login after setup
      const res = await adminLogin({ email: authEmail, password: authPassword });
      localStorage.setItem("tejas_admin_session", JSON.stringify(res.session));
      setCurrentUser(res.session.user);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Setup failed";
      setAuthError(errorMsg);
    } finally {
      setAuthLoading(false);
    }
  };

  // Sign out handler
  const handleSignOut = () => {
    localStorage.removeItem("tejas_admin_session");
    setCurrentUser(null);
  };

  // Security & Account Settings state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [secLoading, setSecLoading] = useState(false);
  const [secSuccess, setSecSuccess] = useState<string | null>(null);
  const [secError, setSecError] = useState<string | null>(null);

  // Profile update state
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.fullName || "");
      setProfileEmail(currentUser.email || "");
    }
  }, [currentUser]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecError(null);
    setSecSuccess(null);

    if (newPassword.length < 6) {
      setSecError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setSecError("New passwords do not match. Please verify and retype.");
      return;
    }

    setSecLoading(true);
    try {
      const res = await changeAdminPassword({
        currentPassword: currentPassword || undefined,
        newPassword,
      });
      setSecSuccess(res.message || "Admin password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      triggerNotice("Password changed successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to change password.";
      setSecError(msg);
    } finally {
      setSecLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);
    setProfileLoading(true);

    try {
      const res = await updateAdminProfile({
        fullName: profileName,
        email: profileEmail,
      });

      setProfileSuccess(res.message || "Admin profile updated successfully!");
      if (res.user && currentUser) {
        const updated = {
          ...currentUser,
          fullName: res.user.fullName || profileName,
          email: res.user.email || profileEmail,
        };
        setCurrentUser(updated);

        const saved = localStorage.getItem("tejas_admin_session");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            parsed.user = updated;
            localStorage.setItem("tejas_admin_session", JSON.stringify(parsed));
          } catch {
            // Ignore
          }
        }
      }
      triggerNotice("Profile updated successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update profile.";
      setProfileError(msg);
    } finally {
      setProfileLoading(false);
    }
  };

  // Change Inquiry Status
  const handleInquiryStatusChange = async (id: string, newStatus: string) => {
    setSavingInquiryId(id);
    try {
      const res = await updateInquiryStatus(id, newStatus);
      if (res && res.inquiry) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === id ? res.inquiry : item))
        );
      } else {
        setInquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
      }
      triggerNotice(`✓ Status updated to "${newStatus}" and saved in Supabase!`);
      // Refresh stats
      const statsRes = await getAdminStats();
      setStats(statsRes.stats);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to update status in database.";
      alert(`Error updating Supabase database: ${errorMsg}`);
    } finally {
      setSavingInquiryId(null);
    }
  };

  // Delete Inquiry
  const handleDeleteInquiry = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete the inquiry from "${name}"?`)) {
      return;
    }
    try {
      await deleteInquiryRecord(id);
      setInquiries((prev) => prev.filter((item) => item.id !== id));
      triggerNotice(`Inquiry from ${name} deleted.`);
      const statsRes = await getAdminStats();
      setStats(statsRes.stats);
    } catch {
      alert("Failed to delete inquiry.");
    }
  };

  // Change AMC Status
  const handleAMCStatusChange = async (id: string, newStatus: string) => {
    setSavingAmcId(id);
    try {
      const res = await updateAMCStatus(id, newStatus);
      if (res && res.amcRequest) {
        setAmcRequests((prev) =>
          prev.map((item) => (item.id === id ? res.amcRequest : item))
        );
      } else {
        setAmcRequests((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
      }
      triggerNotice(`✓ AMC status updated to "${newStatus}" and saved in Supabase!`);
      const statsRes = await getAdminStats();
      setStats(statsRes.stats);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to update AMC status in database.";
      alert(`Error updating Supabase database: ${errorMsg}`);
    } finally {
      setSavingAmcId(null);
    }
  };

  // Delete AMC Request
  const handleDeleteAMC = async (id: string, property: string) => {
    if (!confirm(`Are you sure you want to delete the AMC request for "${property}"?`)) {
      return;
    }
    try {
      await deleteAMCRecord(id);
      setAmcRequests((prev) => prev.filter((item) => item.id !== id));
      triggerNotice(`AMC request for ${property} deleted.`);
      const statsRes = await getAdminStats();
      setStats(statsRes.stats);
    } catch {
      alert("Failed to delete AMC request.");
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    if (activeTab === "inquiries") {
      if (inquiries.length === 0) return alert("No inquiry records to export.");
      const headers = ["ID", "Full Name", "Phone", "Email", "Lift Type", "Floors", "Building Type", "Status", "Date", "Message"];
      const rows = inquiries.map((i) => [
        `"${i.id}"`,
        `"${i.full_name}"`,
        `"${i.phone}"`,
        `"${i.email}"`,
        `"${i.lift_type}"`,
        `"${i.floors}"`,
        `"${i.building_type}"`,
        `"${i.status}"`,
        `"${new Date(i.created_at).toLocaleString()}"`,
        `"${(i.message || "").replace(/"/g, '""')}"`,
      ]);
      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `tejas-elevator-inquiries-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      if (amcRequests.length === 0) return alert("No AMC records to export.");
      const headers = ["ID", "Contact Person", "Phone", "Email", "Property Name", "Property Address", "Lifts Count", "Plan", "Status", "Date"];
      const rows = amcRequests.map((a) => [
        `"${a.id}"`,
        `"${a.contact_name}"`,
        `"${a.phone}"`,
        `"${a.email}"`,
        `"${a.property_name}"`,
        `"${a.property_address}"`,
        `"${a.current_lifts_count}"`,
        `"${a.plan_type}"`,
        `"${a.status}"`,
        `"${new Date(a.created_at).toLocaleString()}"`,
      ]);
      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `tejas-elevator-amc-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Helper for WhatsApp URL
  const getWhatsAppLink = (phone: string, clientName: string, liftType: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const formattedPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
    const text = encodeURIComponent(
      `Hello ${clientName}, this is Rajiv Kumar Sethi from Tejas Elevator Engineering regarding your inquiry for ${liftType}. When would be a convenient time for a technical consultation or site survey?`
    );
    return `https://wa.me/${formattedPhone}?text=${text}`;
  };

  // --------------------------------------------------------------------------
  // Loading View
  // --------------------------------------------------------------------------
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-brand-surface flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-navy border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-gray-500 uppercase tracking-wider">
            Initializing Tejas Elevator Admin Portal...
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // Setup View (If no admin accounts exist yet in Supabase Auth)
  // --------------------------------------------------------------------------
  if (!currentUser && needsSetup) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-800">
          <div className="p-8 bg-brand-navy-dark text-white text-center space-y-2 border-b border-slate-800">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto text-brand-steel">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">First-Time Admin Setup</h1>
            <p className="text-xs text-gray-300">
              Create your primary administrator account in Supabase Auth to manage incoming leads and contracts.
            </p>
          </div>

          <form onSubmit={handleSetup} className="p-8 space-y-5">
            {authError && (
              <div className="p-3.5 bg-rose-950/60 border border-rose-800/80 rounded-xl text-xs text-rose-300 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-steel/50 focus:border-brand-steel"
                  placeholder="Rajiv Kumar Sethi"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-steel/50 focus:border-brand-steel font-mono"
                  placeholder="tejaselevatorengineering@gmail.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Create Strong Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-steel/50 focus:border-brand-steel"
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 bg-brand-navy hover:bg-brand-navy-dark text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-60 border border-brand-steel/30"
            >
              {authLoading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Initialize Admin Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // Login View
  // --------------------------------------------------------------------------
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-800">
          <div className="p-8 bg-brand-navy-dark text-white text-center space-y-2 border-b border-slate-800">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto text-brand-steel">
              <Lock className="w-6 h-6" />
            </div>
            <div className="text-[11px] font-mono tracking-widest uppercase text-brand-steel font-bold">
              Tejas Elevator Engineering
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">Admin Portal Sign In</h1>
            <p className="text-xs text-gray-300">
              Enter your authorized Supabase administrator credentials to access inquiry leads and site requests.
            </p>
          </div>

          <form onSubmit={handleLogin} className="p-8 space-y-5">
            {authError && (
              <div className="p-3.5 bg-rose-950/60 border border-rose-800/80 rounded-xl text-xs text-rose-300 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-steel/50 focus:border-brand-steel font-mono"
                  placeholder="tejaselevatorengineering@gmail.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-steel/50 focus:border-brand-steel"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 bg-brand-navy hover:bg-brand-navy-dark text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-60 border border-brand-steel/30"
            >
              {authLoading ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <Link
                href="/"
                className="text-xs text-slate-400 hover:text-brand-steel transition-colors font-medium"
              >
                ← Back to Public Website
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // Main Admin Dashboard
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#0b1120] text-gray-100">
      {/* Top Admin Navigation Bar */}
      <header className="bg-brand-navy text-white border-b border-gray-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand-steel/20 border border-brand-steel/40 text-brand-steel flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-tight">
                TEJAS ELEVATOR ENGINEERING
              </div>
              <div className="text-[10px] font-mono text-gray-300 flex items-center gap-2">
                <span>Admin Operations Center</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-300">Live Supabase Sync</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="hidden sm:block text-right">
              <div className="font-bold text-white">{currentUser.fullName}</div>
              <div className="text-[11px] text-gray-300 font-mono">{currentUser.email}</div>
            </div>

            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-1.5 font-medium"
            >
              <span>View Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleSignOut}
              className="px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-1.5 font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Action Notice */}
      {actionNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-black/90 text-white px-5 py-3 rounded-xl shadow-2xl text-xs font-mono flex items-center gap-2 border border-white/20 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Dashboard Body */}
      <main className="max-w-7xl mx-auto px-3 sm:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8">
        {/* KPI Metrics Summary Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <div className="bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-md flex items-center justify-between">
              <div>
                <div className="text-xs font-mono uppercase text-gray-400 font-semibold">
                  Total Inquiries
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-1">
                  {stats.totalInquiries}
                </div>
                <div className="text-[11px] text-gray-400 mt-1">Lifetime logged</div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>

            <div className="bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-amber-900/40 shadow-md flex items-center justify-between">
              <div>
                <div className="text-xs font-mono uppercase text-amber-400 font-bold">
                  New Leads
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono mt-1">
                  {stats.newInquiries}
                </div>
                <div className="text-[11px] text-amber-300/80 mt-1">Action required</div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>

            <div className="bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-purple-900/40 shadow-md flex items-center justify-between">
              <div>
                <div className="text-xs font-mono uppercase text-purple-400 font-bold">
                  Surveys &amp; Quotes
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono mt-1">
                  {stats.surveyScheduledInquiries + stats.quoteSentInquiries}
                </div>
                <div className="text-[11px] text-purple-300/80 mt-1">In design review</div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>

            <div className="bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-emerald-900/40 shadow-md flex items-center justify-between">
              <div>
                <div className="text-xs font-mono uppercase text-emerald-400 font-bold">
                  AMC Contracts
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono mt-1">
                  {stats.totalAMC}
                </div>
                <div className="text-[11px] text-emerald-300/80 mt-1">
                  {stats.pendingAMC} pending audit
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>
        )}

        {/* Tab Selection & Search / Controls Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-3.5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 sm:pb-4">
            {/* Tabs: Responsive 2x2 Grid on Mobile, Flex Row on Desktop */}
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  setActiveTab("inquiries");
                  setStatusFilter("all");
                }}
                className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${
                  activeTab === "inquiries"
                    ? "bg-brand-navy text-white shadow-md border border-brand-steel/30"
                    : "bg-slate-800/80 hover:bg-slate-800 text-gray-300 border border-slate-700/60"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="sm:hidden">Inquiries</span>
                <span className="hidden sm:inline">Lift Inquiries</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                  activeTab === "inquiries" ? "bg-white/20 text-white" : "bg-slate-700 text-gray-300"
                }`}>
                  {inquiries.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("amc");
                  setStatusFilter("all");
                }}
                className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${
                  activeTab === "amc"
                    ? "bg-brand-navy text-white shadow-md border border-brand-steel/30"
                    : "bg-slate-800/80 hover:bg-slate-800 text-gray-300 border border-slate-700/60"
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="sm:hidden">AMC Leads</span>
                <span className="hidden sm:inline">AMC Requests</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                  activeTab === "amc" ? "bg-white/20 text-white" : "bg-slate-700 text-gray-300"
                }`}>
                  {amcRequests.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("media");
                }}
                className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${
                  activeTab === "media"
                    ? "bg-brand-navy text-white shadow-md border border-brand-steel/30"
                    : "bg-slate-800/80 hover:bg-slate-800 text-gray-300 border border-slate-700/60"
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-brand-steel shrink-0" />
                <span className="sm:hidden">Media</span>
                <span className="hidden sm:inline">Photos &amp; Showcase</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                  activeTab === "media" ? "bg-white/20 text-white" : "bg-slate-700 text-gray-300"
                }`}>
                  19
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("security");
                }}
                className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${
                  activeTab === "security"
                    ? "bg-brand-navy text-white shadow-md border border-brand-steel/30"
                    : "bg-slate-800/80 hover:bg-slate-800 text-gray-300 border border-slate-700/60"
                }`}
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="sm:hidden">Security</span>
                <span className="hidden sm:inline">Account &amp; Security</span>
              </button>
            </div>

            {/* Quick Actions: Refresh & Export CSV */}
            {activeTab !== "media" && activeTab !== "security" && (
              <div className="flex items-center justify-end gap-2 w-full sm:w-auto pt-2 sm:pt-0">
                <button
                  onClick={fetchData}
                  disabled={loadingData}
                  aria-label="Refresh Data"
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 border border-slate-700 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1.5"
                  title="Refresh Database Records"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? "animate-spin" : ""}`} />
                  <span>Refresh</span>
                </button>

                <button
                  onClick={exportToCSV}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                  title="Download spreadsheet of records"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            )}
          </div>

          {/* Search & Status Filters (for inquiries and amc) */}
          {activeTab !== "media" && activeTab !== "security" && (
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
              <div className="sm:col-span-8 relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    activeTab === "inquiries"
                      ? "Search by client name, phone, email, or lift type..."
                      : "Search by property, contact, phone, or plan..."
                  }
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-steel"
                />
              </div>

              <div className="sm:col-span-4 flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400 shrink-0" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-steel font-medium"
                >
                  <option value="all">Filter: All Statuses</option>
                  {activeTab === "inquiries" ? (
                    INQUIRY_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))
                  ) : (
                    AMC_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* TAB 1: Lift Inquiries View */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === "inquiries" && (
          <div className="space-y-4">
            {inquiries.length === 0 ? (
              <div className="bg-slate-900 rounded-2xl p-8 sm:p-12 text-center border border-slate-800 shadow-xl space-y-3">
                <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-white">No Inquiries Found</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  {searchQuery || statusFilter !== "all"
                    ? "No records match your active search or filter criteria. Try resetting filters."
                    : "No project inquiries have been logged yet. Submissions from the website will appear here in real-time."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {inquiries.map((inq) => {
                  const statusObj =
                    INQUIRY_STATUSES.find((s) => s.value === inq.status) || INQUIRY_STATUSES[0];
                  return (
                    <div
                      key={inq.id}
                      className="bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-xl hover:border-slate-700 transition-all space-y-4"
                    >
                      {/* Top Header Row */}
                      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-base sm:text-lg font-extrabold text-white">
                              {inq.full_name}
                            </h3>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${statusObj.color}`}
                            >
                              {statusObj.label}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400 flex items-center gap-3">
                            <span className="flex items-center gap-1 font-mono">
                              <Calendar className="w-3.5 h-3.5 text-gray-500" />
                              {new Date(inq.created_at).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            <span>•</span>
                            <span className="font-mono text-[11px] text-gray-500">
                              ID: {inq.id.slice(0, 8)}...
                            </span>
                          </div>
                        </div>

                        {/* Direct Engineer Actions: Call & WhatsApp */}
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${inq.phone}`}
                            className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                            title="Direct Phone Call"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            <span>Call</span>
                          </a>

                          <a
                            href={getWhatsAppLink(inq.phone, inq.full_name, inq.lift_type)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                            title="Send WhatsApp Follow-up Message"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>

                          <button
                            onClick={() => handleDeleteInquiry(inq.id, inq.full_name)}
                            className="p-1.5 text-gray-500 hover:text-red-400 transition-colors rounded-lg"
                            title="Delete this record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Detail Metrics Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl">
                          <div className="text-[11px] text-gray-400 font-mono">Phone Number</div>
                          <div className="font-bold text-white font-mono mt-0.5">{inq.phone}</div>
                        </div>

                        <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl truncate">
                          <div className="text-[11px] text-gray-400 font-mono">Email Address</div>
                          <div className="font-bold text-white font-mono truncate mt-0.5">
                            {inq.email}
                          </div>
                        </div>

                        <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl">
                          <div className="text-[11px] text-gray-400 font-mono">Elevator Category</div>
                          <div className="font-bold text-brand-steel mt-0.5 truncate">
                            {inq.lift_type}
                          </div>
                        </div>

                        <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl">
                          <div className="text-[11px] text-gray-400 font-mono">Floors / Building</div>
                          <div className="font-bold text-white mt-0.5 truncate">
                            {inq.floors} ({inq.building_type || "N/A"})
                          </div>
                        </div>
                      </div>

                      {/* Client Message */}
                      {inq.message && (
                        <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 text-xs text-gray-300">
                          <div className="font-bold text-gray-200 mb-1">Client Message &amp; Requirements:</div>
                          <p className="italic whitespace-pre-line leading-relaxed">{inq.message}</p>
                        </div>
                      )}

                      {/* Bottom Workflow Status Selector */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="font-bold text-gray-300">Lead Workflow Status:</span>
                          <select
                            value={inq.status || "new"}
                            disabled={savingInquiryId === inq.id}
                            onChange={(e) => handleInquiryStatusChange(inq.id, e.target.value)}
                            className="py-1.5 px-3 bg-slate-950 border border-slate-700 rounded-lg text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-brand-steel cursor-pointer disabled:opacity-50"
                          >
                            {INQUIRY_STATUSES.map((st) => (
                              <option key={st.value} value={st.value}>
                                {st.label}
                              </option>
                            ))}
                          </select>

                          {savingInquiryId === inq.id ? (
                            <span className="flex items-center gap-1.5 text-[11px] font-mono text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/50">
                              <RefreshCw className="w-3 h-3 animate-spin" />
                              <span>Saving to Supabase...</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/50">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                              <span>Synced in DB</span>
                            </span>
                          )}
                        </div>

                        <div className="text-gray-400 text-[11px] font-mono">
                          Assigned Lead: {inq.assigned_to || "Rajiv Kumar Sethi"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 2: AMC Service Requests View */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === "amc" && (
          <div className="space-y-4">
            {amcRequests.length === 0 ? (
              <div className="bg-slate-900 rounded-2xl p-8 sm:p-12 text-center border border-slate-800 shadow-xl space-y-3">
                <Building2 className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-white">No AMC Requests Found</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  {searchQuery || statusFilter !== "all"
                    ? "No AMC records match your current filter."
                    : "No AMC audit requests logged yet. Society/commercial maintenance requests will appear here."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {amcRequests.map((amc) => {
                  const statusObj =
                    AMC_STATUSES.find((s) => s.value === amc.status) || AMC_STATUSES[0];
                  return (
                    <div
                      key={amc.id}
                      className="bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-xl hover:border-slate-700 transition-all space-y-4"
                    >
                      {/* Top Header Row */}
                      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-base sm:text-lg font-extrabold text-white">
                              {amc.property_name}
                            </h3>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${statusObj.color}`}
                            >
                              {statusObj.label}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400 flex items-center gap-3">
                            <span className="flex items-center gap-1 font-mono">
                              <Calendar className="w-3.5 h-3.5 text-gray-500" />
                              {new Date(amc.created_at).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            <span>•</span>
                            <span className="font-mono text-[11px] text-gray-500">
                              Contact: {amc.contact_name}
                            </span>
                          </div>
                        </div>

                        {/* Direct Engineer Actions */}
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${amc.phone}`}
                            className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                            title="Direct Phone Call"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            <span>Call</span>
                          </a>

                          <a
                            href={`https://wa.me/${amc.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                              `Hello ${amc.contact_name}, this is Rajiv Kumar Sethi from Tejas Elevator Engineering regarding your AMC request for ${amc.property_name}.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                            title="Send WhatsApp Message"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>

                          <button
                            onClick={() => handleDeleteAMC(amc.id, amc.property_name)}
                            className="p-1.5 text-gray-500 hover:text-red-400 transition-colors rounded-lg"
                            title="Delete this record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Detail Metrics Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl">
                          <div className="text-[11px] text-gray-400 font-mono">Contact Person</div>
                          <div className="font-bold text-white mt-0.5">{amc.contact_name}</div>
                          <div className="text-[11px] text-gray-400 font-mono">{amc.phone}</div>
                        </div>

                        <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl">
                          <div className="text-[11px] text-gray-400 font-mono">Selected Plan</div>
                          <div className="font-bold text-brand-steel mt-0.5">{amc.plan_type}</div>
                        </div>

                        <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl">
                          <div className="text-[11px] text-gray-400 font-mono">Active Elevators</div>
                          <div className="font-bold text-white mt-0.5 font-mono">
                            {amc.current_lifts_count} Lift(s)
                          </div>
                        </div>

                        <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl truncate">
                          <div className="text-[11px] text-gray-400 font-mono">Property Address</div>
                          <div className="font-bold text-white mt-0.5 truncate">
                            {amc.property_address || "N/A"}
                          </div>
                        </div>
                      </div>

                      {/* AMC Message */}
                      {amc.message && (
                        <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 text-xs text-gray-300">
                          <div className="font-bold text-gray-200 mb-1">Maintenance Scope / Notes:</div>
                          <p className="italic whitespace-pre-line leading-relaxed">{amc.message}</p>
                        </div>
                      )}

                      {/* Bottom Status Selector */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="font-bold text-gray-300">AMC Status:</span>
                          <select
                            value={amc.status || "pending"}
                            disabled={savingAmcId === amc.id}
                            onChange={(e) => handleAMCStatusChange(amc.id, e.target.value)}
                            className="py-1.5 px-3 bg-slate-950 border border-slate-700 rounded-lg text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-brand-steel cursor-pointer disabled:opacity-50"
                          >
                            {AMC_STATUSES.map((st) => (
                              <option key={st.value} value={st.value}>
                                {st.label}
                              </option>
                            ))}
                          </select>

                          {savingAmcId === amc.id ? (
                            <span className="flex items-center gap-1.5 text-[11px] font-mono text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/50">
                              <RefreshCw className="w-3 h-3 animate-spin" />
                              <span>Saving to Supabase...</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/50">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                              <span>Synced in DB</span>
                            </span>
                          )}
                        </div>

                        <div className="text-gray-400 text-[11px] font-mono">
                          Official Desk: tejaselevatorengineering@gmail.com
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 3: Website Media & Photos Manager */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === "media" && <AdminMediaManager />}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 4: Account & Security Manager */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === "security" && (
          <div className="space-y-8">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-gray-900 via-brand-navy-dark to-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
              <div className="relative z-10 max-w-3xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-steel/20 border border-brand-steel/30 text-xs font-mono text-brand-steel">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Credentials &amp; Security • Supabase Auth</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Account &amp; Security Settings
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Update your administrator login password or profile information. All updates are cryptographically secured and processed directly through Supabase Auth with zero server overhead.
                </p>
              </div>
            </div>

            {/* Current Account Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-brand-navy/30 border border-brand-navy/50 text-brand-steel font-bold text-xl flex items-center justify-center shrink-0">
                  {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : "A"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-white text-lg">{currentUser.fullName}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 uppercase">
                      {currentUser.role || "Admin"}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">{currentUser.email}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Authenticated via Supabase PostgreSQL Auth</div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs font-mono">
                  ID: {currentUser.id.slice(0, 12)}...
                </span>
              </div>
            </div>

            {/* Forms Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form 1: Change Password */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6 text-white">
                <div>
                  <div className="flex items-center gap-2 text-brand-steel mb-1">
                    <KeyRound className="w-5 h-5 text-brand-steel" />
                    <h3 className="text-lg font-bold text-white">Change Admin Password</h3>
                  </div>
                  <p className="text-xs text-slate-400">
                    Set a new strong password for your administrator account.
                  </p>

                  <form onSubmit={handleChangePassword} className="mt-6 space-y-4">
                    {secError && (
                      <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{secError}</span>
                      </div>
                    )}

                    {secSuccess && (
                      <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{secSuccess}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                        Current Password (Optional Verification)
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        <input
                          type={showCurrentPass ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password if known"
                          className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-steel/50 focus:border-brand-steel"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPass(!showCurrentPass)}
                          className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200"
                        >
                          {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                        New Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        <input
                          type={showNewPass ? "text" : "password"}
                          required
                          minLength={6}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Minimum 6 characters"
                          className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-steel/50 focus:border-brand-steel"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPass(!showNewPass)}
                          className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200"
                        >
                          {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                        Confirm New Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        <input
                          type={showConfirmPass ? "text" : "password"}
                          required
                          minLength={6}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-type new password"
                          className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-steel/50 focus:border-brand-steel"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPass(!showConfirmPass)}
                          className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200"
                        >
                          {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={secLoading || !newPassword || !confirmPassword}
                      className="w-full py-2.5 px-4 bg-brand-navy hover:bg-brand-navy-dark text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed border border-brand-steel/30"
                    >
                      {secLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Updating Password...</span>
                        </>
                      ) : (
                        <>
                          <KeyRound className="w-4 h-4 text-brand-steel" />
                          <span>Save New Password</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                  Tip: Passwords must be at least 6 characters. Make sure to remember your new password for your next login.
                </div>
              </div>

              {/* Form 2: Update Profile Information */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6 text-white">
                <div>
                  <div className="flex items-center gap-2 text-brand-steel mb-1">
                    <User className="w-5 h-5 text-brand-steel" />
                    <h3 className="text-lg font-bold text-white">Administrator Profile</h3>
                  </div>
                  <p className="text-xs text-slate-400">
                    Update your official contact name and login email address.
                  </p>

                  <form onSubmit={handleUpdateProfile} className="mt-6 space-y-4">
                    {profileError && (
                      <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{profileError}</span>
                      </div>
                    )}

                    {profileSuccess && (
                      <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{profileSuccess}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                        Admin Full Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          required
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          placeholder="e.g. Rajiv Kumar Sethi"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-steel/50 focus:border-brand-steel"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                        Login Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        <input
                          type="email"
                          required
                          value={profileEmail}
                          onChange={(e) => setProfileEmail(e.target.value)}
                          placeholder="e.g. tejaselevatorengineering@gmail.com"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-steel/50 focus:border-brand-steel font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={profileLoading || (!profileName && !profileEmail)}
                      className="w-full py-2.5 px-4 bg-brand-navy hover:bg-brand-navy-dark text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed border border-brand-steel/30"
                    >
                      {profileLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Saving Profile...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-brand-steel" />
                          <span>Save Profile Updates</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                  Note: Changing your email will update the primary login credential for this administrator account in Supabase.
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
