"use server";

import { studentService } from "@/services/student.service";
import { revalidateTag } from "next/cache";

export const createReview = async (payload: { bookingId: string; rating: number; comment?: string }) => {
  const res = await studentService.createReview(payload);
  // optional: revalidate bookings list after review
//   revalidateTag("bookings");
  return res;
};
