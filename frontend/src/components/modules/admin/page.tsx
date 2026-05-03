import { getAdminStats } from "@/actions/admin.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, BookOpen, UserCheck, ShieldAlert, BarChart3, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboardPage() {
  const { data, error } = await getAdminStats();

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>
          Failed to load dashboard data: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  const stats = data?.data || {
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
  };

  // Define tiles with icons
  const tiles = [
    { 
      label: "Total Users", 
      value: stats.totalUsers, 
      icon: Users,
      color: "bg-blue-500",
      change: "+12%",
    },
    { 
      label: "Students", 
      value: stats.totalStudents, 
      icon: BookOpen,
      color: "bg-green-500",
    },
    { 
      label: "Tutors", 
      value: stats.totalTutors, 
      icon: UserCheck,
      color: "bg-purple-500",
    },
    { 
      label: "Admins", 
      value: stats.totalAdmins, 
      icon: ShieldAlert,
      color: "bg-red-500",
    },
    { 
      label: "Active Users", 
      value: stats.activeUsers, 
      icon: Users,
      color: "bg-emerald-500",
      change: "+5%",
    },
    { 
      label: "Banned Users", 
      value: stats.bannedUsers, 
      icon: ShieldAlert,
      color: "bg-rose-500",
    },
    { 
      label: "Bookings", 
      value: stats.totalBookings, 
      icon: Calendar,
      color: "bg-amber-500",
      change: "+23%",
    },
    { 
      label: "Categories", 
      value: stats.totalCategories, 
      icon: BarChart3,
      color: "bg-indigo-500",
    },
    { 
      label: "Active Categories", 
      value: stats.activeCategories, 
      icon: BarChart3,
      color: "bg-teal-500",
    },
  ];

  // Status colors for bookings
  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
    REJECTED: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of platform statistics and activities
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {tiles.map((tile) => (
          <Card key={tile.label} className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{tile.label}</p>
                  <p className="text-3xl font-bold">{tile.value.toLocaleString()}</p>
                  {tile.change && (
                    <p className="text-xs font-medium text-green-600">
                      {tile.change} from last month
                    </p>
                  )}
                </div>
                <div className={`${tile.color} p-3 rounded-full`}>
                  <tile.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bookings by Status */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Bookings by Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(stats.bookingByStatus || []).map((item: any) => {
              const status = item.status || "UNKNOWN";
              const count = item._count?.status || 0;
              const percentage = stats.totalBookings > 0 
                ? Math.round((count / stats.totalBookings) * 100) 
                : 0;

              return (
                <div key={status} className="space-y-2 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="outline" 
                      className={`font-medium ${statusColors[status] || "bg-gray-100 text-gray-800"}`}
                    >
                      {status}
                    </Badge>
                    <span className="text-2xl font-bold">{count}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Percentage</span>
                      <span className="font-medium">{percentage}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* User Distribution */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: "Students", value: stats.totalStudents, color: "bg-green-500" },
                { label: "Tutors", value: stats.totalTutors, color: "bg-purple-500" },
                { label: "Admins", value: stats.totalAdmins, color: "bg-red-500" },
              ].map((item) => {
                const percentage = stats.totalUsers > 0 
                  ? Math.round((item.value / stats.totalUsers) * 100) 
                  : 0;

                return (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-muted-foreground">
                        {item.value} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Platform Health */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Platform Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Users</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{stats.activeUsers}</span>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  Active
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Banned Users</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{stats.bannedUsers}</span>
                <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
                  Banned
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Categories</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{stats.activeCategories}</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  of {stats.totalCategories}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Empty State if no bookings */}
      {(!stats.bookingByStatus || stats.bookingByStatus.length === 0) && (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Bookings Data</h3>
            <p className="text-muted-foreground">
              There are no booking records available yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}