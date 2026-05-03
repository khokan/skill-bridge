// types/admin.ts
export interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalTutors: number;
  totalAdmins: number;
  activeUsers: number;
  bannedUsers: number;
  totalBookings: number;
  totalCategories: number;
  activeCategories: number;
  bookingByStatus: Array<{
    status: string;
    _count: {
      status: number;
    };
  }>;
}

export interface AdminStatsResponse {
  data: AdminStats;
  error?: {
    message: string;
  };
}