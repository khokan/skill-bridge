"use server";

import { tutorService } from "@/services/tutor.service";

export const getTutorReviews = async (id: string) => tutorService.geReviews(id);
export const getTutorReviewByBookingId = async (id: string) => tutorService.getReviewByBookingId(id);

export const getTutors = async (params?: { q?: string; category?: string }) => {
  return tutorService.getTutors(params);
};

export const getTutorById = async (id: string) => {
  return await tutorService.getTutorById(id);
};

// optional, if you ever add mutations that affect list:
export const refreshTutors = async () => {
//   revalidateTag("tutors");
};


