import DashboardNavbar from "@/components/modules/Dashboord/DashboardNavbar"
import DashboardSidebar from "@/components/modules/Dashboord/DashboardSidebar"
import { Roles } from "@/constants/roles";
import { userService } from "@/services/user.service";

import React, { ReactNode } from "react"

const RootDashboardLayout = async ({
  admin,
  student,
  tutor,
}: {
  children: ReactNode;
  admin: ReactNode;
  student: ReactNode;
  tutor: ReactNode;
}) => {

      const { data, error } = await userService.getSession();

  if (error) {
    return <div className="p-6 text-sm text-destructive">{error.message}</div>;
  }

  const userInfo = data?.user;

  if (!userInfo) {
    return <div className="p-6 text-sm text-muted-foreground">Not logged in</div>;
  }
  return (
    <div className="flex h-screen overflow-hidden">
        {/* Dashboard Sidebar */}
        <DashboardSidebar />

        <div className="flex flex-1 flex-col overflow-hidden">
            {/* DashboardNavbar */}
            <DashboardNavbar />
            {/* Dashboard Content */}
            <main className="flex-1 overflow-y-auto bg-muted/10 p-4 md:p-6">
                <div>
                    {userInfo.role === Roles.STUDENT
        ? student
        : userInfo.role === Roles.TUTOR
        ? tutor
        : admin}
                </div>
            </main>
        </div>
    </div>
  )
}

export default RootDashboardLayout