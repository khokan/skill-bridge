import { NavSection } from "@/types/dashboard.types";
import { getDefaultDashboardRoute, UserRole } from "./authUtils";

type DashboardRole = UserRole | "TUTOR";

export const getCommonNavItems = (role : DashboardRole) : NavSection[] => {
    const defaultDashboard = getDefaultDashboardRoute(role as UserRole);
    const changePasswordHref =
        role === "ADMIN"
            ? "/admin/change-password"
            : role === "TUTOR"
            ? "/tutor/dashboard/change-password"
            : "/dashboard/change-password";

    return [
        {
            items : [
                {
                    title : "Home",
                    href : "/",
                    icon : "Home"
                },
                {
                    title : "Dashboard",
                    href : defaultDashboard,
                    icon : "LayoutDashboard"

                },
            ]
        },
        {
            title : "Settings",
            items : [
                {
                    title : "Change Password",
                    href : changePasswordHref,
                    icon : "Settings"
                }
            ]
        }
    ]
}

export const adminNavItems: NavSection[] = [
    {
        title: "Admin",
        items: [
            {
                title: "Users",
                href: "/admin/users",
                icon: "Shield",
            },
            {
                title: "Bookings",
                href: "/admin/bookings",
                icon: "Calendar",
            },
            {
                title: "Categories",
                href: "/admin/categories",
                icon: "Users",
            },
            {
                title: "Profile",
                href: "/admin/profile",
                icon: "User",
            },
        ],
    },
];

export const tutorNavItems: NavSection[] = [
    {
        title: "Tutor",
        items: [
            {
                title: "Availability",
                href: "/tutor/availability",
                icon: "Calendar",
            },
            {
                title: "Profile",
                href: "/tutor/profile",
                icon: "User",
            },
        ],
    },
];

export const studentNavItems: NavSection[] = [
    {
        title: "Student",
        items: [
            {
                title: "My Bookings",
                href: "/dashboard/bookings",
                icon: "Calendar",
            },
            {
                title: "Profile",
                href: "/dashboard/profile",
                icon: "User",
            },
        ],
    },
  ];

export const getNavItemsByRole = (role : DashboardRole) : NavSection[] => {
    const commonNavItems = getCommonNavItems(role);

    switch (role) {
        case "ADMIN":
            return [...commonNavItems, ...adminNavItems];
        case "TUTOR":
            return [...commonNavItems, ...tutorNavItems];
        case "STUDENT":
            return [...commonNavItems, ...studentNavItems]
    }
    return commonNavItems
}