import { redirect } from "next/navigation";

export default function RootPage() {
  // Automatically redirect from '/' to '/dashboard'
  redirect("/dashboard");
}
