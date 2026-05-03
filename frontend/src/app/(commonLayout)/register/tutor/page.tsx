import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function RegisterTutorPage() {
  // Redirect to register page with tutor role
  // Since we can't pass search params directly in async components,
  // we redirect to the parent register and let the tutor registration form handle it
  redirect("/register");
}
