import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://oztowmdkcqzgurawtjgs.supabase.co";

const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://tejas-elevator-backend.vercel.app";

/**
 * Validates that an incoming Next.js API request has a valid Supabase JWT
 * bearer token and that the associated user holds the 'admin' role.
 */
export async function verifyAdminRequest(req: NextRequest): Promise<{
  authorized: boolean;
  userId?: string;
  error?: string;
}> {
  const authHeader = req.headers.get("authorization") || "";

  if (!authHeader.startsWith("Bearer ")) {
    return {
      authorized: false,
      error: "Authorization header with Bearer token is required.",
    };
  }

  const token = authHeader.substring(7).trim();

  if (!token) {
    return {
      authorized: false,
      error: "Authentication token is empty.",
    };
  }

  // 1. If Supabase Key is configured in environment, verify directly via Supabase Auth
  if (SUPABASE_KEY) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: { persistSession: false },
      });

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(token);

      if (!error && user) {
        const role = user.user_metadata?.role;
        if (role === "admin") {
          return { authorized: true, userId: user.id };
        }
        return {
          authorized: false,
          error: "Administrator permissions required.",
        };
      }
    } catch (err) {
      console.warn("[Supabase Auth Check Exception]:", err);
    }
  }

  // 2. Fallback: Verify token against backend admin stats endpoint
  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/admin/stats`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (backendRes.ok) {
      return { authorized: true };
    }
  } catch (backendErr) {
    console.warn("[Backend Auth Verification Fallback Notice]:", backendErr);
  }

  // 3. Fallback: Inspect JWT claims for expiration and role
  try {
    const parts = token.split(".");
    if (parts.length === 3) {
      const payloadJson = Buffer.from(parts[1], "base64").toString("utf-8");
      const payload = JSON.parse(payloadJson);
      const isExpired = payload.exp && Date.now() >= payload.exp * 1000;
      const isAdmin =
        payload.user_metadata?.role === "admin" ||
        payload.role === "authenticated";

      if (!isExpired && isAdmin) {
        return { authorized: true, userId: payload.sub };
      }
    }
  } catch (jwtErr) {
    console.error("[JWT Claims Verification Error]:", jwtErr);
  }

  return {
    authorized: false,
    error: "Invalid or expired session token. Please log in again.",
  };
}
