export type Role = "STUDENT" | "TUTOR" | "ADMIN";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "ACTIVE" | "BANNED";
};

export type TutorListItem = {
  id: string; // tutorProfileId
  headline: string | null;
  hourlyRate: number;
  currency: string;
  avgRating: number;
  reviewCount: number;
  user: { id: string; name: string; avatarUrl: string | null };
  categories: { category: { id: string; name: string; slug: string } }[];
};

export type TutorDetails = {
  id: string;
  headline: string | null;
  bio: string | null;
  hourlyRate: number;
  currency: string;
  languages: string[];
  experienceYrs: number;
  education: string | null;
  timezone: string;
  avgRating: number;
  reviewCount: number;
  user: { id: string; name: string; avatarUrl: string | null };
  categories: { category: { id: string; name: string; slug: string } }[];
  reviews: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    student: { id: string; name: string };
  }[];
  availability: { id: string; startTime: string; endTime: string }[];
};

export type Booking = {
  id: string;
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED";
  startTime: string;
  endTime: string;
  price: number;
  currency: string;
  student: { id: string; name: string };
  tutor: { id: string; name: string };
  tutorProfile: { id: string; headline: string | null };
};
