"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { Calendar, CheckCircle2, Clock3, Mail, MapPin, Shield, User as UserIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type ProfileSummary = {
  id: string;
  name: string;
  email: string;
  role?: string | null;
  status?: string | null;
  phone?: string | null;
  image?: string | null;
  emailVerified?: boolean;
  createdAt?: string | null;
  lastLoginAt?: string | null;
};

type ProfilePanelProps = {
  title: string;
  description?: string;
  profile: ProfileSummary | null;
  mode: "edit" | "preview";
  loading?: boolean;
  onSave?: (payload: { name?: string; phone?: string | null; image?: string | null }) => Promise<void>;
  actionSlot?: ReactNode;
};

const initials = (name?: string | null, email?: string | null) => {
  const source = (name?.trim() || email?.trim() || "U").replace(/[^a-zA-Z0-9 ]/g, "");
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "U")
    .join("");
};

const formatDate = (value?: string | null) => {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
};

const statusTone = (status?: string | null) => {
  const value = (status ?? "ACTIVE").toUpperCase();

  switch (value) {
    case "BANNED":
      return "destructive";
    case "INACTIVE":
      return "secondary";
    default:
      return "outline";
  }
};

export function ProfilePanel({
  title,
  description,
  profile,
  mode,
  loading,
  onSave,
  actionSlot,
}: ProfilePanelProps) {
  const [form, setForm] = useState({ name: "", phone: "", image: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile) return;

    setForm({
      name: profile.name ?? "",
      phone: profile.phone ?? "",
      image: profile.image ?? "",
    });
  }, [profile]);

  const summaryCards = useMemo(
    () => [
      {
        label: "Profile ID",
        value: profile?.id ?? "Not available",
        icon: UserIcon,
      },
      {
        label: "Role",
        value: (profile?.role ?? "User").toString(),
        icon: Shield,
      },
      {
        label: "Joined",
        value: formatDate(profile?.createdAt),
        icon: Calendar,
      },
      {
        label: "Last login",
        value: formatDate(profile?.lastLoginAt),
        icon: Clock3,
      },
    ],
    [profile]
  );

  const handleSave = async () => {
    if (!onSave) return;

    try {
      setSaving(true);
      await onSave({
        name: form.name.trim() || undefined,
        phone: form.phone.trim() ? form.phone.trim() : null,
        image: form.image.trim() ? form.image.trim() : null,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="overflow-hidden border-border/60 bg-card/95 shadow-sm">
      <CardHeader className="space-y-4 border-b bg-muted/20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-2xl">{title}</CardTitle>
            {description ? <CardDescription className="mt-1">{description}</CardDescription> : null}
          </div>
          {actionSlot ? <div className="flex flex-wrap gap-2">{actionSlot}</div> : null}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar className="h-16 w-16 ring-4 ring-background" size="lg">
            <AvatarImage src={profile?.image ?? undefined} alt={profile?.name ?? "Profile avatar"} />
            <AvatarFallback className="text-lg font-semibold">{initials(profile?.name, profile?.email)}</AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-semibold">{profile?.name ?? "Unnamed profile"}</h3>
              <Badge variant={statusTone(profile?.status)}>{(profile?.status ?? "ACTIVE").toString()}</Badge>
              {profile?.emailVerified ? (
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Verified
                </Badge>
              ) : null}
            </div>
            <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              {profile?.email ?? "No email available"}
            </p>
            {profile?.phone ? (
              <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {profile.phone}
              </p>
            ) : null}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.label} className="rounded-2xl border border-border/60 bg-background/80 p-4 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </div>
                <div className={cn("mt-2 break-all text-sm font-medium", item.value === "Not available" && "text-muted-foreground")}>
                  {item.value}
                </div>
              </div>
            );
          })}
        </div>

        {mode === "edit" ? (
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                disabled={loading || saving}
                placeholder="Enter your name"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Phone</label>
              <Input
                value={form.phone}
                onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                disabled={loading || saving}
                placeholder="Optional phone number"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Image URL</label>
              <Input
                value={form.image}
                onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))}
                disabled={loading || saving}
                placeholder="Optional avatar image URL"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {onSave ? (
                <Button onClick={handleSave} disabled={loading || saving}>
                  {saving ? "Saving..." : "Save changes"}
                </Button>
              ) : null}
              {actionSlot ? <div className="flex flex-wrap gap-2">{actionSlot}</div> : null}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
