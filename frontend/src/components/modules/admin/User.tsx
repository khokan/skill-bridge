"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Ban, 
  CheckCircle, 
  Shield, 
  User, 
  Mail, 
  Calendar,
  Loader2,
  AlertCircle
} from "lucide-react";
import { getAdminUsers, setUserStatus } from "@/actions/admin.actions";
import { formatDistanceToNow } from "date-fns";

type UserItem = {
  id: string;
  name: string;
  email: string;
  role?: string | null;
  status?: string | null;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
  image?: string;
};

type UserRole = "STUDENT" | "TUTOR" | "ADMIN" | "ALL";
type UserStatus = "ACTIVE" | "BANNED" | "ALL";

export default function AdminUsersPage() {
  const [items, setItems] = useState<UserItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole>("ALL");
  const [statusFilter, setStatusFilter] = useState<UserStatus>("ALL");

  const load = async () => {
    try {
      setLoading(true);
      const { data, error } = await getAdminUsers();
      if (error) throw error;

      const users = (data?.data?.items ?? []) as UserItem[];
      
      // Filter out admins (unless we want to see them)
      const nonAdminUsers = users.filter((u) => {
        const role = (u.role ?? "").toUpperCase();
        return role !== "ADMIN";
      });
      
      setItems(nonAdminUsers);
      setFilteredItems(nonAdminUsers);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to load users");
      console.error("Load error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Filter users based on search and filters
  useEffect(() => {
    let result = items;

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.role?.toLowerCase().includes(searchLower)
      );
    }

    // Role filter
    if (roleFilter !== "ALL") {
      result = result.filter(user => 
        (user.role?.toUpperCase() || "USER") === roleFilter
      );
    }

    // Status filter
    if (statusFilter !== "ALL") {
      result = result.filter(user => 
        (user.status?.toUpperCase() || "ACTIVE") === statusFilter
      );
    }

    setFilteredItems(result);
  }, [search, roleFilter, statusFilter, items]);

  const toggleBan = async (userId: string, currentStatus: string) => {
    try {
      setProcessing(userId);
      
      const nextStatus = currentStatus === "BANNED" ? "ACTIVE" : "BANNED";
      
      const { error } = await setUserStatus(userId, nextStatus as "ACTIVE" | "BANNED");
      if (error) throw error;

      toast.success(nextStatus === "BANNED" ? "User banned successfully" : "User unbanned successfully");
      
      // Update local state
      setItems(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, status: nextStatus }
          : user
      ));
    } catch (e: any) {
      toast.error(e?.message ?? "Update failed");
    } finally {
      setProcessing(null);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role?.toUpperCase()) {
      case "TUTOR": return <Shield className="h-4 w-4 text-purple-500" />;
      case "STUDENT": return <User className="h-4 w-4 text-blue-500" />;
      default: return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusUpper = status?.toUpperCase() || "ACTIVE";
    
    if (statusUpper === "BANNED") {
      return <Badge variant="destructive" className="gap-1"><Ban className="h-3 w-3" /> Banned</Badge>;
    }
    
    return <Badge variant="outline" className="gap-1 bg-green-50 text-green-700 border-green-200">
      <CheckCircle className="h-3 w-3" /> Active
    </Badge>;
  };

  const getRoleBadge = (role: string) => {
    const roleUpper = role?.toUpperCase() || "USER";
    
    switch (roleUpper) {
      case "TUTOR":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Tutor</Badge>;
      case "STUDENT":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Student</Badge>;
      default:
        return <Badge variant="outline">User</Badge>;
    }
  };

  const getEmailVerifiedBadge = (verified: boolean) => {
    return verified ? (
      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
        <Mail className="h-3 w-3 mr-1" /> Verified
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
        <AlertCircle className="h-3 w-3 mr-1" /> Unverified
      </Badge>
    );
  };

  // Statistics
  const stats = {
    total: items.length,
    active: items.filter(u => (u.status?.toUpperCase() || "ACTIVE") === "ACTIVE").length,
    banned: items.filter(u => (u.status?.toUpperCase() || "ACTIVE") === "BANNED").length,
    students: items.filter(u => (u.role?.toUpperCase() || "USER") === "STUDENT").length,
    tutors: items.filter(u => (u.role?.toUpperCase() || "USER") === "TUTOR").length,
    verified: items.filter(u => u.emailVerified).length,
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and status
          </p>
        </div>
        <Button onClick={load} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">Total Users</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">Active</div>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">Banned</div>
            <div className="text-2xl font-bold text-red-600">{stats.banned}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">Students</div>
            <div className="text-2xl font-bold text-blue-600">{stats.students}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">Tutors</div>
            <div className="text-2xl font-bold text-purple-600">{stats.tutors}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">Verified</div>
            <div className="text-2xl font-bold text-emerald-600">{stats.verified}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name, email, or role..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={(value: UserRole) => setRoleFilter(value)}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Roles</SelectItem>
                  <SelectItem value="STUDENT">Students</SelectItem>
                  <SelectItem value="TUTOR">Tutors</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(value: UserStatus) => setStatusFilter(value)}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="BANNED">Banned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Showing {filteredItems.length} of {items.length} users
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No users found</h3>
              <p className="text-muted-foreground">
                {search || roleFilter !== "ALL" || statusFilter !== "ALL" 
                  ? "Try changing your filters" 
                  : "No users in the system"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((user) => {
                    const userStatus = user.status?.toUpperCase() || "ACTIVE";
                    const isBanned = userStatus === "BANNED";
                    
                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              {getRoleIcon(user.role || "USER")}
                            </div>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">
                                ID: {user.id.substring(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {getRoleBadge(user.role || "USER")}
                            {getEmailVerifiedBadge(user.emailVerified)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(user.status || "ACTIVE")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {user.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem className={isBanned ? "text-green-600" : "text-red-600"}>
                                    <Ban className="mr-2 h-4 w-4" />
                                    {isBanned ? "Unban User" : "Ban User"}
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <DropdownMenuItem>
                                  <Shield className="mr-2 h-4 w-4" />
                                  Change Role
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Resend Verification
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  {isBanned ? "Unban User" : "Ban User"}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to {isBanned ? "unban" : "ban"} {user.name}?
                                  {!isBanned && " This will prevent them from logging in."}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => toggleBan(user.id, userStatus)}
                                  className={isBanned ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
                                  disabled={processing === user.id}
                                >
                                  {processing === user.id ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  ) : null}
                                  {isBanned ? "Unban User" : "Ban User"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
    </div>
  );
}