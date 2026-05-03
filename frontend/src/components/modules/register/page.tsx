"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth";

export default function RegisterPage() {
  const [role, setRole] = useState<"STUDENT" | "TUTOR">("STUDENT");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(formData: FormData) {
    setLoading(true);
    try {
      const payload = {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
        role,
      };

      const {data, error} = await  authClient.signUp.email(payload);

      if(error) {
      toast.error(`Registration failed: ${error.message}`);
      return;
     }

      toast.success("Account created!");
      router.push(role === "TUTOR" ? "/tutor/dashboard" : "/dashboard");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden px-4 py-10 sm:py-14">
      <div className="absolute inset-0 bg-linear-to-br from-background via-background to-primary/5" />
      <div className="absolute -top-28 -left-20 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl animate-pulse" />
      <div className="absolute -bottom-24 -right-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="order-2 space-y-6 text-center lg:order-1 lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
            Start your learning path
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Create your
              <span className="block bg-linear-to-r from-cyan-500 via-primary to-cyan-500 bg-clip-text text-transparent">
                Skill Bridge account
              </span>
            </h1>
            <p className="mx-auto max-w-xl text-base leading-7 text-muted-foreground lg:mx-0 sm:text-lg">
              Join as a student or tutor, set up your profile, and unlock an experience built for real progress.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Onboarding", value: "Quick setup" },
              { label: "Profiles", value: "Role aware" },
              { label: "Experience", value: "Polished" },
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

        <div className="order-1 relative mx-auto w-full max-w-md lg:order-2">
          <div className="absolute -inset-1 rounded-3xl bg-linear-to-r from-cyan-400/25 via-primary/25 to-cyan-400/25 blur-xl" />
          <Card className="relative overflow-hidden rounded-3xl border border-border/60 bg-background/80 shadow-2xl backdrop-blur-xl">
            <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-cyan-400 via-primary to-cyan-400" />
            <CardContent className="p-8 sm:p-10">
              <div className="mb-8 space-y-2 text-center">
                <h2 className="text-3xl font-semibold tracking-tight">Create account</h2>
                <p className="text-sm text-muted-foreground">Choose your role during signup.</p>
              </div>

              <div className="grid grid-cols-2 gap-2 rounded-2xl bg-muted/50 p-1">
                <Button
                  type="button"
                  variant={role === "STUDENT" ? "default" : "ghost"}
                  className="h-11 rounded-xl"
                  onClick={() => setRole("STUDENT")}
                >
                  Student
                </Button>
                <Button
                  type="button"
                  variant={role === "TUTOR" ? "default" : "ghost"}
                  className="h-11 rounded-xl"
                  onClick={() => setRole("TUTOR")}
                >
                  Tutor
                </Button>
              </div>

              <form action={onSubmit} className="mt-5 space-y-4">
                <Input className="h-12 rounded-xl border-border/70 bg-background/80" name="name" placeholder="Full name" required />
                <Input className="h-12 rounded-xl border-border/70 bg-background/80" name="email" placeholder="Email" type="email" required />
                <Input className="h-12 rounded-xl border-border/70 bg-background/80" name="password" placeholder="Password" type="password" required />
                <Button className="h-12 w-full rounded-xl bg-linear-to-r from-cyan-500 to-primary text-primary-foreground shadow-lg transition-transform duration-200 hover:scale-[1.01]" disabled={loading}>
                  {loading ? "Creating..." : "Create account"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
