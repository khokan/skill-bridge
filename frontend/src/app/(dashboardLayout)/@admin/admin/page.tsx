
import AdminDashboardPage from "@/components/modules/admin/page";
import { DashboardSkeleton } from "@/components/modules/admin/DashboardSkeleton";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function AdminDashboard() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <AdminDashboardPage />
    </Suspense>
  );
}