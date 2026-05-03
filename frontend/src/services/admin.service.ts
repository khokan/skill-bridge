
import { cookies } from "next/headers";
const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export const adminService = {
  stats: async () => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/admin/stats`, {
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

  users: async () => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/admin/users`, {
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

 updateUserStatus: async (id: string, status: "ACTIVE" | "BANNED") => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/admin/users/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) return { data: null, error: { message: data?.message ?? "Failed" } };
      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  bookings: async () => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/admin/bookings`, {
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

  categories: async () => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/admin/categories`, {
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

  createCategory: async (payload: { name: string; slug?: string; isActive?: boolean }) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/admin/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: cookieStore.toString() },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) return { data: null, error: { message: data?.message ?? "Failed" } };
      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  updateCategory: async (id: string, payload: { name?: string; slug?: string; isActive?: boolean }) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/admin/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Cookie: cookieStore.toString() },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) return { data: null, error: { message: data?.message ?? "Failed" } };
      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  deleteCategory: async (id: string) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/admin/categories/${id}`, {
        method: "DELETE",
        headers: { Cookie: cookieStore.toString() },
      });
      const data = await res.json();
      if (!res.ok) return { data: null, error: { message: data?.message ?? "Failed" } };
      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },
};
