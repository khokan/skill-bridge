"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createReview } from "@/actions/review.actions";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function CreateReviewDialog({
  bookingId,
  onSuccess,
  disabled,
}: {
  bookingId: string;
  onSuccess?: () => Promise<void> | void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");

  const submit = async () => {
    try {
      setLoading(true);

      if (!bookingId) throw new Error("bookingId missing");
      if (rating < 1 || rating > 5) throw new Error("Rating must be 1..5");

      const payload = {
        bookingId,
        rating,
        comment: comment.trim() ? comment.trim() : undefined,
      };

      const { error } = await createReview(payload);
      if (error) throw error;

      toast.success("Review submitted");
      setOpen(false);
      setComment("");
      setRating(5);

      await onSuccess?.();
    } catch (e: any) {
      toast.error(e?.message ?? "Review failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          Leave Review
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-2xl sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Leave a review</DialogTitle>
          <DialogDescription>Rate your session and write a short comment.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium">Rating (1-5)</label>
            <select
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              disabled={loading}
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} Star{r > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Comment (optional)</label>
            <Textarea
              placeholder="Write your feedback..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Close
          </Button>
          <Button onClick={submit} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
