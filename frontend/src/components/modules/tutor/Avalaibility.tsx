"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { getAvailability, setAvailability } from "@/actions/tutorManage.actions";

type SlotForm = {
  startTime: string; // datetime-local string
  endTime: string;   // datetime-local string
};

export default function TutorAvailabilityPage() {
  const [slots, setSlots] = useState<SlotForm[]>([{ startTime: "", endTime: "" }]);
  const [loading, setLoading] = useState(false);

  // optional: load existing slots
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data, error } = await getAvailability();
        if (error) throw error;

        // Expected: data.data.items or data.items or data.data
        const items =
          data?.data?.items ?? data?.items ?? data?.data ?? [];

        // Convert ISO -> datetime-local format
        const normalized = items.map((s: any) => ({
          startTime: toLocalInput(s.startTime),
          endTime: toLocalInput(s.endTime),
        }));

        if (normalized.length) setSlots(normalized);
      } catch {
        // silent or show message
        // toast.error("Failed to load availability");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const addRow = () => setSlots((prev) => [...prev, { startTime: "", endTime: "" }]);

  const removeRow = (idx: number) => {
    setSlots((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateRow = (idx: number, key: keyof SlotForm, val: string) => {
    setSlots((prev) => prev.map((s, i) => (i === idx ? { ...s, [key]: val } : s)));
  };

  const save = async () => {
    try {
      setLoading(true);

      // validate & convert to ISO
      const payload = slots
        .map((s) => ({
          startTime: s.startTime ? new Date(s.startTime).toISOString() : "",
          endTime: s.endTime ? new Date(s.endTime).toISOString() : "",
        }))
        .filter((s) => s.startTime && s.endTime);

      if (payload.length === 0) {
        throw new Error("Please add at least one valid slot.");
      }

      for (const s of payload) {
        if (new Date(s.endTime) <= new Date(s.startTime)) {
          throw new Error("End time must be after start time.");
        }
      }

      const res = await setAvailability(payload);
      if (res?.error) throw res.error;

      toast.success("Availability updated successfully");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to update availability");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5 p-4">
      <div>
        <h1 className="text-2xl font-semibold">Availability</h1>
        <p className="text-sm text-muted-foreground">
          Add time slots students can book. Save when done.
        </p>
      </div>

      <Card className="rounded-2xl">
        <CardContent className="p-5 space-y-4">
          {slots.map((s, idx) => (
            <div key={idx} className="grid gap-3 sm:grid-cols-5 items-end">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium">Start</label>
                <Input
                  type="datetime-local"
                  value={s.startTime}
                  disabled={loading}
                  onChange={(e) => updateRow(idx, "startTime", e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm font-medium">End</label>
                <Input
                  type="datetime-local"
                  value={s.endTime}
                  disabled={loading}
                  onChange={(e) => updateRow(idx, "endTime", e.target.value)}
                />
              </div>

              <Button
                type="button"
                variant="destructive"
                disabled={loading || slots.length === 1}
                onClick={() => removeRow(idx)}
              >
                Remove
              </Button>
            </div>
          ))}

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={addRow} disabled={loading}>
              Add Slot
            </Button>
            <Button type="button" onClick={save} disabled={loading}>
              {loading ? "Saving..." : "Save Availability"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// helper: ISO -> datetime-local string
function toLocalInput(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
