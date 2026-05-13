"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, Settings, LogOut, ChevronDown, User, Search } from "react-feather";

interface User {
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface TopbarProps {
  user?: User;
}

export default function Topbar({ user = { name: "John Doe", email: "john@example.com", role: "Admin" } }: TopbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const notifications = [
    { id: 1, message: "New student registered", time: "5 mins ago" },
    { id: 2, message: "Attendance report ready", time: "1 hour ago" },
    { id: 3, message: "Exam results published", time: "2 hours ago" },
  ];

  return (
    <div className="topbar">
      {/* Search Bar */}
      <div className="hidden md:flex flex-1 items-center">
        <div className="relative w-96">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search students, courses, reports..."
            className="input-field pl-10 py-2"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotificationOpen(!isNotificationOpen);
              setIsProfileOpen(false);
            }}
            className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Notification Dropdown */}
          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-[#0f1f3d]">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <p className="text-sm text-gray-700">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-gray-200 text-center">
                <Link href="/dashboard/notifications" className="text-sm text-[#f5a623] hover:text-[#ffc85a]">
                  View All
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <Link
          href="/dashboard/settings"
          className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Settings size={20} />
        </Link>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationOpen(false);
            }}
            className="flex items-center gap-3 pl-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f5a623] to-[#ffc85a] flex items-center justify-center text-white font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-200">
                <p className="text-sm font-medium text-[#0f1f3d]">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>

              <div className="py-2">
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User size={16} />
                  View Profile
                </Link>

                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings size={16} />
                  Settings
                </Link>
              </div>

              <div className="border-t border-gray-200 p-2">
                <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
