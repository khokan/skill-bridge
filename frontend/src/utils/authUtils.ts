export type UserRole = "ADMIN" | "STUDENT" | "TUTOR";

export const authRoutes = [ "/login", "/register" ];

export const isAuthRoute = (pathname : string) => {
    return authRoutes.some((router : string) => router === pathname);
}

export type RouteConfig = {
    exact : string[],
    pattern : RegExp[]
}

export const commonProtectedRoutes : RouteConfig = {
    exact : ["/my-profile", "/change-password"],
    pattern : []
}

export const doctorProtectedRoutes : RouteConfig = {
    pattern: [/^\/doctor\/dashboard/ ], // Matches any path that starts with /doctor/dashboard
    exact : []
}

export const adminProtectedRoutes : RouteConfig = {
    pattern: [/^\/admin(\/|$)/ ], // Matches /admin and any nested admin routes
    exact : []
}

export const superAdminProtectedRoutes : RouteConfig = {
    pattern: [/^\/admin(\/|$)/ ], // Matches /admin and any nested admin routes
    exact : []
}

export const tutorProtectedRoutes : RouteConfig = {
    pattern: [/^\/tutor\/dashboard/ ], // Matches any path that starts with /tutor/dashboard
    exact : []
};

export const studentProtectedRoutes : RouteConfig = {
    pattern: [/^\/dashboard/ ], // Matches any path that starts with /dashboard
    exact : []
};

export const isRouteMatches = (pathname : string, routes : RouteConfig) => {
    if(routes.exact.includes(pathname)) {
        return true;
    }
    return routes.pattern.some((pattern : RegExp) => pattern.test(pathname));
}

export const getRouteOwner = (pathname : string) : "SUPER_ADMIN" | "ADMIN" | "TUTOR" | "STUDENT" | "COMMON" | null => {
    if (isRouteMatches(pathname, superAdminProtectedRoutes)) {
        return "SUPER_ADMIN";
    }

    if(isRouteMatches(pathname, adminProtectedRoutes)) {
        return "ADMIN";
    }
    
    if(isRouteMatches(pathname, tutorProtectedRoutes)) {
        return "TUTOR";
    }

    if(isRouteMatches(pathname, studentProtectedRoutes)) {
        return "STUDENT";
    }

    if(isRouteMatches(pathname, commonProtectedRoutes)) {
        return "COMMON";
    }

    return null; // public route
}

export const getDefaultDashboardRoute = (role : UserRole) => {
    if(role === "ADMIN") {
        return "/admin";
    }
    if(role === "TUTOR") {
        return "/tutor/dashboard";
    }
    if(role === "STUDENT") {
        return "/dashboard";
    }

    return "/";
}

export const isValidRedirectForRole = (redirectPath : string, role : UserRole) => {

    const routeOwner = getRouteOwner(redirectPath);

    if(routeOwner === null || routeOwner === "COMMON"){
        return true;
    }

    if(routeOwner === role){
        return true;
    }

    return false;
}