import Link from "next/link";
import { getTutors } from "@/actions/tutor.actions";
import { getCategories } from "@/actions/tutorProfile.actions";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Clock, Filter, Search, BookOpen, CheckCircle, X } from "lucide-react";

export const dynamic = "force-dynamic";

const pick = (v: unknown) =>
  Array.isArray(v) ? String(v[0] ?? "") : v != null ? String(v) : "";

// Helper function to generate initials from name
const getInitials = (name?: string) => {
  if (!name) return "T";
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Helper function to filter tutors based on rating and experience
const filterTutors = (tutors: any[], minRating?: string, minExperience?: string) => {
  let filtered = [...tutors];
  
  // Filter by rating if specified
  if (minRating && minRating !== "0") {
    const ratingNum = parseFloat(minRating);
    filtered = filtered.filter(t => (t.avgRating || 0) >= ratingNum);
  }
  
  // Filter by experience if specified
  if (minExperience && minExperience !== "0") {
    const expNum = parseInt(minExperience);
    filtered = filtered.filter(t => (t.experienceYrs || 0) >= expNum);
  }
  
  return filtered;
};

export default async function TutorsPage({
  searchParams,
}: {
  searchParams?: any;
}) {
  const sp = await Promise.resolve(searchParams ?? {});
  const page = pick(sp.page) || "1";
  const q = pick(sp.q);
  const category = pick(sp.category);
  const ratingFilter = pick(sp.rating);
  const experienceFilter = pick(sp.experience);

  // Fetch data
  const [{ data, error }, { data: catData }] = await Promise.all([
    getTutors({ q, category }), // Only pass accepted params
    getCategories(),
  ]);

  const tutors = data?.data?.items ?? [];
  const categories = catData?.items ?? [];

  // Apply client-side filtering for rating and experience
  const filteredTutors = filterTutors(
    tutors.length > 0 ? tutors : tutors,
    ratingFilter,
    experienceFilter
  );

  // Apply search filter if query exists
  const finalTutors = q 
    ? filteredTutors.filter(t => 
        t.user?.name?.toLowerCase().includes(q.toLowerCase()) ||
        t.headline?.toLowerCase().includes(q.toLowerCase()) ||
        t.bio?.toLowerCase().includes(q.toLowerCase()) ||
        t.categories?.some((cat: any) => 
          cat.name?.toLowerCase().includes(q.toLowerCase())
        )
      )
    : filteredTutors;

  // Popular categories for quick filters
  const popularCategories = ["mathematics", "physics", "english", "chemistry", "programming", "languages", "business", "art"];

  // Check if any filters are active
  const hasActiveFilters = q || (category && category !== "all") || ratingFilter !== "0" || experienceFilter !== "0";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Find Expert Tutors
            </h1>
            <p className="text-lg text-muted-foreground">
              Connect with verified tutors across hundreds of subjects. Book sessions instantly.
            </p>
          </div>
          
          {/* Stats Bar */}
          <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">
                <span className="font-semibold">{tutors.length}+</span> verified tutors
              </span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-border" />
            {/* <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">
                Average <span className="font-semibold">4.8</span> rating
              </span>
            </div> */}
            <div className="hidden sm:block h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm">
                <span className="font-semibold">24/7</span> availability
              </span>
            </div>
          </div>
        </div>

        {/* Search & Filter Section */}
        <div className="mb-8 space-y-4">
          <form className="space-y-4" action="/tutors" method="GET">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={q}
                placeholder="Search by tutor name, subject, or expertise..."
                className="h-12 pl-10 pr-4 text-base"
              />
            </div>
              <div>
                <Select name="category" defaultValue={category || "all"}>
                  <SelectTrigger className="h-12">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="All Categories" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((c: any) => (
                      <SelectItem key={c.name} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* <div>
                <Select name="rating" defaultValue={ratingFilter || "0"}>
                  <SelectTrigger className="h-12">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      <SelectValue placeholder="Minimum Rating" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any Rating</SelectItem>
                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                    <SelectItem value="4.0">4.0+ Stars</SelectItem>
                    <SelectItem value="3.5">3.5+ Stars</SelectItem>
                    <SelectItem value="3.0">3.0+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
              
              {/* <div>
                <Select name="experience" defaultValue={experienceFilter || "0"}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Experience Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any Experience</SelectItem>
                    <SelectItem value="1">1+ years</SelectItem>
                    <SelectItem value="3">3+ years</SelectItem>
                    <SelectItem value="5">5+ years</SelectItem>
                    <SelectItem value="10">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
              
              <div className="flex gap-2">
                <Button type="submit" className="h-12 flex-1">
                  Apply Filters
                </Button>
                {hasActiveFilters && (
                  <Button 
                    asChild 
                    variant="outline" 
                    className="h-12"
                    type="button"
                  >
                    <Link href="/tutors">
                      <X className="h-4 w-4 mr-2" />
                      Clear All
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </form>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/30 p-3">
              <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
              {q && (
                <Badge variant="secondary" className="gap-1 pl-2 pr-1">
                  Search: {q}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 hover:bg-transparent"
                    asChild
                  >
                    <Link href={`/tutors?${new URLSearchParams({
                      ...(category && category !== "all" && { category }),
                      ...(ratingFilter !== "0" && { rating: ratingFilter }),
                      ...(experienceFilter !== "0" && { experience: experienceFilter })
                    })}`}>
                      <X className="h-3 w-3" />
                    </Link>
                  </Button>
                </Badge>
              )}
              {category && category !== "all" && (
                <Badge variant="secondary" className="gap-1 pl-2 pr-1">
                  Category: {categories.find((c: any) => c.name === category)?.name || category}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 hover:bg-transparent"
                    asChild
                  >
                    <Link href={`/tutors?${new URLSearchParams({
                      ...(q && { q }),
                      ...(ratingFilter !== "0" && { rating: ratingFilter }),
                      ...(experienceFilter !== "0" && { experience: experienceFilter })
                    })}`}>
                      <X className="h-3 w-3" />
                    </Link>
                  </Button>
                </Badge>
              )}
              {ratingFilter && ratingFilter !== "0" && (
                <Badge variant="secondary" className="gap-1 pl-2 pr-1">
                  Rating: {ratingFilter}+
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 hover:bg-transparent"
                    asChild
                  >
                    <Link href={`/tutors?${new URLSearchParams({
                      ...(q && { q }),
                      ...(category && category !== "all" && { category }),
                      ...(experienceFilter !== "0" && { experience: experienceFilter })
                    })}`}>
                      <X className="h-3 w-3" />
                    </Link>
                  </Button>
                </Badge>
              )}
              {experienceFilter && experienceFilter !== "0" && (
                <Badge variant="secondary" className="gap-1 pl-2 pr-1">
                  Experience: {experienceFilter}+ years
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 hover:bg-transparent"
                    asChild
                  >
                    <Link href={`/tutors?${new URLSearchParams({
                      ...(q && { q }),
                      ...(category && category !== "all" && { category }),
                      ...(ratingFilter !== "0" && { rating: ratingFilter })
                    })}`}>
                      <X className="h-3 w-3" />
                    </Link>
                  </Button>
                </Badge>
              )}
            </div>
          )}

          {/* Quick Category Filters */}
          <div className="flex flex-wrap gap-2">
            <Badge 
              key="all-tutors" 
              variant="secondary" 
              className="cursor-pointer hover:bg-secondary/80"
              asChild
            >
              <Link href="/tutors">
                All Tutors
              </Link>
            </Badge>
            {popularCategories.map((cat) => (
              <Badge 
                key={cat}
                variant="outline" 
                className="cursor-pointer hover:bg-primary/10 hover:text-primary"
                asChild
              >
                <Link href={`/tutors?q=&category=${cat.toLowerCase()}`}>
                  {cat}
                </Link>
              </Badge>
            ))}
          </div>
        </div>

        {/* Tutors Grid */}
        {error ? (
          <Card className="border-destructive/50 bg-destructive/10">
            <CardContent className="p-6 text-center">
              <p className="text-destructive font-medium">{error.message}</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {finalTutors.map((tutor: any) => {
                const tutorRating = tutor.avgRating || 4.5;
                const fullStars = Math.floor(tutorRating);
                
                return (
                  <Card 
                    key={tutor.id}
                    className="group relative overflow-hidden rounded-2xl border transition-all hover:shadow-lg hover:border-primary/50"
                  >
                    {/* Verified Badge */}
                    {tutor.isVerified && (
                      <div className="absolute right-3 top-3 z-10">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Verified
                        </Badge>
                      </div>
                    )}

                    <CardContent className="p-6">
                      {/* Tutor Info */}
                      <div className="mb-4 flex items-start gap-4">
                        <Avatar className="h-16 w-16 border-2 border-primary/10">
                          <AvatarImage src={tutor.user?.image || undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary text-lg">
                            {getInitials(tutor.user?.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg leading-tight">
                            {tutor.user?.name ?? "Tutor"}
                          </h3>
                          <p className="text-sm text-primary font-medium">
                            {tutor.headline ?? "Expert Tutor"}
                          </p>
                          
                          {/* Rating */}
                          {/* <div className="mt-2 flex items-center gap-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={`star-${tutor.id}-${i}`}
                                  className={`h-4 w-4 ${
                                    i < fullStars
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "fill-gray-200 text-gray-200"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium">
                              {tutorRating.toFixed(1)}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              ({tutor.reviewCount || 0})
                            </span>
                          </div> */}
                        </div>
                      </div>

                      {/* Bio */}
                     
                      <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                        {tutor.bio || "Experienced tutor with proven track record of student success."}
                      </p>

                      {/* Categories/Tags */}
                      <div className="mb-4 flex flex-wrap gap-2">
                       
                        {(tutor.categories || [{ name: "General" }]).slice(0, 3).map((cat: any, index: number) => (
                        
                          <Badge 
                            key={`category-${tutor.id}-${index}`}
                            variant="secondary" 
                            className="text-xs"
                          >
                            {cat.name}
                          </Badge>
                        ))}
                        {tutor.categories && tutor.categories.length > 3 && (
                          <Badge key={`more-${tutor.id}`} variant="outline" className="text-xs">
                            +{tutor.categories.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Details */}
                      <div className="space-y-3 border-t pt-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            <Clock className="mr-1 inline h-3 w-3" />
                            Experience
                          </span>
                          <span className="font-medium">
                            {tutor.experienceYrs || 3}+ years
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Hourly Rate</span>
                          <div className="text-right">
                            <div className="font-bold text-lg text-primary">
                              {tutor.hourlyRate?.toLocaleString() || "2,000"} {tutor.currency || "BDT"}
                            </div>
                            <div className="text-xs text-muted-foreground">per hour</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="border-t p-6 pt-4">
                      <Button asChild className="w-full group-hover:bg-primary/90" size="lg">
                        <Link href={`/tutors/${tutor.id}`} className="flex items-center justify-center">
                          <BookOpen className="mr-2 h-4 w-4" />
                          View Profile & Book
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            {/* Empty State */}
            {finalTutors.length === 0 && !error && (
              <Card className="border-dashed">
                <CardContent className="p-12 text-center">
                  <div className="mx-auto max-w-md space-y-4">
                    <Search className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <div>
                      <h3 className="text-lg font-semibold">No tutors found</h3>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your search criteria or explore other categories
                      </p>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button asChild variant="outline">
                        <Link href="/tutors">Clear all filters</Link>
                      </Button>
                      <Button asChild>
                        <Link href="/tutors?category=mathematics">Browse Mathematics</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pagination (Simplified) */}
            {/* {finalTutors.length > 0 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button key="prev-btn" variant="outline" disabled>
                  Previous
                </Button>
                <Button key="page-1" variant="outline" className="bg-primary/10 text-primary">
                  1
                </Button>
                <Button key="page-2" variant="outline">2</Button>
                <Button key="page-3" variant="outline">3</Button>
                <Button key="next-btn" variant="outline">
                  Next
                </Button>
              </div>
            )} */}

            {/* CTA Section */}
            <Card className="mt-12 overflow-hidden border-0 bg-gradient-to-r from-primary/10 to-secondary/10">
              <CardContent className="p-8 text-center">
                <div className="mx-auto max-w-2xl space-y-4">
                  <h3 className="text-2xl font-bold">Want to become a tutor?</h3>
                  <p className="text-muted-foreground">
                    Share your knowledge, set your own schedule, and earn on your terms. 
                    Join our community of expert educators.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                    <Button asChild size="lg">
                      <Link href="/register">
                        Apply as Tutor
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link href="/tutors/how-it-works">
                        Learn More
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}