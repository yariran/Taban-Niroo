import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { cmsCredentialsConfigured } from "@/lib/cms-auth";
import { isCmsAuthenticated } from "@/lib/cms-session";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isCmsAuthenticated()) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-[#d8dee6] bg-white p-8 shadow-sm">
        <p className="text-xs text-[#5a6570]">تابان نیرو</p>
        <h1 className="mt-2 text-xl font-semibold">ورود به پنل مدیریت</h1>
        <p className="mt-2 text-sm leading-relaxed text-[#5a6570]">
          نام کاربری و رمز عبور ادمین را وارد کنید.
        </p>
        <div className="mt-6">
          <AdminLoginForm
            credentialsConfigured={cmsCredentialsConfigured()}
          />
        </div>
      </div>
    </div>
  );
}
