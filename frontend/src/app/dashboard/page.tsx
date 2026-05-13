"use client";

import { useAppSelector } from "@/hooks/redux-hooks";
import { selectCurrentUser } from "@/store/authSlice";
import {
    ArrowRight,
    BookOpen,
    Calendar,
    TrendingDown,
    TrendingUp,
    UserCheck,
    Users,
} from "react-feather";

// Mock data
const statsData = [
  {
    title: "Total Students",
    value: "1,240",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "blue",
  },
  {
    title: "Total Teachers",
    value: "87",
    change: "+3%",
    trend: "up",
    icon: UserCheck,
    color: "green",
  },
  {
    title: "Today's Attendance",
    value: "94%",
    change: "-2%",
    trend: "down",
    icon: Calendar,
    color: "amber",
  },
  {
    title: "Active Courses",
    value: "24",
    change: "+5",
    trend: "up",
    icon: BookOpen,
    color: "purple",
  },
];

const recentActivities = [
  {
    id: 1,
    user: "Ahmed Rahman",
    action: "added new student",
    target: "Riya Khatun",
    time: "2 minutes ago",
    avatar: "AR",
  },
  {
    id: 2,
    user: "Fatema Begum",
    action: "marked attendance for",
    target: "Class 8 - Section A",
    time: "1 hour ago",
    avatar: "FB",
  },
  {
    id: 3,
    user: "Dr. Karim Molla",
    action: "published exam results for",
    target: "Midterm 2024",
    time: "3 hours ago",
    avatar: "KM",
  },
  {
    id: 4,
    user: "Nusrat Jahan",
    action: "submitted assignment",
    target: "Mathematics Chapter 5",
    time: "5 hours ago",
    avatar: "NJ",
  },
];

const upcomingExams = [
  { name: "Midterm - Mathematics", date: "May 20, 2024", status: "upcoming" },
  { name: "Bengali 1st Paper", date: "May 23, 2024", status: "upcoming" },
  { name: "English - Writing", date: "May 27, 2024", status: "draft" },
  { name: "Final Examination", date: "June 15, 2024", status: "published" },
];

const getColorClasses = (color: string) => {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
  };
  return colors[color] || colors.blue;
};

const getTrendIcon = (trend: string) => {
  return trend === "up" ? <TrendingUp size={14} /> : <TrendingDown size={14} />;
};

export default function DashboardPage() {
  const user = useAppSelector(selectCurrentUser);

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div>
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy to-navy-mid rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-white text-xl font-bold">
              {getGreeting()}, {user?.first_name}! 👋
            </h2>
            <p className="text-white/60 text-sm mt-1">
              Today is{" "}
              {new Date().toLocaleDateString("bn-BD", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <button className="bg-amber text-navy px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-light transition-colors">
            + Add New
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsData.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div
                  className={`p-2.5 rounded-lg ${getColorClasses(stat.color)}`}
                >
                  <Icon size={20} />
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                    stat.trend === "up"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {getTrendIcon(stat.trend)}
                  {stat.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-navy">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.title}</div>
            </div>
          );
        })}
      </div>

      {/* Recent Activities & Upcoming Exams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold text-navy">Recent Activities</h3>
            <button className="text-xs text-navy-light hover:underline flex items-center gap-1">
              View All <ArrowRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="px-5 py-3 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-full bg-amber-pale flex items-center justify-center text-navy font-semibold text-sm">
                  {activity.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium text-navy">
                      {activity.user}
                    </span>
                    <span className="text-gray-600"> {activity.action} </span>
                    <span className="font-medium text-navy">
                      {activity.target}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Exams */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold text-navy">Upcoming Exams</h3>
            <button className="text-xs text-navy-light hover:underline flex items-center gap-1">
              View All <ArrowRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {upcomingExams.map((exam, idx) => (
              <div
                key={idx}
                className="px-5 py-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-navy text-sm">{exam.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{exam.date}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    exam.status === "upcoming"
                      ? "bg-amber-pale text-amber-700"
                      : exam.status === "published"
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Class-wise Attendance */}
      <div className="mt-6 bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-navy">Class-wise Attendance</h3>
        </div>
        <div className="p-5">
          {[
            { name: "Class 10", percentage: 94, color: "#1D9E75" },
            { name: "Class 9", percentage: 88, color: "#185FA5" },
            { name: "Class 8", percentage: 79, color: "#F5A623" },
            { name: "Class 7", percentage: 92, color: "#1D9E75" },
            { name: "Class 6", percentage: 65, color: "#E24B4A" },
          ].map((cls, idx) => (
            <div key={idx} className="mb-4 last:mb-0">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">{cls.name}</span>
                <span className="font-medium text-navy">{cls.percentage}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${cls.percentage}%`,
                    backgroundColor: cls.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
