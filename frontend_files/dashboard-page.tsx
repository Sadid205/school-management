"use client";

import { BarChart3, TrendingUp, Users, Calendar, BookOpen, AlertCircle } from "react-feather";

interface KPICard {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: "blue" | "green" | "amber" | "red";
}

const kpiCards: KPICard[] = [
  {
    title: "Total Students",
    value: 1250,
    change: 12,
    icon: <Users size={24} />,
    color: "blue",
  },
  {
    title: "Present Today",
    value: 1089,
    change: 5,
    icon: <Calendar size={24} />,
    color: "green",
  },
  {
    title: "Active Courses",
    value: 24,
    change: 2,
    icon: <BookOpen size={24} />,
    color: "amber",
  },
  {
    title: "Avg Attendance",
    value: "87%",
    change: -3,
    icon: <TrendingUp size={24} />,
    color: "blue",
  },
];

const recentActivities = [
  { id: 1, user: "John Doe", action: "Registered as student", time: "2 mins ago" },
  { id: 2, user: "Jane Smith", action: "Marked attendance", time: "15 mins ago" },
  { id: 3, user: "System", action: "Generated attendance report", time: "1 hour ago" },
  { id: 4, user: "Admin", action: "Updated course materials", time: "2 hours ago" },
];

const colorMap = {
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: "text-blue-600",
    text: "text-blue-900",
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-200",
    icon: "text-green-600",
    text: "text-green-900",
  },
  amber: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: "text-amber-600",
    text: "text-amber-900",
  },
  red: {
    bg: "bg-red-50",
    border: "border-red-200",
    icon: "text-red-600",
    text: "text-red-900",
  },
};

export default function DashboardPage() {
  return (
    <div className="page-content">
      {/* Page Header */}
      <div className="mb-8">
        <div className="page-header">
          <h1 className="page-title">Welcome Back! 👋</h1>
          <p className="page-subtitle">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiCards.map((kpi, idx) => {
          const colors = colorMap[kpi.color];
          return (
            <div
              key={idx}
              className={`card border-l-4 border-l-[#f5a623] hover:shadow-md transition-shadow`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {kpi.title}
                  </p>
                  <h3 className="text-3xl font-bold text-[#0f1f3d]">
                    {kpi.value}
                  </h3>
                  <p
                    className={`text-xs mt-2 font-medium ${
                      kpi.change > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {kpi.change > 0 ? "↑" : "↓"} {Math.abs(kpi.change)}% vs last week
                  </p>
                </div>
                <div
                  className={`p-3 rounded-lg ${colors.bg} ${colors.icon}`}
                >
                  {kpi.icon}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Attendance Chart */}
        <div className="lg:col-span-2 card">
          <h2 className="text-lg font-bold text-[#0f1f3d] mb-4">
            Attendance Trend
          </h2>
          <div className="h-80 flex items-end justify-between gap-2 px-2">
            {[65, 78, 72, 85, 92, 88, 95, 89, 82, 91, 87, 94].map((val, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-lg bg-gradient-to-t from-[#f5a623] to-[#ffc85a] transition-all hover:opacity-80"
                style={{ height: `${val}%` }}
                title={`${val}%`}
              />
            ))}
          </div>
          <p className="text-center text-xs text-gray-500 mt-2">
            Last 12 Months
          </p>
        </div>

        {/* Class Stats */}
        <div className="card">
          <h2 className="text-lg font-bold text-[#0f1f3d] mb-4">
            Students by Class
          </h2>
          <div className="space-y-3">
            {[
              { class: "Class A", count: 35 },
              { class: "Class B", count: 42 },
              { class: "Class C", count: 38 },
              { class: "Class D", count: 40 },
            ].map((item) => (
              <div key={item.class}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 font-medium">{item.class}</span>
                  <span className="text-[#0f1f3d] font-bold">{item.count}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#f5a623] to-[#ffc85a]"
                    style={{ width: `${(item.count / 45) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 card">
          <h2 className="text-lg font-bold text-[#0f1f3d] mb-4">
            Recent Activities
          </h2>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="w-10 h-10 rounded-full bg-[#f5a623] bg-opacity-10 flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={16} className="text-[#f5a623]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0f1f3d]">
                    {activity.user}
                  </p>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                </div>
                <p className="text-xs text-gray-500 whitespace-nowrap">
                  {activity.time}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-lg font-bold text-[#0f1f3d] mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-[#0f1f3d] text-white rounded-lg font-medium text-sm hover:bg-[#1a3260] transition-colors">
              Mark Attendance
            </button>
            <button className="w-full px-4 py-3 bg-[#f5a623] text-[#0f1f3d] rounded-lg font-medium text-sm hover:bg-[#ffc85a] transition-colors">
              Add Student
            </button>
            <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors">
              View Reports
            </button>
            <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors">
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
