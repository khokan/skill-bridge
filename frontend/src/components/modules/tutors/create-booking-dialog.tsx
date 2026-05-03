"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { createBooking } from "@/actions/booking.actions";

type Slot = {
  id: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
};

type Props = {
  tutorProfileId: string;
  slots: Slot[]; // must be provided
  buttonLabel?: string;
  onSuccess?: () => void;
};

export default function CreateBookingDialog({
  tutorProfileId,
  slots,
  buttonLabel = "Book Session",
  onSuccess,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [availabilityId, setAvailabilityId] = React.useState("");

  const handleConfirm = async () => {
    try {
      setLoading(true);

      if (!tutorProfileId) throw new Error("Tutor profile missing.");
      if (!availabilityId) throw new Error("Please select a slot.");

      const res = await createBooking({ tutorProfileId, availabilityId });

      if (res?.error) throw new Error(res.error.message ?? "Booking failed");

      toast.success("Booking confirmed!");
      setOpen(false);
      setAvailabilityId("");
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{buttonLabel}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>Book a session</DialogTitle>
          <DialogDescription>Select an available time slot and confirm.</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label>Select slot</Label>

          <select
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={availabilityId}
            onChange={(e) => setAvailabilityId(e.target.value)}
            disabled={loading}
          >
            <option value="">-- Choose a slot --</option>
            {slots.map((s) => (
              <option key={s.id} value={s.id}>
                {new Date(s.startTime).toLocaleString()} →{" "}
                {new Date(s.endTime).toLocaleTimeString()}
              </option>
            ))}
          </select>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Close
          </Button>
          <Button onClick={handleConfirm} disabled={loading}>
            {loading ? "Booking..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
