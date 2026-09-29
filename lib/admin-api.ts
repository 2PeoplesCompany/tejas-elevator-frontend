const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

// Helper to retrieve the stored Supabase JWT access token
function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const saved = localStorage.getItem("tejas_admin_session");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed?.accessToken) {
        return {
          Authorization: `Bearer ${parsed.accessToken}`,
        };
      }
    }
  } catch (e) {
    console.error("Error reading admin session from localStorage:", e);
  }
  return {};
}

export async function checkAdminSetup() {
  const res = await fetch(`${BACKEND_URL}/api/admin/check-setup`);
  if (!res.ok) throw new Error("Failed to check admin status");
  return res.json();
}

export async function setupAdmin(payload: { email: string; password: string; fullName?: string }) {
  const res = await fetch(`${BACKEND_URL}/api/admin/setup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to create admin user");
  return data;
}

export async function adminLogin(payload: { email: string; password: string }) {
  const res = await fetch(`${BACKEND_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Login failed");
  return data;
}

export async function getAdminStats() {
  const res = await fetch(`${BACKEND_URL}/api/admin/stats`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch dashboard stats");
  return data;
}

export async function getAdminInquiries(status = "all", search = "") {
  const params = new URLSearchParams();
  if (status && status !== "all") params.append("status", status);
  if (search) params.append("search", search);

  const res = await fetch(`${BACKEND_URL}/api/admin/inquiries?${params.toString()}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch inquiries");
  return data;
}

export async function updateInquiryStatus(id: string, status: string, assigned_to?: string) {
  const res = await fetch(`${BACKEND_URL}/api/admin/inquiries/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ status, assigned_to }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update inquiry");
  return data;
}

export async function deleteInquiryRecord(id: string) {
  const res = await fetch(`${BACKEND_URL}/api/admin/inquiries/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to delete inquiry");
  return data;
}

export async function getAdminAMCRequests(status = "all", search = "") {
  const params = new URLSearchParams();
  if (status && status !== "all") params.append("status", status);
  if (search) params.append("search", search);

  const res = await fetch(`${BACKEND_URL}/api/admin/amc?${params.toString()}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch AMC requests");
  return data;
}

export async function updateAMCStatus(id: string, status: string) {
  const res = await fetch(`${BACKEND_URL}/api/admin/amc/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update AMC request");
  return data;
}

export async function deleteAMCRecord(id: string) {
  const res = await fetch(`${BACKEND_URL}/api/admin/amc/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to delete AMC request");
  return data;
}

export async function changeAdminPassword(payload: {
  currentPassword?: string;
  newPassword: string;
}) {
  const res = await fetch(`${BACKEND_URL}/api/admin/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update password");
  return data;
}

export async function updateAdminProfile(payload: {
  fullName?: string;
  email?: string;
}) {
  const res = await fetch(`${BACKEND_URL}/api/admin/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update profile");
  return data;
}

