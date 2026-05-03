import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export interface IRagQueryPayload {
  query: string;
  limit?: number;
  sourceType?: string;
}

export interface IRagSource {
  id: string;
  content: string;
  similarity: number;
  metadata?: {
    [key: string]: unknown;
  };
  sourceType?: string;
}

export interface IRagQueryData {
  answer: unknown;
  sources: IRagSource[];
  contextUsed?: boolean;
}

export interface IIngestData {
  success: boolean;
  message?: string;
  indexedCount?: number;
}

export const queryRagService = async (payload: IRagQueryPayload) => {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/rag/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    return { data, error: res.ok ? null : { message: data?.message ?? "Failed" } };
  } catch {
    return { data: null, error: { message: "Failed to query RAG service" } };
  }
};

export const ingestAllTutorProfilesService = async () => {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/rag/index`, {
      method: "POST",
      headers: { Cookie: cookieStore.toString() },
    });

    const data = await res.json().catch(() => ({}));
    return { data, error: res.ok ? null : { message: data?.message ?? "Failed" } };
  } catch {
    return { data: null, error: { message: "Failed to ingest tutor profiles" } };
  }
};
