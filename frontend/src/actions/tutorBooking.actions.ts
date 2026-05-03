"use server";


import { tutorBookingService } from "@/services/tutorBooking.service";
// import { revalidateTag } from "next/cache";

export const getTutorBookings = async () => {
  return await tutorBookingService.getMyBookings();
};

export const completeTutorBooking = async (bookingId: string) => {
  const res = await tutorBookingService.completeBooking(bookingId);
//   revalidateTag("tutorBookings");
  return res;
};
