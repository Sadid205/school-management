"use client";

import { useAppDispatch } from "@/hooks/redux-hooks";
import { useLogoutMutation } from "@/store/api/authApi";
import { logout } from "@/store/authSlice";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart, // Instead of BarChart3
  Bell,
  Book,
  Calendar, // Instead of CalendarCheck
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Gift,
  Layout, // Instead of LayoutDashboard
  LogOut,
  Settings,
  User, // Instead of UserCircle
  Users,
} from "react-feather";
import toast from "react-hot-toast";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

interface MenuItem {
  label: string;
  icon: any;
  href?: string;
  children?: { label: string; href: string }[];
  badge?: number;
}

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    icon: Layout,
    href: "/dashboard",
  },
  {
    label: "Users Management",
    icon: Users,
    children: [
      { label: "Students", href: "/dashboard/students" },
      { label: "Teachers", href: "/dashboard/teachers" },
      { label: "Parents", href: "/dashboard/parents" },
    ],
  },
  {
    label: "Attendance",
    icon: Calendar,
    children: [
      { label: "Mark Attendance", href: "/dashboard/attendance/mark" },
      { label: "Attendance Report", href: "/dashboard/attendance/reports" },
      { label: "Analytics", href: "/dashboard/attendance/analytics" },
    ],
  },
  {
    label: "Academic",
    icon: Book,
    children: [
      { label: "Courses", href: "/dashboard/courses" },
      { label: "Exams", href: "/dashboard/exams" },
      { label: "Results", href: "/dashboard/results" },
      { label: "Assignments", href: "/dashboard/assignments" },
    ],
  },
  {
    label: "Finance",
    icon: CreditCard,
    children: [
      { label: "Purchases", href: "/dashboard/purchases" },
      { label: "Fees Management", href: "/dashboard/finance/fees" },
      { label: "Salary", href: "/dashboard/finance/salary" },
      { label: "Reports", href: "/dashboard/finance/reports" },
    ],
  },
  {
    label: "Inventory",
    icon: Gift,
    children: [
      { label: "Products", href: "/dashboard/inventory/products" },
      { label: "Stock Management", href: "/dashboard/inventory/stock" },
      { label: "Suppliers", href: "/dashboard/inventory/suppliers" },
    ],
  },
  {
    label: "Reports",
    icon: BarChart,
    href: "/dashboard/reports",
  },
  {
    label: "Notifications",
    icon: Bell,
    href: "/dashboard/notifications",
    badge: 3,
  },
  {
    label: "Profile",
    icon: User,
    href: "/dashboard/profile",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [logoutApi] = useLogoutMutation();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (label: string) => {
    if (collapsed) return;
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + "/");
  };

  const isChildActive = (children: { href: string }[] | undefined) => {
    if (!children) return false;
    return children.some((child) => isActive(child.href));
  };

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
          <div className="flex items-center justify-center text-lg font-bold rounded-lg shadow-lg w-9 h-9 bg-amber text-navy">
            E
          </div>
          {!collapsed && (
            <div className="flex-1">
              <div className="text-lg font-bold text-white">EduNest</div>
              <div className="text-amber text-[10px] tracking-wider uppercase">
                School Management
              </div>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute z-10 flex items-center justify-center w-6 h-6 text-white transition-colors -translate-y-1/2 border-2 rounded-full -right-3 top-1/2 bg-navy-mid border-navy-light hover:bg-amber hover:text-navy"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          const hasChildren = item.children && item.children.length > 0;
          const isMenuOpen = openMenus[item.label];
          const isItemActive =
            isActive(item.href || "") ||
            (hasChildren && isChildActive(item.children));

          return (
            <div key={idx} className="mb-1">
              {hasChildren ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      isItemActive
                        ? "bg-amber/15 text-amber"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    } ${collapsed ? "justify-center" : ""}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon size={18} />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-sm text-left">
                          {item.label}
                        </span>
                        <ChevronDown
                          size={14}
                          className={`transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
                        />
                      </>
                    )}
                    {!collapsed && item.badge && (
                      <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                  {!collapsed && (
                    <div
                      className={`overflow-hidden transition-all duration-200 ${
                        isMenuOpen ? "max-h-96" : "max-h-0"
                      }`}
                    >
                      <div className="py-1 pr-2 space-y-1 pl-11">
                        {item.children?.map((child, childIdx) => (
                          <Link
                            key={childIdx}
                            href={child.href}
                            className={`block px-3 py-2 text-sm rounded-lg transition-all ${
                              isActive(child.href)
                                ? "bg-amber/10 text-amber"
                                : "text-white/60 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href!}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    isActive(item.href!)
                      ? "bg-amber/15 text-amber"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  } ${collapsed ? "justify-center" : ""}`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={18} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-sm text-left">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer - User & Logout */}
      <div className="p-3 border-t border-white/10">
        <div className={`${collapsed ? "flex justify-center" : ""}`}>
          {!collapsed ? (
            <>
              <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-lg bg-white/5">
                <div className="flex items-center justify-center font-bold rounded-full w-9 h-9 bg-amber text-navy">
                  AR
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">
                    Ahmed Rahman
                  </div>
                  <div className="text-xs truncate text-white/50">
                    Super Admin
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              >
                <LogOut size={18} />
                <span className="text-sm">Logout</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex justify-center px-2 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
