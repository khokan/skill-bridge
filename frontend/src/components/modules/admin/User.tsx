"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, Ban, CheckCircle, Loader2, Mail, Shield, User } from "lucide-react";
import { toast } from "sonner";

import { getAdminUsers, setUserStatus } from "@/actions/admin.actions";
import { DynamicTable, type DynamicTableColumn, type DynamicTableFilter } from "@/components/shared/dynamic-table";
import { ProfilePanel, type ProfileSummary } from "@/components/shared/profile-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

export default function AdminUsersPage() {
  const [items, setItems] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const { data, error } = await getAdminUsers();
      if (error) throw error;

      const users = ((data?.data?.items ?? data?.data ?? data ?? []) as UserItem[]).filter((u) => {
        const role = (u.role ?? "").toUpperCase();
        return role !== "ADMIN";
      });

      setItems(users);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to load users");
      console.error("Load error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

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
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Update failed");
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

  const filters = useMemo<Array<DynamicTableFilter<UserItem>>>(
    () => [
      {
        id: "role",
        label: "Role",
        defaultValue: "ALL",
        options: [
          { label: "All roles", value: "ALL" },
          { label: "Students", value: "STUDENT" },
          { label: "Tutors", value: "TUTOR" },
        ],
        match: (user, value) => (user.role?.toUpperCase() || "USER") === value,
      },
      {
        id: "status",
        label: "Status",
        defaultValue: "ALL",
        options: [
          { label: "All statuses", value: "ALL" },
          { label: "Active", value: "ACTIVE" },
          { label: "Banned", value: "BANNED" },
        ],
        match: (user, value) => (user.status?.toUpperCase() || "ACTIVE") === value,
      },
    ],
    []
  );

  const columns: Array<DynamicTableColumn<UserItem>> = [
    {
      key: "user",
      header: "User",
      cell: (user) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary/10">
            {user.image ? (
              <Image src={user.image} alt={user.name} width={40} height={40} className="h-full w-full object-cover" />
            ) : (
              getRoleIcon(user.role || "USER")
            )}
          </div>
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-muted-foreground">ID: {user.id.substring(0, 8)}...</div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      cell: (user) => (
        <div className="flex flex-col gap-1">
          {getRoleBadge(user.role || "USER")}
          {getEmailVerifiedBadge(user.emailVerified)}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (user) => getStatusBadge(user.status || "ACTIVE"),
    },
    {
      key: "email",
      header: "Email",
      cell: (user) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          {user.email}
        </div>
      ),
    },
    {
      key: "joined",
      header: "Joined",
      cell: (user) => (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-muted text-[10px] font-semibold">•</span>
          {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
        </div>
      ),
    },
    {
      key: "actions",
      header: <div className="text-right">Actions</div>,
      className: "text-right",
      cell: (user) => {
        const userStatus = user.status?.toUpperCase() || "ACTIVE";
        const isBanned = userStatus === "BANNED";

        return (
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
              View profile
            </Button>

            <AlertDialog>
              <AlertDialogAction asChild>
                <Button
                  size="sm"
                  variant={isBanned ? "default" : "destructive"}
                  disabled={processing === user.id}
                >
                  {processing === user.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isBanned ? "Unban user" : "Ban user"}
                </Button>
              </AlertDialogAction>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{isBanned ? "Unban User" : "Ban User"}</AlertDialogTitle>
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
                    {processing === user.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isBanned ? "Unban User" : "Ban User"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts, roles, status, and profile access
          </p>
        </div>
        <Button onClick={load} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Refresh
        </Button>
      </div>

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

      {loading && items.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      ) : (
        <DynamicTable
          title="Users"
          description="Search, filter, page through records, and open a profile preview from the same table surface."
          items={items}
          rowKey={(user) => user.id}
          columns={columns}
          filters={filters}
          initialPageSize={8}
          searchPlaceholder="Search users by name, email, or role..."
          searchMatch={(user, query) =>
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            (user.role ?? "").toLowerCase().includes(query)
          }
          emptyTitle="No users found"
          emptyDescription="Try changing your search or filters."
          actions={
            <Button onClick={load} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Refresh
            </Button>
          }
        />
      )}

      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User profile</DialogTitle>
          </DialogHeader>
          <ProfilePanel
            title={selectedUser?.name ?? "User profile"}
            description="Read-only profile preview with account status and quick metadata."
            profile={selectedUser as ProfileSummary | null}
            mode="preview"
            actionSlot={
              selectedUser ? (
                <Button
                  variant={selectedUser.status?.toUpperCase() === "BANNED" ? "default" : "destructive"}
                  onClick={() => toggleBan(selectedUser.id, selectedUser.status?.toUpperCase() || "ACTIVE")}
                  disabled={processing === selectedUser.id}
                >
                  {processing === selectedUser.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {selectedUser.status?.toUpperCase() === "BANNED" ? "Unban user" : "Ban user"}
                </Button>
              ) : null
            }
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}