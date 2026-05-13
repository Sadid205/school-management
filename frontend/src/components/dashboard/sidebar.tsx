"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  Award,
  BarChart2,
  Bell,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Home,
  LogOut,
  PieChart,
  Settings,
  ShoppingCart,
  User,
  Users,
  X,
} from "react-feather";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  collapsed,
  setCollapsed,
  isMobile,
  isOpen,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobile, isOpen]);

  const menuItems = [
    { label: "Dashboard", icon: Home, href: "/" },
    { label: "Students", icon: Users, href: "/students" },
    { label: "Teachers", icon: Award, href: "/teachers" },
    { label: "Attendance", icon: Calendar, href: "/attendance/mark" },
    { label: "Courses", icon: BookOpen, href: "/courses" },
    { label: "Purchases", icon: ShoppingCart, href: "/purchases" },
    { label: "Finance", icon: CreditCard, href: "/finance" },
    { label: "Reports", icon: BarChart2, href: "/reports" },
    { label: "Analytics", icon: PieChart, href: "/analytics" },
    { label: "Notifications", icon: Bell, href: "/notifications", badge: 3 },
    { label: "Profile", icon: User, href: "/profile" },
    { label: "Settings", icon: Settings, href: "/settings" },
  ];

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + "/");
  };

  const handleLinkClick = () => {
    if (isMobile) {
      onClose();
    }
  };

  // For mobile: don't render anything if not open
  if (isMobile && !isOpen) {
    return null;
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          bg-navy text-white transition-all duration-300 flex flex-col h-full
          ${
            isMobile
              ? "fixed top-0 left-0 z-50 w-[260px] shadow-2xl"
              : collapsed
                ? "w-[70px]"
                : "w-[260px]"
          }
        `}
      >
        {/* Logo Area */}
        <div className="relative p-4 border-b shrink-0 border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center text-lg font-bold rounded-lg shrink-0 w-9 h-9 bg-amber text-navy">
              E
            </div>
            {(!isMobile || !collapsed) && (
              <div className="overflow-hidden">
                <div className="font-bold text-white whitespace-nowrap">
                  EduNest
                </div>
                <div className="text-[10px] tracking-wider text-amber uppercase whitespace-nowrap">
                  School Management
                </div>
              </div>
            )}
          </div>

          {/* Desktop Collapse Button */}
          {!isMobile && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="absolute z-10 flex items-center justify-center w-6 h-6 transition-colors -translate-y-1/2 border-2 rounded-full top-1/2 -right-3 bg-navy-mid border-navy-light hover:bg-amber hover:text-navy"
            >
              {collapsed ? (
                <ChevronRight size={12} />
              ) : (
                <ChevronLeft size={12} />
              )}
            </button>
          )}

          {/* Mobile Close Button */}
          {isMobile && (
            <button
              onClick={onClose}
              className="absolute z-10 flex items-center justify-center w-6 h-6 transition-colors -translate-y-1/2 rounded-full shadow-md top-1/2 -right-2 bg-amber text-navy hover:bg-amber-light"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={handleLinkClick}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all
                  ${
                    active
                      ? "bg-amber/15 text-amber"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }
                  ${collapsed && !isMobile ? "justify-center" : ""}
                `}
                title={collapsed && !isMobile ? item.label : undefined}
              >
                <Icon size={18} className="shrink-0" />
                {(!collapsed || isMobile) && (
                  <>
                    <span className="flex-1 text-sm text-left">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-xs text-white rounded-full shrink-0 bg-red-500">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t shrink-0 border-white/10">
          {!collapsed || isMobile ? (
            <>
              <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-lg bg-white/5">
                <div className="flex items-center justify-center text-sm font-bold rounded-full shrink-0 w-9 h-9 bg-amber text-navy">
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
                onClick={handleLinkClick}
                className="flex items-center w-full gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              >
                <LogOut size={18} className="shrink-0" />
                <span className="text-sm">Logout</span>
              </button>
            </>
          ) : (
            <button className="flex justify-center w-full px-2 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors">
              <LogOut size={18} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
