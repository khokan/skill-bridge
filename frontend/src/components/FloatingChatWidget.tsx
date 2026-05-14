"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Bot, X, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

type ChatMessage = {
  id: string;
  role: "assistant" | "user" | "system";
  text: string;
  sourceLabel?: string;
};

type AnswerRecord = Record<string, unknown>;

const starterPrompts = [
  "Show tutors with strong reviews in math",
  "Show tutors with strong reviews in english",
  "show tutors availability for this week",
];

const buildInitialMessages = (): ChatMessage[] => [
  { id: "welcome", role: "assistant", text: "Hello — ask about tutors, specialties, or availability." },
];

const FloatingChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(buildInitialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) scrollBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isOpen, messages]);

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);

    window.addEventListener("skillbridge:open-ai-chat", handleOpenChat);

    return () => window.removeEventListener("skillbridge:open-ai-chat", handleOpenChat);
  }, []);

  const appendMessage = (m: ChatMessage) => setMessages((s) => [...s, m]);
  const idRef = useRef(0);
  const genId = (prefix: string) => `${prefix}-${++idRef.current}`;

  const sendQuery = async (text: string) => {
    const q = text.trim();
    if (!q) return;

    appendMessage({ id: genId("user"), role: "user", text: q });
    setInput("");
    setIsLoading(true);

    try {
      const api = process.env.NEXT_PUBLIC_API_URL ?? "";
      const res = await fetch(`${api}/rag/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ query: q }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data) {
        const err = data?.message ?? "Failed to get answer";
        appendMessage({ id: genId("assistant-error"), role: "assistant", text: err });
        return;
      }

      const rawAnswer = data?.data?.answer ?? data?.data ?? data?.answer ?? data;
      const sources = data?.data?.sources ?? data?.sources ?? null;

      const normalizeList = (value: unknown) => (Array.isArray(value) ? value : []);
      const formatTutorItem = (item: AnswerRecord, index: number) => {
        const lines: string[] = [];
        const title = item.name ?? item.title ?? item.headline ?? item.subject ?? `Tutor ${index + 1}`;
        lines.push(`${index + 1}. ${String(title)}`);

        const subject = item.subject ?? item.specialty ?? item.headline;
        if (subject && subject !== title) lines.push(`Subject: ${subject}`);

        if (item.reviews !== undefined) lines.push(`Reviews: ${String(item.reviews)}`);
        if (item.reviewCount !== undefined) lines.push(`Reviews: ${String(item.reviewCount)}`);
        if (item.averageRating !== undefined) lines.push(`Rating: ${String(item.averageRating)}`);
        if (item.availability !== undefined) lines.push(`Availability: ${String(item.availability)}`);
        if (item.isAvailable !== undefined) lines.push(`Availability: ${item.isAvailable ? "Available" : "Not available"}`);
        if (item.booked !== undefined) lines.push(`Booked: ${item.booked ? "Yes" : "No"}`);
        if (item.isBooked !== undefined) lines.push(`Booked: ${item.isBooked ? "Yes" : "No"}`);
        if (item.reason) lines.push(`Why: ${String(item.reason)}`);

        return lines.join("\n");
      };

      // Format answer: if it's an object, render readable text
      let text = "";
      if (rawAnswer && typeof rawAnswer === "object") {
        const answerObject = rawAnswer as Record<string, unknown>;

        const tutorList =
          normalizeList(answerObject.tutors).length > 0
            ? normalizeList(answerObject.tutors)
            : normalizeList(answerObject.recommendations).length > 0
              ? normalizeList(answerObject.recommendations)
              : normalizeList(answerObject.results).length > 0
                ? normalizeList(answerObject.results)
                : [];

        if (tutorList.length > 0) {
          text = tutorList
            .slice(0, 10)
            .map((item, index) => formatTutorItem(item, index))
            .join("\n\n");
        } else if (typeof answerObject.summary === "string" || typeof answerObject.message === "string") {
          const summary = typeof answerObject.summary === "string" ? answerObject.summary : answerObject.message;
          const details: string[] = [String(summary)];

          if (Array.isArray(answerObject.reviewHighlights) && answerObject.reviewHighlights.length > 0) {
            details.push(
              "\nReview highlights:\n" +
                answerObject.reviewHighlights
                  .slice(0, 5)
                  .map((item, index) => formatTutorItem(item as AnswerRecord, index))
                  .join("\n\n"),
            );
          }

          text = details.join("\n");
        } else {
          try {
            text = JSON.stringify(rawAnswer, null, 2);
          } catch {
            text = String(rawAnswer);
          }
        }
      } else {
        text = String(rawAnswer ?? "No answer");
      }

      // compute confidence label from first source similarity if present
      let sourceLabel: string | undefined;
      if (Array.isArray(sources) && sources.length > 0 && typeof sources[0].similarity === "number") {
        const sim = Number(sources[0].similarity);
        // convert similarity/distance into percent match if possible
        const pct = Math.max(0, Math.min(100, ((1 - sim) * 100)));
        sourceLabel = `${pct.toFixed(2)}% matched`;
      } else if (typeof (data?.data ?? data)?.sources === "string") {
        sourceLabel = (data?.data ?? data).sources as string;
      }

      appendMessage({ id: genId("assistant"), role: "assistant", text, sourceLabel });
    } catch (err) {
      const msg = String(err ?? "Error");
      appendMessage({ id: genId("assistant-error"), role: "assistant", text: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleIngest = async () => {
    try {
      const api = process.env.NEXT_PUBLIC_API_URL ?? "";
      const res = await fetch(`${api}/rag/index`, { method: "POST", credentials: "include" });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(data?.message ?? "Sync failed");
        appendMessage({ id: genId("system-sync-error"), role: "system", text: String(data?.message ?? "Sync failed") });
        return;
      }
      toast.success(data?.message ?? "Indexed");
      appendMessage({ id: genId("system-sync"), role: "system", text: `${data?.message ?? "Indexed"} Indexed: ${data?.data?.indexedCount ?? data?.indexedCount ?? 0}` });
    } catch (e) {
      toast.error(String(e ?? "Sync failed"));
    }
  };

  return (
    <>
      {!isOpen ? (
        <Button
          type="button"
          size="icon-lg"
          className="fixed right-4 bottom-4 z-50 h-14 w-14 rounded-full bg-linear-to-br from-primary to-cyan-500 text-primary-foreground shadow-2xl shadow-cyan-500/30 ring-1 ring-primary/20"
          onClick={() => setIsOpen(true)}
          aria-label="Open AI assistant"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      ) : null}

      {isOpen ? (
        <section className="fixed right-4 bottom-4 z-60 w-[min(420px,95vw)] overflow-hidden rounded-3xl border border-border/70 bg-card/95 text-card-foreground shadow-2xl backdrop-blur-xl">
          <div className="border-b border-border/60 bg-muted/70 p-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                  <Bot className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold">Tutor AI Assistant</h3>
                  <p className="text-xs text-muted-foreground">Ask about tutors and their profiles</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" className="h-8 rounded-full border-border/70 bg-background/70" onClick={() => void handleIngest()}>
                  Sync
                </Button>
                <Button type="button" variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          <div className="h-64 overflow-auto bg-background/70 p-3">
            <div className="space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={
                    (m.role === "user"
                      ? "ml-auto bg-linear-to-r from-primary to-cyan-500 text-primary-foreground shadow-md"
                      : "mr-auto border border-border/70 bg-card text-card-foreground shadow-sm") +
                    " max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm"
                  }
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  {m.sourceLabel ? <p className="mt-2 text-xs text-muted-foreground">Confidence: {m.sourceLabel}</p> : null}
                </div>
              ))}
              <div ref={scrollBottomRef} />
            </div>
            {isLoading ? (
              <div className="mt-3 rounded-3xl bg-primary/10 p-3 text-center text-sm text-primary">
                <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
                <p className="font-medium">Searching tutor matches...</p>
                <p className="text-xs text-muted-foreground">Fetching the best answers and related profiles...</p>
              </div>
            ) : null}
          </div>

          <div className="border-t border-border/60 bg-card/95 p-3">
            <div className="mb-2 flex flex-wrap gap-2">
              {starterPrompts.map((p) => (
                <Button key={p} type="button" size="xs" variant="outline" className="h-7" onClick={() => void sendQuery(p)} disabled={isLoading}>
                  {p}
                </Button>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isLoading ? "Finding matching tutors..." : "Ask about tutors..."}
                className="min-h-10 resize-none border-border/70 bg-background/80 text-foreground placeholder:text-muted-foreground"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void sendQuery(input);
                  }
                }}
                disabled={isLoading}
              />
              <div className="flex items-center justify-between gap-2">
                <Button
                  type="button"
                  className="h-12 flex-1 rounded-xl bg-linear-to-r from-primary to-cyan-500 text-primary-foreground shadow-lg shadow-cyan-500/20 transition-transform duration-200 hover:-translate-y-0.5"
                  onClick={() => void sendQuery(input)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Finding matches...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Search tutors
                    </span>
                  )}
                </Button>
                <div className="rounded-2xl bg-muted/80 px-3 py-2 text-xs text-muted-foreground">
                  {isLoading ? "Scanning tutor profiles..." : "Ready to find smart matches."}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
};

export default FloatingChatWidget;
