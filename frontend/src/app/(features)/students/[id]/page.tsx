"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    AlertCircle,
    ArrowLeft,
    Award,
    BookOpen,
    Calendar,
    CheckCircle,
    Clock,
    Edit,
    Mail,
    MapPin,
    Phone,
    Trash2,
    Users,
    XCircle
} from "react-feather";
import toast from "react-hot-toast";

// Mock student data - in real app, fetch from API
const getStudentById = (id: number) => {
  const students = {
    1: {
      id: 1,
      first_name: "Ahmed",
      last_name: "Rahman",
      email: "ahmed.rahman@school.edu",
      phone: "01712345678",
      roll: "STU-101",
      class: "Class 8",
      section: "A",
      gender: "Male",
      date_of_birth: "2010-05-15",
      address: "123, Gulshan Avenue, Dhaka",
      father_name: "Md. Abdur Rahman",
      mother_name: "Mrs. Fatema Rahman",
      parent_phone: "01812345678",
      parent_email: "abdur.rahman@example.com",
      admission_date: "2022-01-15",
      status: "active",
      attendance: 94,
      avatarBg: "#E6F1FB",
      avatarColor: "#185FA5",
      marks: [
        {
          subject: "Mathematics",
          theory: 85,
          mcq: 18,
          practical: 22,
          total: 125,
          grade: "A",
          grade_point: 4.0,
        },
        {
          subject: "Bangla",
          theory: 78,
          mcq: 16,
          practical: null,
          total: 94,
          grade: "A-",
          grade_point: 3.5,
        },
        {
          subject: "English",
          theory: 82,
          mcq: 17,
          practical: null,
          total: 99,
          grade: "A",
          grade_point: 4.0,
        },
        {
          subject: "Science",
          theory: 88,
          mcq: 19,
          practical: 24,
          total: 131,
          grade: "A+",
          grade_point: 5.0,
        },
        {
          subject: "Social Science",
          theory: 75,
          mcq: 15,
          practical: null,
          total: 90,
          grade: "A-",
          grade_point: 3.5,
        },
      ],
      attendanceHistory: [
        { month: "Jan", present: 22, total: 25, percentage: 88 },
        { month: "Feb", present: 20, total: 23, percentage: 87 },
        { month: "Mar", present: 24, total: 26, percentage: 92 },
        { month: "Apr", present: 18, total: 22, percentage: 82 },
        { month: "May", present: 15, total: 18, percentage: 83 },
      ],
    },
  };
  return students[id as keyof typeof students];
};

