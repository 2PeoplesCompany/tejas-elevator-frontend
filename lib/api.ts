const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export interface InquiryPayload {
  fullName: string;
  phone: string;
  email: string;
  liftType?: string;
  floors?: string;
  buildingType?: string;
  message?: string;
}

export interface AMCPayload {
  contactName: string;
  phone: string;
  email?: string;
  propertyName: string;
  propertyAddress?: string;
  currentLiftsCount?: number;
  planType?: string;
  message?: string;
}

export async function submitInquiry(payload: InquiryPayload) {
  const response = await fetch(`${BACKEND_URL}/api/inquiries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to submit inquiry.");
  }
  return data;
}

export async function submitAMCRequest(payload: AMCPayload) {
  const response = await fetch(`${BACKEND_URL}/api/amc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to submit AMC request.");
  }
  return data;
}
