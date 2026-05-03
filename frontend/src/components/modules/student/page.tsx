import Link from "next/link";
import { getBookings } from "@/actions/booking.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Booking = {
  id: string;
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED";
  startTime: string;
  tutor?: { name?: string };
};

export default async function StudentDashboardPage() {
  const { data, error } = await getBookings();

  const items: Booking[] = error ? [] : (data?.data?.items ?? []);

  const total = items.length;
  const upcoming = items.filter((b: Booking) => b.status === "CONFIRMED").length;
  const completed = items.filter((b: Booking) => b.status === "COMPLETED").length;

  const recent = items.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview and your recent bookings.</p>
        </div>

        <div className="flex gap-2">
          <Button asChild>
            <Link href="/tutors">Book a Tutor</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/bookings">My Bookings</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl">
          <CardContent className="p-5">
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="mt-1 text-2xl font-semibold">{total}</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="p-5">
            <div className="text-sm text-muted-foreground">Upcoming</div>
            <div className="mt-1 text-2xl font-semibold">{upcoming}</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="p-5">
            <div className="text-sm text-muted-foreground">Completed</div>
            <div className="mt-1 text-2xl font-semibold">{completed}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardContent className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="font-semibold">Recent bookings</div>
            <Link href="/dashboard/bookings" className="text-sm underline">
              View all
            </Link>
          </div>

          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">No bookings yet. Click “Book a Tutor”.</p>
          ) : (
            <div className="space-y-3">
              {recent.map((b) => (
                <div key={b.id} className="flex items-center justify-between rounded-xl border p-3">
                  <div>
                    <div className="font-medium">{b.tutor?.name ?? "Tutor"}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(b.startTime).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-xs rounded-full border px-2 py-1">{b.status}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {error ? <p className="text-sm text-destructive">{error.message}</p> : null}
    </div>
  );
}
