import ChangePasswordForm from "@/components/shared/change-password-form";
import { changePassword } from "@/actions/student.action";
import { ShieldCheck, Sparkles, Lock } from "lucide-react";

export default function ChangePasswordDashboardPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden px-4 py-10 sm:py-14">
      <div className="absolute inset-0 bg-linear-to-br from-background via-cyan-50 to-primary/10" />
      <div className="absolute -top-28 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary shadow-sm shadow-primary/10">
            <Sparkles className="h-4 w-4" />
            Password security for every role
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Update your password with confidence.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground">
              This change-password flow works for admin, tutor, and student accounts. Enter your current password, choose a strong new password,
              and keep your account protected across every Skill Bridge experience.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Every role covered",
                description: "Admin, tutor, and student users can update their password from one secure endpoint.",
                icon: ShieldCheck,
              },
              {
                title: "Instant protection",
                description: "Passwords update immediately and revoke other sessions for better account security.",
                icon: Lock,
              },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-border/60 bg-background/80 p-6 shadow-sm shadow-slate-200/40">
                <div className="flex items-center gap-3 text-primary">
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm font-semibold">{item.title}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-1 rounded-[2rem] bg-linear-to-r from-primary/20 via-cyan-100 to-primary/20 blur-2xl" />
          <div className="relative rounded-[2rem] border border-border/60 bg-background/95 p-6 shadow-2xl shadow-slate-900/5">
            <div className="mb-8 space-y-4">
              <div className="inline-flex items-center gap-3 rounded-3xl bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
                <ShieldCheck className="h-4 w-4" />
                Secure account management
              </div>
              <h2 className="text-3xl font-semibold">Change your password</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Securely update your login with the built-in stage and get a seamless password experience.
              </p>
            </div>
            <ChangePasswordForm changePasswordAction={changePassword} />
          </div>
        </div>
      </div>
    </div>
  );
}
