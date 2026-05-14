"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Lock, ShieldCheck } from "lucide-react";

type ChangePasswordFormProps = {
  changePasswordAction?: (payload: { currentPassword: string; newPassword: string }) => Promise<{ data?: unknown; error?: { message: string } | null }>;
};

export default function ChangePasswordForm({ changePasswordAction }: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess(false);

    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      toast.error("Please fill out all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const result = changePasswordAction
        ? await changePasswordAction({ currentPassword, newPassword })
        : await fetch("/auth/change-password", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              currentPassword,
              newPassword,
            }),
          }).then(async (response) => {
            const data = await response.json();
            return { data: response.ok ? data : null, error: response.ok ? null : { message: data?.message ?? "Unable to update password." } };
          });

      if (result.error) {
        throw new Error(result.error.message);
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(true);
      toast.success(result.data?.message ?? "Password updated successfully.");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="rounded-3xl border border-border/60 bg-background/90 shadow-2xl shadow-primary/10">
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-2xl">Secure password update</CardTitle>
            <CardDescription>Use your current password to set a stronger, safer login credential.</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {success ? (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldCheck className="h-4 w-4" />
              Password updated successfully.
            </div>
            <p className="mt-2 text-muted-foreground">Your account protection is now stronger.</p>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="currentPassword">
              Current password
            </label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              placeholder="Enter current password"
              className="h-12 rounded-xl border-border/70 bg-background/80"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="newPassword">
              New password
            </label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="Enter new password"
              className="h-12 rounded-xl border-border/70 bg-background/80"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="confirmPassword">
              Confirm new password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Repeat new password"
              className="h-12 rounded-xl border-border/70 bg-background/80"
              required
            />
          </div>

          <Button
            type="submit"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-primary to-cyan-500 text-primary-foreground shadow-lg shadow-cyan-500/10 transition-transform duration-200 hover:-translate-y-0.5"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Updating password...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" /> Update password
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