export default function StudentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const studentId = parseInt(params.id as string);
  const student = getStudentById(studentId);

  useEffect(() => {
    if (!student) {
      toast.error("Student not found");
      router.push("/dashboard/students");
    }
  }, [student, router]);

  if (!student) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle size={48} className="text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Loading student data...</p>
        </div>
      </div>
    );
  }

  const getInitials = () => {
    return `${student.first_name[0]}${student.last_name[0]}`.toUpperCase();
  };

  const getGradeColor = (grade: string) => {
    if (grade === "A+") return "text-green-700 bg-green-50";
    if (grade === "A") return "text-green-600 bg-green-50";
    if (grade === "A-") return "text-amber-700 bg-amber-50";
    if (grade === "B+") return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
  };

  const calculateTotalMarks = () => {
    return student.marks.reduce((sum, m) => sum + m.total, 0);
  };

  const calculateAveragePercentage = () => {
    const total = student.marks.reduce((sum, m) => {
      const maxMarks = m.practical !== null ? 150 : 100;
      return sum + (m.total / maxMarks) * 100;
    }, 0);
    return Math.round(total / student.marks.length);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-navy">শিক্ষার্থীর বিবরণ</h1>
            <p className="text-gray-500 text-sm mt-1">
              {student.first_name} {student.last_name} - {student.roll}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/dashboard/students/${student.id}/edit`}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-navy hover:text-navy transition-colors flex items-center gap-2"
          >
            <Edit size={16} />
            সম্পাদনা করুন
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
          >
            <Trash2 size={16} />
            মুছুন
          </button>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold"
              style={{
                backgroundColor: student.avatarBg,
                color: student.avatarColor,
              }}
            >
              {getInitials()}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                <h2 className="text-xl font-bold text-navy">
                  {student.first_name} {student.last_name}
                </h2>
                <div className="flex flex-wrap gap-3 mt-2">
                  <span className="text-sm text-gray-500">{student.roll}</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">
                    {student.class}, Section {student.section}
                  </span>
                  <span className="text-sm text-gray-500">•</span>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      student.status === "active"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {student.status === "active" ? "সক্রিয়" : "নিষ্ক্রিয়"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-2xl font-bold text-navy">
                    {student.attendance}%
                  </div>
                  <div className="text-xs text-gray-500">উপস্থিতি হার</div>
                </div>
                <div className="w-12 h-12">
                  <div className="relative w-12 h-12">
                    <svg className="w-12 h-12 transform -rotate-90">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="#E5E7EB"
                        strokeWidth="4"
                        fill="none"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke={
                          student.attendance >= 85
                            ? "#1D9E75"
                            : student.attendance >= 70
                              ? "#F5A623"
                              : "#E24B4A"
                        }
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 20}`}
                        strokeDashoffset={`${2 * Math.PI * 20 * (1 - student.attendance / 100)}`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-navy">
                      {student.attendance}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-400" />
                <div>
                  <div className="text-xs text-gray-400">Email</div>
                  <div className="text-sm text-gray-700">{student.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-400" />
                <div>
                  <div className="text-xs text-gray-400">Phone</div>
                  <div className="text-sm text-gray-700">{student.phone}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <div>
                  <div className="text-xs text-gray-400">Date of Birth</div>
                  <div className="text-sm text-gray-700">
                    {new Date(student.date_of_birth).toLocaleDateString(
                      "bn-BD",
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-400" />
                <div>
                  <div className="text-xs text-gray-400">Address</div>
                  <div className="text-sm text-gray-700 truncate">
                    {student.address}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100">
          <div className="flex gap-1 px-4">
            {[
              { id: "profile", label: "প্রোফাইল", icon: User },
              { id: "academic", label: "একাডেমিক", icon: BookOpen },
              { id: "marks", label: "মার্কশীট", icon: Award },
              { id: "attendance", label: "উপস্থিতি", icon: Calendar },
              { id: "parents", label: "অভিভাবক", icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? "border-navy text-navy"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-navy border-b border-gray-100 pb-2">
                    ব্যক্তিগত তথ্য
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500">পূর্ণ নাম:</span>
                      <span className="font-medium text-navy">
                        {student.first_name} {student.last_name}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500">জন্ম তারিখ:</span>
                      <span className="text-gray-700">
                        {new Date(student.date_of_birth).toLocaleDateString(
                          "bn-BD",
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500">লিঙ্গ:</span>
                      <span className="text-gray-700">{student.gender}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500">রক্তের গ্রুপ:</span>
                      <span className="text-gray-700">O+</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-navy border-b border-gray-100 pb-2">
                    যোগাযোগের তথ্য
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500">ইমেইল:</span>
                      <span className="text-gray-700">{student.email}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500">মোবাইল:</span>
                      <span className="text-gray-700">{student.phone}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500">ঠিকানা:</span>
                      <span className="text-gray-700 text-right">
                        {student.address}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Academic Tab */}
          {activeTab === "academic" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-navy border-b border-gray-100 pb-2">
                    বর্তমান শিক্ষাবর্ষ
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500">ক্লাস:</span>
                      <span className="font-medium text-navy">
                        {student.class}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500">সেকশন:</span>
                      <span className="text-gray-700">{student.section}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500">রোল নম্বর:</span>
                      <span className="text-gray-700">{student.roll}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500">ভর্তির তারিখ:</span>
                      <span className="text-gray-700">
                        {new Date(student.admission_date).toLocaleDateString(
                          "bn-BD",
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-navy border-b border-gray-100 pb-2">
                    একাডেমিক সারাংশ
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500">মোট উপস্থিতি:</span>
                      <span className="text-green-600 font-medium">
                        {student.attendance}%
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500">গড় নম্বর:</span>
                      <span className="text-amber-600 font-medium">
                        {calculateAveragePercentage()}%
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500">বর্তমান অবস্থা:</span>
                      <span className="text-green-600 font-medium">পাসিং</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Marks Tab */}
          {activeTab === "marks" && (
            <div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-500">
                        বিষয়
                      </th>
                      <th className="text-center py-3 px-2 text-sm font-semibold text-gray-500">
                        তত্ত্ব
                      </th>
                      <th className="text-center py-3 px-2 text-sm font-semibold text-gray-500">
                        MCQ
                      </th>
                      <th className="text-center py-3 px-2 text-sm font-semibold text-gray-500">
                        প্র্যাক্টিক্যাল
                      </th>
                      <th className="text-center py-3 px-2 text-sm font-semibold text-gray-500">
                        মোট
                      </th>
                      <th className="text-center py-3 px-2 text-sm font-semibold text-gray-500">
                        গ্রেড
                      </th>
                      <th className="text-center py-3 px-2 text-sm font-semibold text-gray-500">
                        জিপিএ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {student.marks.map((mark, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="py-3 px-2 font-medium text-navy">
                          {mark.subject}
                        </td>
                        <td className="text-center py-3 px-2 text-gray-700">
                          {mark.theory}
                        </td>
                        <td className="text-center py-3 px-2 text-gray-700">
                          {mark.mcq}
                        </td>
                        <td className="text-center py-3 px-2 text-gray-700">
                          {mark.practical !== null ? mark.practical : "-"}
                        </td>
                        <td className="text-center py-3 px-2 font-semibold text-navy">
                          {mark.total}
                        </td>
                        <td className="text-center py-3 px-2">
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full ${getGradeColor(mark.grade)}`}
                          >
                            {mark.grade}
                          </span>
                        </td>
                        <td className="text-center py-3 px-2 text-gray-700">
                          {mark.grade_point}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t border-gray-200 bg-gray-50">
                    <tr>
                      <td
                        colSpan={4}
                        className="py-3 px-2 text-right font-semibold text-navy"
                      >
                        মোট:
                      </td>
                      <td className="text-center py-3 px-2 font-bold text-navy text-lg">
                        {calculateTotalMarks()}
                      </td>
                      <td colSpan={2}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === "attendance" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <CheckCircle
                    size={24}
                    className="text-green-600 mx-auto mb-2"
                  />
                  <div className="text-2xl font-bold text-green-700">94%</div>
                  <div className="text-sm text-green-600">উপস্থিতি</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <XCircle size={24} className="text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-700">4%</div>
                  <div className="text-sm text-red-600">অনুপস্থিত</div>
                </div>
                <div className="bg-amber-50 rounded-lg p-4 text-center">
                  <Clock size={24} className="text-amber-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-amber-700">2%</div>
                  <div className="text-sm text-amber-600">দেরিতে</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-navy">মাসিক উপস্থিতি</h3>
                {student.attendanceHistory.map((month, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{month.month}</span>
                      <span className="text-navy font-medium">
                        {month.present}/{month.total} ({month.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-green-500 transition-all"
                        style={{ width: `${month.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Parents Tab */}
          {activeTab === "parents" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users size={20} className="text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-navy">পিতার তথ্য</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">নাম:</span>
                    <span className="text-gray-700">{student.father_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">মোবাইল:</span>
                    <span className="text-gray-700">
                      {student.parent_phone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">ইমেইল:</span>
                    <span className="text-gray-700">
                      {student.parent_email}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                    <Users size={20} className="text-pink-600" />
                  </div>
                  <h3 className="font-semibold text-navy">মাতার তথ্য</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">নাম:</span>
                    <span className="text-gray-700">{student.mother_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">মোবাইল:</span>
                    <span className="text-gray-700">
                      {student.parent_phone}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-md w-full mx-4 p-6">
            <div className="text-center mb-4">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="text-red-600" size={24} />
              </div>
              <h3 className="text-lg font-bold text-navy">শিক্ষার্থী মুছুন?</h3>
              <p className="text-gray-500 text-sm mt-1">
                আপনি কি নিশ্চিত যে আপনি এই শিক্ষার্থীটি মুছতে চান? এই কাজটি
                পূর্বাবস্থায় ফেরানো যাবে না।
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
              >
                বাতিল
              </button>
              <button
                onClick={() => {
                  toast.success("Student deleted successfully");
                  setShowDeleteModal(false);
                  router.push("/dashboard/students");
                }}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
              >
                মুছুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Import missing icon
function User(props: any) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}
