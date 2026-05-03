export const dynamic = "force-dynamic";
export const revalidate = 0;

import { ReactNode } from "react";
import { userService } from "@/services/user.service";
import { Roles } from "@/constants/roles";

export default async function DashboardLayout({
  admin,
  student,
  tutor,
}: {
  children: ReactNode;
  admin: ReactNode;
  student: ReactNode;
  tutor: ReactNode;
}) {
  const { data, error } = await userService.getSession();

  if (error) {
    return <div className="p-6 text-sm text-destructive">{error.message}</div>;
  }

  const userInfo = data?.user;

  if (!userInfo) {
    return <div className="p-6 text-sm text-muted-foreground">Not logged in</div>;
  }

  return (
    <div>
      {userInfo.role === Roles.STUDENT
        ? student
        : userInfo.role === Roles.TUTOR
        ? tutor
        : admin}

    </div>
  );
}
