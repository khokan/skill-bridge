import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export type AvailabilitySlotInput = {
  startTime: string; // ISO
  endTime: string;   // ISO
};

export const tutorManageService = {
  setAvailability: async function (slots: AvailabilitySlotInput[]) {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/tutor/availability`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify({ slots }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { data: null, error: { message: data?.message ?? "Failed to update availability" } };
      }

      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  getAvailability: async function () {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/tutor/availability`, {
        headers: { Cookie: cookieStore.toString() },
        cache: "no-store",
      });

      const data = await res.json();
      if (!res.ok) {
        return { data: null, error: { message: data?.message ?? "Failed to load availability" } };
      }

      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },
};
