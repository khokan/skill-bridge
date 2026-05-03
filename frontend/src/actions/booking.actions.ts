"use server";


import { bookingService } from "@/services/booking.service";

export const getBookings = async () => {
  return await bookingService.list();
};

export const createBooking = async (payload: any) => {
  const res = await bookingService.create(payload);
//   revalidateTag("bookings");
  return res;
};

export const cancelBooking = async (id: string) => {
  const res = await bookingService.cancel(id);
//   revalidateTag("bookings");
  return res;
};
