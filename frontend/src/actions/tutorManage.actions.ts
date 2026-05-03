"use server";


import { AvailabilitySlotInput, tutorManageService } from "@/services/tutorManage.service";

export const getAvailability = async () => {
  return await tutorManageService.getAvailability();
};

export const setAvailability = async (slots: AvailabilitySlotInput[]) => {
  const res = await tutorManageService.setAvailability(slots);
//   revalidateTag("availability");
  return res;
};
