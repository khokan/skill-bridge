"use server";

import { adminService } from "@/services/admin.service";
import { revalidateTag } from "next/cache";

export const getAdminStats = async () => adminService.stats();
export const getAdminUsers = async () => adminService.users();
export const getAdminBookings = async () => adminService.bookings();
export const getAdminCategories = async () => adminService.categories();

export const setUserStatus = async (id: string, status: "ACTIVE" | "BANNED") => {
  const res = await adminService.updateUserStatus(id, status);
  // revalidateTag("adminUsers");
  return res;
};

export const createCategory = async (payload: { name: string; slug?: string; isActive?: boolean }) => {
  const res = await adminService.createCategory(payload);
//   revalidateTag("adminCategories");
  return res;
};

export const updateCategory = async (id: string, payload: { name?: string; slug?: string; isActive?: boolean }) => {
  const res = await adminService.updateCategory(id, payload);
//   revalidateTag("adminCategories");
  return res;
};

export const deleteCategory = async (id: string) => {
  const res = await adminService.deleteCategory(id);
//   revalidateTag("adminCategories");
  return res;
};
