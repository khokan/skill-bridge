import { getTutorById, getTutorReviews } from "@/actions/tutor.actions";
import CreateBookingDialog from "@/components/modules/tutors/create-booking-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Stars } from "@/components/modules/reviews/stars";
import { userService } from "@/services/user.service";

export default async function TutorDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [{ data, error }, { data: reviewsData }] = await Promise.all([
    getTutorById(id),
    getTutorReviews(id),
  ]);

  if (error) {
    return <div className="p-4 text-sm text-destructive">{error.message}</div>;
  }

  const tutor = data?.data;
  const slots = tutor?.availability ?? [];

  const reviewPayload = reviewsData?.data; // { summary, items }
  const summary = reviewPayload?.summary;
  const reviews = reviewPayload?.items ?? [];

  const { data: session } = await userService.getSession();
  const user = session?.user;
  const isLoggedIn = !!user;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      <Card className="rounded-2xl">
        <CardContent className="p-6 space-y-3">
          <div>
            <h1 className="text-2xl font-semibold">{tutor?.user?.name ?? "Tutor"}</h1>
            <p className="text-sm text-muted-foreground">{tutor?.headline ?? "Expert Tutor"}</p>
          </div>

          <div className="flex items-center justify-between rounded-xl border p-3 text-sm">
            <span className="text-muted-foreground">Hourly Rate</span>
            <span className="font-medium">
              {tutor?.hourlyRate} {tutor?.currency ?? "BDT"}
            </span>
          </div>

          {tutor?.bio && (
            <div className="rounded-xl border p-3">
              <div className="text-sm font-medium">About</div>
              <p className="text-sm text-muted-foreground mt-1">{tutor.bio}</p>
            </div>
          )}

          {isLoggedIn ? (
              <CreateBookingDialog tutorProfileId={tutor.id} slots={slots} />
            ) : (
              <div className="rounded-xl border p-3 text-sm text-muted-foreground">
                Please{" "}
                <a href="/login" className="text-primary underline">
                  login
                </a>{" "}
                to book a session.
              </div>
            )}

        </CardContent>
      </Card>

      {/* ✅ Reviews */}
      <Card className="rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Ratings & Reviews</div>
            <div className="text-sm text-muted-foreground">
              {summary?.reviewCount ?? 0} reviews
            </div>
          </div>

          <div className="rounded-xl border p-3">
            <Stars value={summary?.avgRating ?? 0} />
          </div>

          {reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">No reviews yet.</p>
          ) : (
            <div className="space-y-3">
              {reviews.map((r: any) => (
                <div key={r.id} className="rounded-xl border p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{r.student?.name ?? "Student"}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="mt-1">
                    <Stars value={r.rating ?? 0} />
                  </div>

                  {r.comment && (
                    <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Slots */}
      <Card className="rounded-2xl">
        <CardContent className="p-6">
          <div className="font-semibold mb-3">Available Slots</div>

          {slots.length === 0 ? (
            <p className="text-sm text-muted-foreground">No slots available right now.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {slots.map((s: any) => (
                <div key={s.id} className="rounded-xl border p-3 text-sm">
                  <div className="font-medium">{new Date(s.startTime).toLocaleString()}</div>
                  <div className="text-muted-foreground">
                    Ends: {new Date(s.endTime).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
