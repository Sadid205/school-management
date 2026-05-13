"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Home,
  Users,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  BookOpen,
  ClipboardList,
  ShoppingCart,
  DollarSign,
  FileText,
} from "react-feather";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  submenu?: SidebarItem[];
}

const menuItems: SidebarItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <Home size={20} />,
    href: "/dashboard",
  },
  {
    id: "students",
    label: "Students",
    icon: <Users size={20} />,
    submenu: [
      { id: "students-list", label: "Student List", href: "/dashboard/students" },
      { id: "students-add", label: "Add Student", href: "/dashboard/students/add" },
      { id: "students-classes", label: "Classes", href: "/dashboard/students/classes" },
    ],
  },
  {
    id: "attendance",
    label: "Attendance",
    icon: <Calendar size={20} />,
    submenu: [
      { id: "attendance-mark", label: "Mark Attendance", href: "/dashboard/attendance/mark" },
      { id: "attendance-reports", label: "Attendance Reports", href: "/dashboard/attendance/reports" },
      { id: "attendance-analytics", label: "Analytics", href: "/dashboard/attendance/analytics" },
    ],
  },
  {
    id: "academics",
    label: "Academics",
    icon: <BookOpen size={20} />,
    submenu: [
      { id: "courses", label: "Courses", href: "/dashboard/courses" },
      { id: "exams", label: "Exams", href: "/dashboard/exams" },
      { id: "results", label: "Results", href: "/dashboard/results" },
      { id: "assignments", label: "Assignments", href: "/dashboard/assignments" },
    ],
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: <ShoppingCart size={20} />,
    submenu: [
      { id: "purchases", label: "Purchases", href: "/dashboard/purchases" },
      { id: "inventory-list", label: "Items", href: "/dashboard/inventory" },
      { id: "stock", label: "Stock", href: "/dashboard/stock" },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    icon: <DollarSign size={20} />,
    submenu: [
      { id: "fees", label: "Fees", href: "/dashboard/finance/fees" },
      { id: "salary", label: "Salary", href: "/dashboard/finance/salary" },
      { id: "reports-finance", label: "Reports", href: "/dashboard/finance/reports" },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    icon: <FileText size={20} />,
    href: "/dashboard/reports",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: <BarChart3 size={20} />,
    href: "/dashboard/analytics",
  },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [activeItem, setActiveItem] = useState("dashboard");

  const toggleSubmenu = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const renderMenuItem = (item: SidebarItem, isSubMenu = false) => {
    const isExpanded = expandedItems.includes(item.id);
    const hasSubmenu = item.submenu && item.submenu.length > 0;

    if (hasSubmenu) {
      return (
        <div key={item.id}>
          <button
            onClick={() => toggleSubmenu(item.id)}
            className={`menu-item w-full justify-between ${
              activeItem === item.id ? "active" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="menu-item-icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
            <ChevronDown
              size={18}
              className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
            />
          </button>

          {isExpanded && (
            <div className="submenu active">
              {item.submenu.map((subitem) => (
                <Link
                  key={subitem.id}
                  href={subitem.href || "#"}
                  onClick={() => {
                    setActiveItem(subitem.id);
                    setIsOpen(false);
                  }}
                  className={`submenu-item ${
                    activeItem === subitem.id ? "active" : ""
                  }`}
                >
                  {subitem.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.id}
        href={item.href || "#"}
        onClick={() => {
          setActiveItem(item.id);
          setIsOpen(false);
        }}
        className={`menu-item ${activeItem === item.id ? "active" : ""}`}
      >
        <span className="menu-item-icon">{item.icon}</span>
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar ${
          isOpen ? "open" : ""
        } lg:relative lg:translate-x-0 lg:w-64`}
      >
        {/* Header */}
        <div className="sidebar-header">
          <Link href="/dashboard" className="sidebar-brand">
            <div className="sidebar-brand-icon">🎓</div>
            <div className="hidden md:block">
              <div className="font-bold text-[#0f1f3d]">EduNest</div>
              <div className="text-xs text-gray-500">School Management</div>
            </div>
          </Link>
        </div>

        {/* Menu */}
        <div className="sidebar-content">
          <div className="sidebar-menu">
            {menuItems.map((item) => renderMenuItem(item))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 mt-auto">
          <button className="menu-item w-full text-red-600 hover:bg-red-50">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
