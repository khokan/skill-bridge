import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export const tutorService = {
 getTutors: async (params?: { q?: string; category?: string }) => {
    try {
      const url = new URL(`${API_URL}/tutors`);

      if (params?.q) url.searchParams.set("q", params.q);
      if (params?.category) url.searchParams.set("category", params.category);

      const res = await fetch(url.toString(), { cache: "no-store" });
      const data = await res.json();

      if (!res.ok) return { data: null, error: { message: data?.message ?? "Failed" } };
      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },


  getTutorById: async function (id: string) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/tutors/${id}`, {
        headers: { Cookie: cookieStore.toString() },
        cache: "no-store",
      });

      const data = await res.json();
      if (!res.ok) return { data: null, error: { message: data?.message ?? "Failed to load tutor" } };
      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },
  geReviews: async (id: string) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/tutors/reviews/${id}`, {
        headers: { Cookie: cookieStore.toString() },
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) return { data: null, error: { message: data?.message ?? "Failed" } };
      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },
   getReviewByBookingId: async (bookingId: string) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/tutor/reviews/${bookingId}`, {
        headers: { Cookie: cookieStore.toString() },
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) return { data: null, error: { message: data?.message ?? "Failed" } };
      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },
};
