import { getAdminBookings } from "@/actions/admin.actions";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter, 
  Calendar, 
  DollarSign, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  MoreVertical,
  Download,
  Eye
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type BookingItem = {
  id: string;
  status: string;
  startTime: string;
  endTime: string;
  price: number;
  currency: string;
  subject: string;
  duration: number;
  student: {
    id: string;
    name: string;
    email: string;
  };
  tutor: {
    id: string;
    name: string;
    email: string;
  };
  tutorProfile?: {
    id: string;
    headline: string;
  };
  createdAt: string;
  updatedAt: string;
};

type BookingStatus = "ALL" | "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "REJECTED";

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams?: {
    status?: BookingStatus;
    search?: string;
    sortBy?: "date" | "price" | "created";
    sortOrder?: "asc" | "desc";
  };
}) {
  const { data, error } = await getAdminBookings();
  if (error) return <div className="p-4 text-sm text-destructive">{error.message}</div>;

  const items = (data?.data?.items ?? []) as BookingItem[];
  
  // Extract search params with defaults
  const statusFilter = searchParams?.status || "ALL";
  const searchQuery = searchParams?.search || "";
  const sortBy = searchParams?.sortBy || "date";
  const sortOrder = searchParams?.sortOrder || "desc";

  // Filter and sort bookings
  let filteredItems = [...items];

  // Apply status filter
  if (statusFilter !== "ALL") {
    filteredItems = filteredItems.filter(booking => 
      booking.status.toUpperCase() === statusFilter.toUpperCase()
    );
  }

  // Apply search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredItems = filteredItems.filter(booking => 
      booking.student?.name?.toLowerCase().includes(query) ||
      booking.student?.email?.toLowerCase().includes(query) ||
      booking.tutor?.name?.toLowerCase().includes(query) ||
      booking.tutor?.email?.toLowerCase().includes(query) ||
      booking.subject?.toLowerCase().includes(query) ||
      booking.tutorProfile?.headline?.toLowerCase().includes(query)
    );
  }

  // Apply sorting
  filteredItems.sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case "date":
        aValue = new Date(a.startTime).getTime();
        bValue = new Date(b.startTime).getTime();
        break;
      case "price":
        aValue = a.price;
        bValue = b.price;
        break;
      case "created":
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      default:
        aValue = new Date(a.startTime).getTime();
        bValue = new Date(b.startTime).getTime();
    }

    return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
  });

  // Calculate statistics
  const stats = {
    total: items.length,
    totalRevenue: items.reduce((sum, booking) => sum + booking.price, 0),
    pending: items.filter(b => b.status === "PENDING").length,
    confirmed: items.filter(b => b.status === "CONFIRMED").length,
    completed: items.filter(b => b.status === "COMPLETED").length,
    cancelled: items.filter(b => b.status === "CANCELLED" || b.status === "REJECTED").length,
    averagePrice: items.length > 0 ? items.reduce((sum, b) => sum + b.price, 0) / items.length : 0,
  };

  const getStatusBadge = (status: string) => {
    const statusUpper = status.toUpperCase();
    
    switch (statusUpper) {
      case "PENDING":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="h-3 w-3 mr-1" /> Pending
        </Badge>;
      case "CONFIRMED":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Calendar className="h-3 w-3 mr-1" /> Confirmed
        </Badge>;
      case "COMPLETED":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" /> Completed
        </Badge>;
      case "CANCELLED":
        return <Badge variant="destructive" className="gap-1">
          <XCircle className="h-3 w-3" /> Cancelled
        </Badge>;
      case "REJECTED":
        return <Badge variant="destructive" className="gap-1 bg-red-100 text-red-700 border-red-200">
          <XCircle className="h-3 w-3" /> Rejected
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusCount = (status: string) => {
    return items.filter(b => b.status === status).length;
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings Management</h1>
          <p className="text-muted-foreground">
            View and manage all bookings on the platform
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Link href="/admin/bookings/analytics">
            <Button size="sm">
              <Eye className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">Total Bookings</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">Total Revenue</div>
            <div className="text-2xl font-bold text-green-600">
              ${stats.totalRevenue.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">Confirmed</div>
            <div className="text-2xl font-bold text-blue-600">{stats.confirmed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">Completed</div>
            <div className="text-2xl font-bold text-emerald-600">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">Avg. Price</div>
            <div className="text-2xl font-bold text-purple-600">
              ${stats.averagePrice.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Status Distribution</CardTitle>
          <CardDescription>Breakdown of bookings by status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "REJECTED"].map((status) => (
              <div key={status} className="space-y-2 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{status}</div>
                  <div className="text-2xl font-bold">{getStatusCount(status)}</div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ 
                      width: `${stats.total > 0 ? (getStatusCount(status) / stats.total) * 100 : 0}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <form className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  name="search"
                  placeholder="Search by student, tutor, or subject..."
                  className="pl-9"
                  defaultValue={searchQuery}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select name="status" defaultValue={statusFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select name="sortBy" defaultValue={sortBy}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="created">Created At</SelectItem>
                </SelectContent>
              </Select>
              <Select name="sortOrder" defaultValue={sortOrder}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descending</SelectItem>
                  <SelectItem value="asc">Ascending</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit">Filter</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
          <CardDescription>
            Showing {filteredItems.length} of {items.length} bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== "ALL" 
                  ? "Try changing your filters" 
                  : "No bookings in the system"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Tutor</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
  {filteredItems.map((booking) => {
    // Safe date formatting
    const startDate = booking.startTime ? new Date(booking.startTime) : null;
    const endDate = booking.endTime ? new Date(booking.endTime) : null;
    const createdDate = booking.createdAt ? new Date(booking.createdAt) : null;
    
    return (
      <TableRow key={booking.id}>
        <TableCell className="font-mono text-xs">
          {booking.id.substring(0, 8)}...
        </TableCell>
        <TableCell>
          <div className="space-y-1">
            <div className="font-medium">{booking.student?.name || "N/A"}</div>
            <div className="text-sm text-muted-foreground">
              {booking.student?.email}
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="space-y-1">
            <div className="font-medium">{booking.tutor?.name || "N/A"}</div>
            <div className="text-sm text-muted-foreground">
              {booking.tutor?.email}
            </div>
            {booking.tutorProfile?.headline && (
              <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                {booking.tutorProfile.headline}
              </div>
            )}
          </div>
        </TableCell>
        <TableCell>
          <Badge variant="outline">{booking.subject || "General"}</Badge>
        </TableCell>
        <TableCell>
          <div className="space-y-1">
            <div className="text-sm font-medium">
              {startDate ? format(startDate, "MMM d, yyyy") : "N/A"}
            </div>
            <div className="text-xs text-muted-foreground">
              {startDate ? format(startDate, "h:mm a") : "N/A"} - {endDate ? format(endDate, "h:mm a") : "N/A"}
            </div>
            <div className="text-xs text-muted-foreground">
              Created: {createdDate ? format(createdDate, "MMM d") : "N/A"}
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            {booking.duration || 60} mins
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <span className="mr-2 h-4 w-4  text-green-600">৳</span>
            <span className="font-bold">{booking.price?.toFixed(2) || "0.00"}</span>
            <span className="text-sm text-muted-foreground">{booking.currency || "USD"}</span>
          </div>
        </TableCell>
        <TableCell>
          {getStatusBadge(booking.status || "PENDING")}
        </TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href={`/admin/bookings/${booking.id}`}>
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
              </Link>
              {booking.student?.id && (
                <Link href={`/admin/users/${booking.student.id}`}>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    View Student
                  </DropdownMenuItem>
                </Link>
              )}
              {booking.tutor?.id && (
                <Link href={`/admin/tutors/${booking.tutor.id}`}>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    View Tutor
                  </DropdownMenuItem>
                </Link>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <AlertCircle className="mr-2 h-4 w-4" />
                Cancel Booking
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    );
  })}
</TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Latest bookings created in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items
              .slice(0, 5)
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {booking.student?.name} booked {booking.tutor?.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {booking.subject} • {format(new Date(booking.startTime), "MMM d, h:mm a")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(booking.status)}
                    <div className="text-sm font-medium">
                      ${booking.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}