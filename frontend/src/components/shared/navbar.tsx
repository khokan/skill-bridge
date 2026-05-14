import { userService } from "@/services/user.service";
import { Roles } from "@/constants/roles";
import NavbarContent from "./navbar-content";

type Role = "STUDENT" | "TUTOR" | "ADMIN";
type SessionUser = { name?: string; role?: Role };

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
  const user = data?.user as SessionUser | undefined;
  const role = user?.role;
  const menu = linksForRole(role);
  const clientUser = user
    ? {
        name: user.name,
        role: user.role,
      }
    : null;

  return <NavbarContent user={clientUser} menu={menu} />;
}
