import { cookies } from "next/headers";
const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export const bookingService = {
  list: async function () {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/bookings`, {
        headers: { Cookie: cookieStore.toString() },
        cache: "no-store",
      });

      const data = await res.json();
      if (!res.ok) return { data: null, error: { message: data?.message ?? "Failed to load bookings" } };
      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  create: async function (payload: any) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: cookieStore.toString() },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) return { data: null, error: { message: data?.message ?? "Booking failed" } };
      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  cancel: async function (id: string) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/bookings/${id}/cancel`, {
        method: "PATCH",
        headers: { Cookie: cookieStore.toString() },
      });

      const data = await res.json();
      if (!res.ok) return { data: null, error: { message: data?.message ?? "Cancel failed" } };
      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },
};
