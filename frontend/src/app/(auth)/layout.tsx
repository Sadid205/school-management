"use client";

import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname.includes("login")) return "Login";
    if (pathname.includes("register")) return "Register";
    if (pathname.includes("forgot-password")) return "Forgot Password";
    if (pathname.includes("otp-verify")) return "OTP Verification";
    return "Authentication";
  };

  return (
    <div className="flex h-screen min-h-[600px] overflow-hidden">
      {/* Left Panel - Navy Background */}
      <div className="hidden lg:flex lg:w-[42%] bg-navy flex-col justify-between p-10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full border-2 border-amber/15" />
        <div className="absolute -bottom-16 -left-16 w-[220px] h-[220px] rounded-full border-2 border-amber/10" />

        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-10 h-10 text-xl font-bold rounded-lg bg-amber text-navy">
              E
            </div>
            <div>
              <div className="text-white text-[22px] font-bold tracking-tight">
                EduNest
              </div>
              <div className="text-amber text-[11px] tracking-[2px] uppercase">
                School Management
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <h2 className="text-white text-[28px] font-bold leading-tight mb-3">
            একটি প্ল্যাটফর্মে পুরো স্কুল পরিচালনা করুন
          </h2>
          <p className="text-[rgba(168,190,221,1)] text-sm leading-relaxed">
            ছাত্র-শিক্ষক-অভিভাবক — সবার জন্য একটি স্মার্ট সমাধান। উপস্থিতি,
            পরীক্ষা, ফলাফল সবকিছু এক জায়গায়।
          </p>
        </div>

        <div className="relative z-10 flex gap-6">
          {[
            { num: "5K+", label: "Students" },
            { num: "200+", label: "Teachers" },
            { num: "98%", label: "Attendance" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-lg px-5 py-3.5"
            >
              <div className="text-amber text-[22px] font-bold">{stat.num}</div>
              <div className="text-[rgba(168,190,221,1)] text-[11px] mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Form Area */}
      <div className="flex items-center justify-center flex-1 p-8 overflow-y-auto bg-white">
        <div className="w-full max-w-[420px]">
          {/* <div className="flex gap-1.5 bg-gray-100 rounded-lg p-1 mb-8">
            {[
              { path: "login", label: "Login" },
              { path: "register", label: "Register" },
              { path: "otp-verify", label: "OTP" },
              { path: "forgot-password", label: "Forgot" },
            ].map((tab) => {
              const isActive = pathname.includes(tab.path);
              return (
                <Link
                  key={tab.path}
                  href={`/${tab.path}`}
                  className={`flex-1 py-2 text-center text-xs font-medium rounded-md transition-all ${
                    isActive
                      ? "bg-white text-navy shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div> */}
          {children}
        </div>
      </div>
    </div>
  );
}
