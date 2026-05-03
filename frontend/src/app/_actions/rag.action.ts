/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { queryRagService, ingestAllTutorProfilesService } from "@/services/rag.services";

export const queryRagAction = async (query: string) => {
  try {
    const response = await queryRagService({ query });

    if (!response?.data) {
      return { success: false, error: "No answer received from RAG service" };
    }

    return { success: true, answer: response.data.data ?? response.data };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error?.message ?? "RAG query failed" };
  }
};

export const ingestTutorProfilesAction = async () => {
  try {
    const response = await ingestAllTutorProfilesService();
    if (response?.error) return { success: false, error: response.error.message };
    return { success: true, message: response.data?.message, indexedCount: response.data?.indexedCount };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error?.message ?? "Ingest failed" };
  }
};

export const getUserRoleAction = async () => {
  try {
    // Try to import an existing auth helper if available
    const mod = await import("@/lib/auth").catch(() => null);
    if (mod && typeof (mod as any).getUserInfo === "function") {
      const u = await (mod as any).getUserInfo();
      return u?.role ?? null;
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
