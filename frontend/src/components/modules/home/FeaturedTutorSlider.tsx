"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { TutorListItem } from "@/lib/types";

interface FeaturedTutorSliderProps {
  tutors: TutorListItem[];
}

export default function FeaturedTutorSlider({ tutors }: FeaturedTutorSliderProps) {
  const [current, setCurrent] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    setOffset(current * 100);
  }, [current]);

  useEffect(() => {
    if (!isAutoplay) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % tutors.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoplay, tutors.length]);

  const next = () => {
    setCurrent((prev) => (prev + 1) % tutors.length);
    setIsAutoplay(false);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + tutors.length) % tutors.length);
    setIsAutoplay(false);
  };

  return (
    <div className="relative w-full">
      {/* Carousel Container */}
      <div className="relative overflow-hidden rounded-2xl border shadow-xl">
        <div 
          className="carousel-track" 
          // @ts-expect-error - CSS variable for carousel offset
          style={{ "--carousel-offset": `${offset}%` }}
        >
          {tutors.map((tutor) => (
            <div key={tutor.id} className="w-full shrink-0 p-8 md:p-12 bg-linear-to-br from-primary/10 via-background to-primary/5">
              <div className="grid gap-8 items-center md:grid-cols-2">
                {/* Left Content */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-sm font-medium text-primary">
                      <Star className="h-4 w-4 fill-primary" />
                      Featured Tutor
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-900">{tutor.user.name}</h3>
                      <p className="text-base md:text-lg text-slate-600">
                        {tutor.categories.length > 0
                          ? tutor.categories.map((c) => c.category.name).join(" • ")
                          : "Expert Tutor"}
                      </p>
                    </div>
                  </div>

                  {/* Rating & Stats */}
                  <div className="flex items-center gap-6 pt-4 border-t border-slate-200">
                    <div>
                      <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(tutor.avgRating)
                                ? "fill-primary text-primary"
                                : "text-slate-300"
                            }`}
                          />
                        ))}
                        <span className="ml-2 font-semibold text-slate-900">{tutor.avgRating.toFixed(1)}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{tutor.reviewCount} reviews</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">${tutor.hourlyRate}</div>
                      <p className="text-xs text-slate-500">per hour</p>
                    </div>
                  </div>

                  {/* CTA */}
                  <Button asChild size="lg" className="w-full">
                    <Link href={`/tutors/${tutor.id}`}>
                      View Profile & Book
                    </Link>
                  </Button>
                </div>

                {/* Right Avatar */}
                <div className="flex justify-center">
                  <Avatar className="h-48 w-48 border-4 border-primary/20">
                    <AvatarFallback className="bg-primary text-white text-4xl">
                      {tutor.user.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all hover:shadow-xl"
          aria-label="Previous tutor"
        >
          <ChevronLeft className="h-6 w-6 text-slate-900" />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all hover:shadow-xl"
          aria-label="Next tutor"
        >
          <ChevronRight className="h-6 w-6 text-slate-900" />
        </button>

        {/* Indicator Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {tutors.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrent(index);
                setIsAutoplay(false);
              }}
              className={`h-2 rounded-full transition-all ${
                index === current
                  ? "w-8 bg-primary"
                  : "w-2 bg-white/60 hover:bg-white/80"
              }`}
              aria-label={`Go to tutor ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
