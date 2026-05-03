import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export type TutorProfilePayload = {
  bio: string;
  languages: string[];
  hourlyRate: number;
  experienceYrs: number;
};

// ✅ category types
export type Category = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
};

export const tutorProfileService = {
  // -------------------------
  // Profile CRUD (your existing)
  // -------------------------
  get: async function () {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/tutor-profile/me`, {
        headers: { Cookie: cookieStore.toString() },
        cache: "no-store",
      });

      if (res.status === 404) return { data: null, error: null };

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ message: "Failed to fetch profile" }));
        return {
          data: null,
          error: { message: errorData.message || "Failed to fetch profile" },
        };
      }

      const data = await res.json();
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching tutor profile:", error);
      return { data: null, error: { message: "Failed to fetch profile" } };
    }
  },

  create: async function (payload: TutorProfilePayload) {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/tutor-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) return { data: null, error: { message: data.message ?? "Create failed" } };

      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Profile creation failed" } };
    }
  },

  update: async function (payload: TutorProfilePayload) {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/tutor-profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) return { data: null, error: { message: data.message ?? "Update failed" } };

      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Profile update failed" } };
    }
  },

  remove: async function () {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/tutor-profile`, {
        method: "DELETE",
        headers: { Cookie: cookieStore.toString() },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) return { error: { message: data.message ?? "Delete failed" } };

      return { error: null };
    } catch {
      return { error: { message: "Delete failed" } };
    }
  },

  // -------------------------
  // ✅ Categories (NEW)
  // -------------------------

  // ✅ Public list for tutor to pick from
  getCategories: async function () {
    try {
      const res = await fetch(`${API_URL}/categories`, {
        cache: "no-store",
      });

      const data = await res.json();
      if (!res.ok) return { data: null, error: { message: data?.message ?? "Failed" } };

      // expected: { success, data: { items: Category[] } } OR just items
      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  // ✅ Tutor sets categories (replace all)
  setCategories: async function (payload: { categoryIds: string[] }) {
    try {
      const cookieStore = await cookies();

      // IMPORTANT: make sure backend endpoint exists
      // Option A: /tutor/categories
      // Option B: /tutor/profile/categories
      // I'll assume: /tutor/categories
      const res = await fetch(`${API_URL}/tutor/categories`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) return { data: null, error: { message: data?.message ?? "Failed" } };

      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },
};
