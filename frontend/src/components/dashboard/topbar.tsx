"use client";

import { useState } from "react";
import {
  Bell,
  ChevronDown,
  Menu,
  Moon,
  Search,
  Sun
} from "react-feather";

interface TopbarProps {
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
}

export default function Topbar({ onMenuClick, sidebarCollapsed }: TopbarProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMenuClick();
  };

  return (
    <header className="z-10 flex items-center justify-between px-4 bg-white border-b border-gray-200 shadow-sm dark:bg-navy-mid dark:border-gray-700 h-14 lg:px-6 shrink-0">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <button
          onClick={handleMenuClick}
          className="p-2 transition-colors rounded-lg lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200"
          aria-label="Menu"
        >
          <Menu size={20} className="text-gray-600 dark:text-gray-300" />
        </button>

        {/* Desktop Logo/Breadcrumb */}
        <div className="items-center hidden gap-2 lg:flex">
          <div className="flex items-center justify-center text-sm font-bold rounded-lg w-7 h-7 bg-amber text-navy">
            E
          </div>
          <span className="font-semibold text-navy dark:text-white">
            EduNest
          </span>
        </div>

        {/* Breadcrumb */}
        <div className="items-center hidden gap-1 ml-2 text-sm sm:flex">
          <span className="text-gray-500 dark:text-gray-400">/</span>
          <span className="font-medium text-navy dark:text-amber">
            Dashboard
          </span>
        </div>
      </div>

      {/* Right Section - Same as before */}
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <Search size={18} className="text-gray-600 dark:text-gray-300" />
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {theme === "light" ? (
            <Moon size={18} className="text-gray-600" />
          ) : (
            <Sun size={18} className="text-amber" />
          )}
        </button>
        <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <Bell size={18} className="text-gray-600 dark:text-gray-300" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"></span>
        </button>
        <div className="flex items-center gap-2 pl-2 ml-2 border-l border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center w-8 h-8 text-sm font-bold rounded-full bg-amber text-navy">
            AR
          </div>
          <span className="hidden text-sm font-medium lg:block text-navy dark:text-white">
            Ahmed
          </span>
          <ChevronDown size={14} className="hidden text-gray-500 lg:block" />
        </div>
      </div>
    </header>
  );
}
