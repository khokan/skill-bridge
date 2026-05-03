import Link from "next/link";
import { Button } from "@/components/ui/button";
import { userService } from "@/services/user.service";
import { Roles } from "@/constants/roles";
import Image from "next/image";
import ThemeToggle from "./theme-toggle";
import type { AuthUser } from "@/lib/types";

type Role = "STUDENT" | "TUTOR" | "ADMIN";


function linksForRole(role?: Role) {
  if (role === Roles.ADMIN) {
    return [
      { href: "/admin", label: "Dashboard" },
      { href: "/admin/users", label: "Users" },
      { href: "/admin/bookings", label: "Bookings" },
      { href: "/admin/categories", label: "Categories" },
    ];
  }
  if (role === Roles.TUTOR) {
    return [
      { href: "/tutor/dashboard", label: "Dashboard" },
      { href: "/tutor/availability", label: "Availability" },
      { href: "/tutor/profile", label: "Profile" },
    ];
  }
  if (role === Roles.STUDENT) {
    return [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/dashboard/bookings", label: "My Bookings" },
      { href: "/dashboard/profile", label: "Profile" },
    ];
  }
  // not logged in (public)
  return [
    { href: "/tutors", label: "Tutors" },
  ];
}

export default async function Navbar() {
  const { data } = await userService.getSession();
  const user = data?.user as AuthUser | undefined;
  const role = user?.role as Role | undefined;

  const menu = linksForRole(role);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur shadow-sm">
      <div className="mx-auto flex h-16 max-w-[90%] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        
      <Link href="/" className="shrink-0">
              <div className="relative w-30 h-10 md:w-40 md:h-16">
                <Image
                  src="/logo.svg"
                  alt="SwiftCart Logo"
                  fill
                  className="object-contain transition-all dark:invert dark:brightness-110 dark:contrast-125"
                  sizes="(max-width: 768px) 7rem, (max-width: 1024px) 10rem, 12rem"
                />
              </div>
            </Link>

        <nav className="flex flex-1 items-center justify-center gap-1 md:gap-2 overflow-x-auto">
          {menu.map((m) => (
            <Button key={m.href} asChild variant="ghost" className="text-slate-700 dark:text-slate-200 hover:bg-primary/10 hover:text-primary">
              <Link href={m.href}>{m.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          {!user ? (
            <>
              <Button asChild variant="ghost" className="text-slate-700 dark:text-slate-200 hover:bg-primary/10 hover:text-primary">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/register">Register</Link>
              </Button>
            </>
          ) : (
            <>
              <div className="hidden text-sm text-muted-foreground md:block">
                {user.name} · {role}
              </div>
              <form action="/api/ui/logout" method="post">
                <Button type="submit" variant="outline" className="border-border/70 bg-background/80 hover:bg-primary/10 hover:text-primary">
                  Logout
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
