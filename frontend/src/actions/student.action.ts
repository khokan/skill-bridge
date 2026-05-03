"use server";

import { revalidatePath } from "next/cache";
import { studentService } from "@/services/student.service";

export const getBookings = async () => studentService.getBookings();
export const getProfile = async () => studentService.getProfile();

export const updateProfile = async (payload: { name?: string; phone?: string | null; image?: string | null }) => {
  const result = await studentService.updateProfile(payload);
  revalidatePath("/dashboard/profile");
  return result;
};


export const createReview = async (payload: { bookingId: string; rating: number; comment?: string }) => {
  const result = await studentService.createReview(payload);
  revalidatePath("/dashboard/bookings");
  return result;
};
