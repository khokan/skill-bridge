"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { getBookings, cancelBooking } from "@/actions/booking.actions";
import { completeTutorBooking } from "@/actions/tutorBooking.actions";
import { getTutorReviewByBookingId } from "@/actions/tutor.actions";

type Booking = {
  id: string;
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED";
  startTime: string;
  endTime?: string;

  student?: { id: string; name: string; image?: string | null } | null;

  price?: number;
  currency?: string;

  review?: {
    id: string;
    rating: number;
    comment?: string | null;
    createdAt: string;
  } | null;
};

export default function TutorBookingsPage() {
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
   
      const { data, error } = await getBookings();
      if (error) throw error;

      const list = (data?.data?.items ?? []) as Booking[];

      // only fetch reviews for completed
      const completed = list.filter((b) => b.status === "COMPLETED");
      const reviews = await Promise.all(
        completed.map(async (b) => {
          const r = await getTutorReviewByBookingId(b.id);
          const review = r?.data?.data?.review ?? null;
          return { bookingId: b.id, review };
        })
      );

      const map = new Map(reviews.map((x) => [x.bookingId, x.review]));

      const merged = list.map((b) => ({
        ...b,
        review: map.get(b.id) ?? null,
      }));

      setItems(merged);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const cancel = async (bookingId: string) => {
    try {
      setLoading(true);
      const { error } = await cancelBooking(bookingId);
      if (error) throw error;
      toast.success("Booking cancelled");
      await load();
    } catch (e: any) {
      toast.error(e?.message ?? "Cancel failed");
    } finally {
      setLoading(false);
    }
  };

  const complete = async (bookingId: string) => {
    try {
      setLoading(true);
      const { error } = await completeTutorBooking(bookingId);
      if (error) throw error;
      toast.success("Session marked completed");
      await load();
    } catch (e: any) {
      toast.error(e?.message ?? "Complete failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl space-y-5 p-4">
        <div>
          <h1 className="text-2xl font-semibold">My Sessions</h1>
          <p className="text-sm text-muted-foreground">
            Manage confirmed sessions and view reviews on completed sessions.
          </p>
        </div>

        <Card className="rounded-3xl border border-primary/20 bg-background/90 shadow-2xl">
          <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary shadow-lg shadow-primary/20">
              <Loader2 className="h-12 w-12 animate-spin" />
            </div>
            <div>
              <p className="text-xl font-semibold">Loading your sessions</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Fetching your latest tutor bookings, status updates, and reviews.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5 p-4">
      <div>
        <h1 className="text-2xl font-semibold">My Sessions</h1>
        <p className="text-sm text-muted-foreground">
          Manage confirmed sessions and view reviews on completed sessions.
        </p>
      </div>

      {items.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">No sessions found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((b) => (
            <Card key={b.id} className="rounded-2xl">
              <CardContent className="p-5 space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">
                      {b.student?.name ?? "Student"}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {new Date(b.startTime).toLocaleString()}
                      {b.endTime
                        ? ` → ${new Date(b.endTime).toLocaleTimeString()}`
                        : ""}
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="rounded-full border px-2 py-1">
                        {b.status}
                      </span>

                      {typeof b.price === "number" ? (
                        <span className="text-muted-foreground">
                          {b.price} {b.currency ?? "BDT"}
                        </span>
                      ) : null}

                      {b.status === "COMPLETED" ? (
                        <span className="rounded-full border px-2 py-1">
                          {b.review ? "Reviewed" : "No review yet"}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    {b.status === "CONFIRMED" && (
                      <>
                        <Button
                          variant="destructive"
                          disabled={loading}
                          onClick={() => cancel(b.id)}
                        >
                          Cancel
                        </Button>

                        <Button
                          onClick={() => complete(b.id)}
                          disabled={loading}
                        >
                          Mark Complete
                        </Button>
                      </>
                    )}

                    {b.status === "CANCELLED" && (
                      <Button variant="outline" disabled>
                        Cancelled
                      </Button>
                    )}
                  </div>
                </div>

                {/* ✅ show review once, under completed session */}
               
                {b.status === "COMPLETED" && (
                  <div className="rounded-xl border p-3 text-sm">
                    {b.review ? (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="font-medium">Student Review</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(b.review.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="mt-1">⭐ {b.review.rating}/5</div>

                        {b.review.comment ? (
                          <p className="mt-1 text-muted-foreground">
                            {b.review.comment}
                          </p>
                        ) : (
                          <p className="mt-1 text-muted-foreground italic">
                            No comment
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-muted-foreground">No review yet.</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
