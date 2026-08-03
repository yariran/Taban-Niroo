import type { ReactNode } from "react";

export const metadata = {
  title: "پنل مدیریت | تابان نیرو",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <div
      lang="fa"
      dir="rtl"
      className="min-h-screen bg-[#f4f6f8] font-sans text-[#0f1720] antialiased"
    >
      {children}
    </div>
  );
}
