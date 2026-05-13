"use client";

import { useAppDispatch } from "@/hooks/redux-hooks";
import { useLogoutMutation } from "@/store/api/authApi";
import { logout } from "@/store/authSlice";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Award,
  BarChart, // instead of BarChart3
  Bell,
  Book, // instead of BookOpen
  Calendar, // instead of CalendarCheck
  ChevronLeft,
  ChevronRight,
  CreditCard,
  File, // instead of GraduationCap (or use 'Book')
  Layout, // instead of LayoutDashboard
  LogOut,
  Settings,
  ShoppingBag, // instead of ShoppingCart
  User, // instead of UserCircle
  Users,
} from "react-feather";
import toast from "react-hot-toast";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const menuItems = [
  {
    section: "MAIN",
    items: [
      { label: "Dashboard", icon: Layout, href: "/dashboard" },
      { label: "Students", icon: Users, href: "/dashboard/students" },
      { label: "Teachers", icon: Award, href: "/dashboard/teachers" },
      {
        label: "Attendance",
        icon: Calendar,
        href: "/dashboard/attendance/mark",
      },
    ],
  },
  {
    section: "ACADEMIC",
    items: [
      { label: "Courses", icon: Book, href: "/dashboard/courses" },
      { label: "Exams", icon: File, href: "/dashboard/exams" },
      { label: "Results", icon: BarChart, href: "/dashboard/results" },
      { label: "Assignments", icon: File, href: "/dashboard/assignments" },
    ],
  },
  {
    section: "FINANCE",
    items: [
      { label: "Purchases", icon: ShoppingBag, href: "/dashboard/purchases" },
      { label: "Fees", icon: CreditCard, href: "/dashboard/finance/fees" },
      { label: "Inventory", icon: ShoppingBag, href: "/dashboard/inventory" },
    ],
  },
  {
    section: "SYSTEM",
    items: [
      { label: "Reports", icon: BarChart, href: "/dashboard/reports" },
      { label: "Notifications", icon: Bell, href: "/dashboard/notifications" },
      { label: "Profile", icon: User, href: "/dashboard/profile" },
      { label: "Settings", icon: Settings, href: "/dashboard/settings" },
    ],
  },
];

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logout());
      toast.success("Logged out successfully");
      window.location.href = "/login";
    } catch (error) {
      dispatch(logout());
      window.location.href = "/login";
    }
  };

  return (
    <aside
      className={`bg-navy text-white transition-all duration-300 flex flex-col ${
        collapsed ? "w-[70px]" : "w-[260px]"
      }`}
    >
      {/* Logo Area */}
      <div className="relative p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center text-lg font-bold rounded-lg w-9 h-9 bg-amber text-navy">
            E
          </div>
          {!collapsed && (
            <div>
              <div className="font-bold text-white">EduNest</div>
              <div className="text-amber text-[10px] tracking-wider">
                School Management
              </div>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute flex items-center justify-center w-6 h-6 text-white transition-colors -translate-y-1/2 border-2 rounded-full -right-3 top-1/2 bg-navy-mid border-navy-light hover:bg-amber"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {menuItems.map((section, idx) => (
          <div key={idx} className="mb-4">
            {!collapsed && (
              <div className="text-[10px] tracking-wider text-white/30 px-3 py-2">
                {section.section}
              </div>
            )}
            {section.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all ${
                    isActive
                      ? "bg-amber/15 text-amber"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  } ${collapsed ? "justify-center" : ""}`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={18} />
                  {!collapsed && <span className="text-sm">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all w-full ${
            collapsed ? "justify-center" : ""
          }`}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut size={18} />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
