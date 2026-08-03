import { redirect } from "next/navigation";
import { isCmsAuthenticated } from "@/lib/cms-session";

export async function requireAdmin(): Promise<void> {
  if (!(await isCmsAuthenticated())) {
    redirect("/admin/login");
  }
}
