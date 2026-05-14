import { getAdminStats } from "@/actions/admin.actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, BookOpen, Calendar, ShieldAlert, UserCheck, Users } from "lucide-react";

import type { AdminDashboardStats } from "@/types/dashboard.types";
import AdminAnalyticsCharts from "@/components/modules/admin/admin-analytics";

export default async function AdminDashboardPage() {
  const { data, error } = await getAdminStats();

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>Failed to load dashboard data: {error.message}</AlertDescription>
      </Alert>
    );
  }

  const stats = (data?.data ?? data ?? {}) as Partial<AdminDashboardStats> & {
    bookingByStatus?: Array<{ status?: string; _count?: { status?: number } }>;
  };

  const dashboardStats: AdminDashboardStats = {
    totalUsers: 0,
    totalStudents: 0,
    totalTutors: 0,
    totalAdmins: 0,
    activeUsers: 0,
    bannedUsers: 0,
    totalBookings: 0,
    totalCategories: 0,
    activeCategories: 0,
    bookingByStatus: [],
    barChartData: [],
    pieChartData: [],
    ...stats,
  };

  const tiles = [
    { label: "Total Users", value: dashboardStats.totalUsers, icon: Users, color: "bg-blue-500" },
    { label: "Students", value: dashboardStats.totalStudents, icon: BookOpen, color: "bg-green-500" },
    { label: "Tutors", value: dashboardStats.totalTutors, icon: UserCheck, color: "bg-purple-500" },
    { label: "Admins", value: dashboardStats.totalAdmins, icon: ShieldAlert, color: "bg-red-500" },
    { label: "Active Users", value: dashboardStats.activeUsers, icon: Users, color: "bg-emerald-500" },
    { label: "Banned Users", value: dashboardStats.bannedUsers, icon: ShieldAlert, color: "bg-rose-500" },
    { label: "Bookings", value: dashboardStats.totalBookings, icon: Calendar, color: "bg-amber-500" },
    { label: "Categories", value: dashboardStats.totalCategories, icon: BarChart3, color: "bg-indigo-500" },
    { label: "Active Categories", value: dashboardStats.activeCategories, icon: BarChart3, color: "bg-teal-500" },
  ];

  const userDistribution = [
    { label: "Students", value: dashboardStats.totalStudents, color: "bg-green-500", fillClass: "fill-green-500" },
    { label: "Tutors", value: dashboardStats.totalTutors, color: "bg-purple-500", fillClass: "fill-purple-500" },
    { label: "Admins", value: dashboardStats.totalAdmins, color: "bg-red-500", fillClass: "fill-red-500" },
  ];

  const barChartData =
    dashboardStats.barChartData.length > 0
      ? dashboardStats.barChartData
      : [
          { month: "Students", count: dashboardStats.totalStudents },
          { month: "Tutors", count: dashboardStats.totalTutors },
        ];

  const pieChartData =
    dashboardStats.pieChartData.length > 0
      ? dashboardStats.pieChartData
      : dashboardStats.bookingByStatus.map((item) => ({
          status: item.status ?? "UNKNOWN",
          count: item._count?.status ?? 0,
        }));

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of platform statistics, chart trends, and status mix.</p>
        </div>
        <div className="rounded-full border bg-card px-3 py-1.5 text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {tiles.map((tile) => (
          <Card key={tile.label} className="overflow-hidden border-border/60 shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{tile.label}</p>
                  <p className="text-3xl font-bold">{tile.value.toLocaleString()}</p>
                </div>
                <div className={`${tile.color} rounded-2xl p-3`}>
                  <tile.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AdminAnalyticsCharts barChartData={barChartData} pieChartData={pieChartData} />

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="border-border/60 bg-card/95 shadow-sm">
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {userDistribution.map((item) => {
              const percentage = dashboardStats.totalUsers > 0 ? Math.round((item.value / dashboardStats.totalUsers) * 100) : 0;

              return (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.label}</span>
                    <span className="text-muted-foreground">
                      {item.value} ({percentage}%)
                    </span>
                  </div>
                  <svg viewBox="0 0 100 8" className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <rect x="0" y="0" width="100" height="8" rx="4" fill="hsl(var(--muted))" />
                    <rect x="0" y="0" width={percentage} height="8" rx="4" className={item.fillClass} />
                  </svg>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/95 shadow-sm">
          <CardHeader>
            <CardTitle>Platform Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium">Active Users</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{dashboardStats.activeUsers}</span>
                <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                  Active
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium">Banned Users</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{dashboardStats.bannedUsers}</span>
                <Badge variant="outline" className="border-rose-200 bg-rose-50 text-rose-700">
                  Banned
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium">Active Categories</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{dashboardStats.activeCategories}</span>
                <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                  of {dashboardStats.totalCategories}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}