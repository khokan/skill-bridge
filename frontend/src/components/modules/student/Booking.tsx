"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getBookings, cancelBooking } from "@/actions/booking.actions";
import CreateReviewDialog from "../reviews/create-review-dialog";

type Booking = {
  id: string;
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED";
  startTime: string;
  endTime?: string;
  tutor?: { id: string; name: string; image?: string | null } | null;
  price?: number;
  currency?: string;
};

export default function StudentBookingsPage() {
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);

      const { data, error } = await getBookings();
      if (error) throw error;

      // supports shape: { success, data: { items: [] } }
      const list = (data?.data?.items ?? []) as Booking[];
      setItems(list);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to load bookings");
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

  return (
    <div className="mx-auto max-w-3xl space-y-5 p-4">
      <div>
        <h1 className="text-2xl font-semibold">My Bookings</h1>
        <p className="text-sm text-muted-foreground">
          Cancel confirmed sessions and review completed sessions.
        </p>
      </div>

      {items.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">No bookings found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((b) => (
            <Card key={b.id} className="rounded-2xl">
              <CardContent className="p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="font-medium">{b.tutor?.name ?? "Tutor"}</div>

                  <div className="text-sm text-muted-foreground">
                    {new Date(b.startTime).toLocaleString()}
                    {b.endTime ? ` → ${new Date(b.endTime).toLocaleTimeString()}` : ""}
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
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 sm:justify-end">
                  {b.status === "CONFIRMED" && (
                    <Button
                      variant="destructive"
                      disabled={loading}
                      onClick={() => cancel(b.id)}
                    >
                      Cancel
                    </Button>
                  )}

                  {b.status === "COMPLETED" && (
                    <CreateReviewDialog
                      bookingId={b.id}
                      onSuccess={load}
                      disabled={loading}
                    />
                  )}

                  {b.status === "CANCELLED" && (
                    <Button variant="outline" disabled>
                      Cancelled
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
