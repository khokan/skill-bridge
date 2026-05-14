import Image from "next/image";
import { getTutorById, getTutorReviews, getTutors } from "@/actions/tutor.actions";
import CreateBookingDialog from "@/components/modules/tutors/create-booking-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Stars } from "@/components/modules/reviews/stars";
import { userService } from "@/services/user.service";
import Navbar from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

type Category = {
  name: string;
};

type TutorProfile = {
  id: string;
  user?: {
    name?: string;
    image?: string;
  };
  headline?: string;
  bio?: string;
  avgRating?: number;
  reviewCount?: number;
  experienceYrs?: number;
  categories?: Category[];
  hourlyRate?: number;
  currency?: string;
  languages?: string[];
  availability?: Slot[];
};

type Review = {
  id: string;
  student?: {
    name?: string;
  };
  rating?: number;
  comment?: string;
  createdAt?: string;
};

type Slot = {
  id: string;
  startTime: string;
  endTime: string;
};

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

  const tutor = data?.data as TutorProfile | undefined;
  if (!tutor) {
    return <div className="p-4 text-sm text-destructive">Tutor not found.</div>;
  }
  const relatedCategory = tutor.categories?.[0]?.name;
  const { data: relatedData } = await getTutors(
    relatedCategory ? { category: relatedCategory } : undefined
  );
  const relatedTutors = ((relatedData?.data?.items ?? []) as TutorProfile[])
    .filter((item) => item.id !== tutor?.id)
    .slice(0, 3);

  const slots = (tutor?.availability ?? []) as Slot[];

  const reviewPayload = reviewsData?.data; // { summary, items }
  const summary = reviewPayload?.summary;
  const reviews = reviewPayload?.items ?? [];

  const { data: session } = await userService.getSession();
  const user = session?.user;
  const isLoggedIn = !!user;

  return (
    <>
    <Navbar />
    <div className="mx-auto max-w-4xl space-y-6 p-4 font-sans">
      <Card className="overflow-hidden rounded-[2rem] border border-primary/10 shadow-xl">
        <div className="relative h-72 overflow-hidden bg-slate-200 sm:h-80 lg:h-96">
          {tutor?.user?.image ? (
            <Image
              src={tutor.user.image}
              alt={tutor?.user?.name || "Tutor image"}
              fill
              sizes="100vw"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-slate-100 text-slate-500">
              <span className="text-xl font-semibold">No image available</span>
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
          <div className="absolute left-6 bottom-6 right-6 text-white">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-white">
              Top-rated tutor
            </div>
            <div className="mt-4 max-w-2xl space-y-3">
              <h1 className="text-4xl font-semibold sm:text-5xl">{tutor?.user?.name ?? "Tutor"}</h1>
              <p className="max-w-2xl text-sm text-white/90">{tutor?.headline ?? "Expert Tutor"}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-white/10 px-3 py-1">{tutor?.experienceYrs || 3}+ yrs exp</span>
                <span className="rounded-full bg-white/10 px-3 py-1">{tutor?.categories?.[0]?.name ?? "General"}</span>
                <span className="rounded-full bg-white/10 px-3 py-1">{summary?.avgRating?.toFixed(1) ?? "4.8"}★</span>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="grid gap-8 lg:grid-cols-[1.5fr_0.9fr] p-8">
          <div className="space-y-6">
            <div className="rounded-3xl border border-border/70 bg-white/95 p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">About</p>
                  <p className="mt-3 text-sm text-slate-700">{tutor?.bio ?? "Experienced tutor with a proven track record of student success."}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Hourly Rate</p>
                  <p className="text-2xl font-semibold text-primary">{tutor?.hourlyRate ?? 2000} {tutor?.currency ?? "BDT"}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border/70 bg-white/95 p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Specialties</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(tutor?.categories || [{ name: "General" }]).slice(0, 4).map((category: Category, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-border/70 bg-white/95 p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Student rating</p>
              <div className="mt-4 flex items-center justify-between gap-4">
                <div>
                  <div className="text-4xl font-semibold text-primary">{summary?.avgRating?.toFixed(1) ?? "4.8"}★</div>
                  <p className="text-sm text-muted-foreground">{summary?.reviewCount ?? 0} reviews</p>
                </div>
                <Stars value={summary?.avgRating ?? 0} />
              </div>
            </div>

            <div className="rounded-3xl border border-border/70 bg-white/95 p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Ready to book?</p>
              {isLoggedIn ? (
                <CreateBookingDialog tutorProfileId={tutor.id} slots={slots} />
              ) : (
                <Button asChild className="w-full">
                  <a href="/login">Login to book your first session</a>
                </Button>
              )}
            </div>
          </div>
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
              {reviews.map((r: Review) => (
                <div key={r.id} className="rounded-xl border p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{r.student?.name ?? "Student"}</div>
                    <div className="text-sm text-muted-foreground">
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}
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
              {slots.map((s: Slot) => (
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

      {relatedTutors.length > 0 && (
        <Card className="rounded-2xl">
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Related tutors</h2>
                <p className="text-sm text-muted-foreground">More tutors in {relatedCategory ?? "this category"} recommended for you.</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {relatedTutors.map((related: TutorProfile) => (
                <Card key={related.id} className="rounded-3xl border p-4 shadow-sm">
                  <div className="relative mb-4 h-32 overflow-hidden rounded-3xl bg-slate-100">
                    {related.user?.image ? (
                      <Image
                        src={related.user.image}
                        alt={related.user?.name || "Tutor image"}
                        fill
                        sizes="100vw"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No image</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{related.user?.name ?? "Tutor"}</h3>
                    <p className="text-sm text-muted-foreground">{related.headline ?? "Experienced tutor"}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{related.experienceYrs || 3}+ yrs</span>
                      <span>{(related.avgRating || 4.8).toFixed(1)}★</span>
                    </div>
                  </div>
                  <Button asChild size="sm" className="mt-4 w-full">
                    <a href={`/tutors/${related.id}`}>View profile</a>
                  </Button>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
    <Footer />
    </>
  );
}
