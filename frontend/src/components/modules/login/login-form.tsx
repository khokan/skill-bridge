
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth";


export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") ?? "/dashboard";

  async function onSubmit(formData: FormData) {
    setLoading(true);
    try {
      const email = String(formData.get("email") ?? "");
      const password = String(formData.get("password") ?? "");

      const { error } = await authClient.signIn.email({ email, password });

      if (error) {
        toast.error(`Login failed: ${error.message}`);
        return;
      }

      toast.success("Welcome back!");
      router.push(next);
      router.refresh();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDemoLogin(email: string, password: string) {
    setLoading(true);
    try {
      const { error } = await authClient.signIn.email({ email, password });

      if (error) {
        toast.error(`Demo login failed: ${error.message}`);
        return;
      }

      toast.success("Logged in successfully");
      router.push(next);
      router.refresh();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden px-4 py-10 sm:py-14">
      <div className="absolute inset-0 bg-linear-to-br from-background via-background to-primary/5" />
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-pulse" />
      <div className="absolute -bottom-20 -left-16 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Secure learning access
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Welcome back to
              <span className="block bg-linear-to-r from-primary via-cyan-500 to-primary bg-clip-text text-transparent">
                Skill Bridge
              </span>
            </h1>
            <p className="mx-auto max-w-xl text-base leading-7 text-muted-foreground lg:mx-0 sm:text-lg">
              Sign in to manage your sessions, track bookings, and continue building your next breakthrough.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Fast access", value: "1-click" },
              { label: "Trusted tutors", value: "Verified" },
              { label: "Flexible booking", value: "Always on" },
              ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-border/60 bg-background/70 p-4 text-left shadow-lg backdrop-blur animate-in fade-in slide-in-from-bottom-4"
              >
                <div className="text-2xl font-semibold text-foreground">{item.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute -inset-1 rounded-3xl bg-linear-to-r from-primary/30 via-cyan-400/20 to-primary/30 blur-xl" />
          <Card className="relative overflow-hidden rounded-3xl border border-border/60 bg-background/80 shadow-2xl backdrop-blur-xl">
            <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary via-cyan-400 to-primary" />
            <CardContent className="p-8 sm:p-10">
              <div className="mb-8 space-y-2 text-center">
                <h2 className="text-3xl font-semibold tracking-tight">Login</h2>
                <p className="text-sm text-muted-foreground">Access your dashboard and bookings.</p>
              </div>

              <form action={onSubmit} className="space-y-4">
                <Input className="h-12 rounded-xl border-border/70 bg-background/80" name="email" placeholder="Email" type="email" required />
                <Input className="h-12 rounded-xl border-border/70 bg-background/80" name="password" placeholder="Password" type="password" required />
                <Button className="h-12 w-full rounded-xl bg-linear-to-r from-primary to-cyan-500 text-primary-foreground shadow-lg transition-transform duration-200 hover:scale-[1.01]" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </form>

              <div className="mt-6 rounded-3xl border border-border/70 bg-muted/70 p-4 text-sm text-muted-foreground">
                <div className="mb-3 text-xs uppercase tracking-[0.2em] text-primary">Demo accounts</div>
                <div className="grid gap-3">
                  <div className="grid gap-2 sm:grid-cols-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 rounded-xl"
                      disabled={loading}
                      onClick={() => void handleDemoLogin("kk@gmail.com", "kk123456")}
                    >
                      Admin
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 rounded-xl"
                      disabled={loading}
                      onClick={() => void handleDemoLogin("tutor1@gmail.com", "kk123456")}
                    >
                      Tutor
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 rounded-xl"
                      disabled={loading}
                      onClick={() => void handleDemoLogin("student1@gmail.com", "kk123456")}
                    >
                      Student
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
