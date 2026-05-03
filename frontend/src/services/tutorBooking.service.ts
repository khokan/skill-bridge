import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export const tutorBookingService = {
  getMyBookings: async function () {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/tutor/bookings`, {
        headers: { Cookie: cookieStore.toString() },
        cache: "no-store",
      });

      const data = await res.json();
      if (!res.ok) return { data: null, error: { message: data?.message ?? "Failed to load" } };
      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  completeBooking: async function (bookingId: string) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/bookings/${bookingId}/complete`, {
        method: "PATCH",
        headers: { Cookie: cookieStore.toString() },
        cache: "no-store",
      });

      const data = await res.json();
      if (!res.ok) return { data: null, error: { message: data?.message ?? "Complete failed" } };
      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },
};
