"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Download,
    Edit,
    Eye,
    Plus,
    Search,
    Trash2,
    Upload,
    UserPlus
} from "react-feather";
import toast from "react-hot-toast";

// Mock student data
const mockStudents = [
  {
    id: 1,
    first_name: "Ahmed",
    last_name: "Rahman",
    email: "ahmed.rahman@school.edu",
    roll: "STU-101",
    class: "Class 8",
    section: "A",
    gender: "Male",
    attendance: 94,
    status: "active",
    phone: "017xxxxxxx",
    avatarBg: "#E6F1FB",
    avatarColor: "#185FA5",
  },
  {
    id: 2,
    first_name: "Riya",
    last_name: "Khatun",
    email: "riya.khatun@school.edu",
    roll: "STU-102",
    class: "Class 8",
    section: "A",
    gender: "Female",
    attendance: 88,
    status: "active",
    phone: "018xxxxxxx",
    avatarBg: "#EAF3DE",
    avatarColor: "#3B6D11",
  },
  {
    id: 3,
    first_name: "Karim",
    last_name: "Molla",
    email: "karim.molla@school.edu",
    roll: "STU-103",
    class: "Class 8",
    section: "B",
    gender: "Male",
    attendance: 76,
    status: "active",
    phone: "019xxxxxxx",
    avatarBg: "#FFF3DC",
    avatarColor: "#854F0B",
  },
  {
    id: 4,
    first_name: "Nusrat",
    last_name: "Jahan",
    email: "nusrat.jahan@school.edu",
    roll: "STU-104",
    class: "Class 9",
    section: "A",
    gender: "Female",
    attendance: 95,
    status: "active",
    phone: "017xxxxxxx",
    avatarBg: "#FBEAF0",
    avatarColor: "#993556",
  },
  {
    id: 5,
    first_name: "Rafiq",
    last_name: "Islam",
    email: "rafiq.islam@school.edu",
    roll: "STU-105",
    class: "Class 9",
    section: "B",
    gender: "Male",
    attendance: 82,
    status: "pending",
    phone: "018xxxxxxx",
    avatarBg: "#E1F5EE",
    avatarColor: "#0F6E56",
  },
  {
    id: 6,
    first_name: "Sadia",
    last_name: "Akter",
    email: "sadia.akter@school.edu",
    roll: "STU-106",
    class: "Class 10",
    section: "A",
    gender: "Female",
    attendance: 91,
    status: "active",
    phone: "019xxxxxxx",
    avatarBg: "#FCEBEB",
    avatarColor: "#A32D2D",
  },
  {
    id: 7,
    first_name: "Jahir",
    last_name: "Hossain",
    email: "jahir.hossain@school.edu",
    roll: "STU-107",
    class: "Class 10",
    section: "B",
    gender: "Male",
    attendance: 67,
    status: "inactive",
    phone: "017xxxxxxx",
    avatarBg: "#E6F1FB",
    avatarColor: "#185FA5",
  },
  {
    id: 8,
    first_name: "Mim",
    last_name: "Begum",
    email: "mim.begum@school.edu",
    roll: "STU-108",
    class: "Class 7",
    section: "A",
    gender: "Female",
    attendance: 89,
    status: "active",
    phone: "018xxxxxxx",
    avatarBg: "#EAF3DE",
    avatarColor: "#3B6D11",
  },
];

const getAttendanceColor = (percentage: number) => {
  if (percentage >= 85) return "text-green-700 bg-green-50";
  if (percentage >= 70) return "text-amber-700 bg-amber-50";
  return "text-red-700 bg-red-50";
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-green-50 text-green-700">
          সক্রিয়
        </span>
      );
    case "pending":
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-amber-50 text-amber-700">
          Pending
        </span>
      );
    case "inactive":
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-red-50 text-red-700">
          নিষ্ক্রিয়
        </span>
      );
    default:
      return null;
  }
};

export default function StudentsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null);

  const itemsPerPage = 8;

  // Filter students
  const filteredStudents = useMemo(() => {
    let filtered = [...mockStudents];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          `${s.first_name} ${s.last_name}`.toLowerCase().includes(query) ||
          s.roll.toLowerCase().includes(query) ||
          s.email.toLowerCase().includes(query),
      );
    }

    if (selectedClass !== "all") {
      filtered = filtered.filter((s) => s.class === selectedClass);
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((s) => s.status === selectedStatus);
    }

    return filtered;
  }, [searchQuery, selectedClass, selectedStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(paginatedStudents.map((s) => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedStudents([...selectedStudents, id]);
    } else {
      setSelectedStudents(selectedStudents.filter((sid) => sid !== id));
    }
  };

  const handleDeleteStudent = () => {
    toast.success("Student deleted successfully");
    setShowDeleteModal(false);
    setStudentToDelete(null);
  };

  const handleBulkDelete = () => {
    toast.success(`${selectedStudents.length} students deleted`);
    setSelectedStudents([]);
  };

  const getInitials = (first: string, last: string) => {
    return `${first[0]}${last[0]}`.toUpperCase();
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy">
            শিক্ষার্থী ব্যবস্থাপনা
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            সকল শিক্ষার্থীর তালিকা ও তথ্য পরিচালনা করুন
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-navy hover:text-navy transition-colors flex items-center gap-2">
            <Download size={16} />
            Export
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-navy hover:text-navy transition-colors flex items-center gap-2">
            <Upload size={16} />
            Import
          </button>
          <button
            onClick={() => router.push("/dashboard/students/add")}
            className="px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium hover:bg-navy-mid transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            নতুন শিক্ষার্থী
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
              <UserPlus size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-navy">1,240</div>
              <div className="text-xs text-gray-500">মোট শিক্ষার্থী</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-green-50 text-green-600">
              <UserCheck size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-navy">1,198</div>
              <div className="text-xs text-gray-500">সক্রিয়</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
              <Clock size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-navy">28</div>
              <div className="text-xs text-gray-500">Pending</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-red-50 text-red-600">
              <UserX size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-navy">14</div>
              <div className="text-xs text-gray-500">নিষ্ক্রিয়</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="নাম, রোল নম্বর বা ইমেইল দিয়ে খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-navy-light outline-none"
              />
            </div>
          </div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-navy-light outline-none"
          >
            <option value="all">সব ক্লাস</option>
            <option value="Class 6">Class 6</option>
            <option value="Class 7">Class 7</option>
            <option value="Class 8">Class 8</option>
            <option value="Class 9">Class 9</option>
            <option value="Class 10">Class 10</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-navy-light outline-none"
          >
            <option value="all">সব অবস্থা</option>
            <option value="active">সক্রিয়</option>
            <option value="pending">Pending</option>
            <option value="inactive">নিষ্ক্রিয়</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedStudents.length > 0 && (
        <div className="bg-amber-pale rounded-lg p-3 mb-4 flex justify-between items-center">
          <span className="text-sm text-navy">
            <b>{selectedStudents.length}</b> টি সিলেক্ট করা হয়েছে
          </span>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg hover:border-navy transition-colors">
              ইমেইল পাঠান
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={
                      selectedStudents.length === paginatedStudents.length &&
                      paginatedStudents.length > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-navy focus:ring-navy"
                  />
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  শিক্ষার্থী
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  রোল নং
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  ক্লাস / সেকশন
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  লিঙ্গ
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  উপস্থিতি
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  অবস্থা
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedStudents.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={(e) =>
                        handleSelectStudent(student.id, e.target.checked)
                      }
                      className="w-4 h-4 rounded border-gray-300 text-navy focus:ring-navy"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{
                          backgroundColor: student.avatarBg,
                          color: student.avatarColor,
                        }}
                      >
                        {getInitials(student.first_name, student.last_name)}
                      </div>
                      <div>
                        <div className="font-medium text-navy">
                          {student.first_name} {student.last_name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-navy-light">
                    {student.roll}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-700">
                      {student.class} — {student.section}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {student.gender}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-[60px]">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${student.attendance}%`,
                            backgroundColor:
                              student.attendance >= 85
                                ? "#1D9E75"
                                : student.attendance >= 70
                                  ? "#F5A623"
                                  : "#E24B4A",
                          }}
                        />
                      </div>
                      <span
                        className={`text-xs font-medium px-1.5 py-0.5 rounded ${getAttendanceColor(
                          student.attendance,
                        )}`}
                      >
                        {student.attendance}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(student.status)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() =>
                          router.push(`/dashboard/students/${student.id}`)
                        }
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-navy transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() =>
                          router.push(`/dashboard/students/${student.id}/edit`)
                        }
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-navy transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setStudentToDelete(student.id);
                          setShowDeleteModal(true);
                        }}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-100 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {filteredStudents.length === 0
              ? "কোন শিক্ষার্থী নেই"
              : `${(currentPage - 1) * itemsPerPage + 1} – ${Math.min(
                  currentPage * itemsPerPage,
                  filteredStudents.length,
                )} / ${filteredStudents.length} শিক্ষার্থী`}
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:border-navy transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-sm transition-colors ${
                    currentPage === pageNum
                      ? "bg-navy text-white"
                      : "border border-gray-200 hover:border-navy"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:border-navy transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-md w-full mx-4 p-6">
            <div className="text-center mb-4">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="text-red-600" size={24} />
              </div>
              <h3 className="text-lg font-bold text-navy">Delete Student?</h3>
              <p className="text-gray-500 text-sm mt-1">
                Are you sure you want to delete this student? This action cannot
                be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteStudent}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Import missing icons
function UserCheck(props: any) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5.121 17.804A10 10 0 1119.88 6.196M15 11a3 3 0 11-6 0 3 3 0 016 0zm-6 7h6m-6 0v-2a2 2 0 012-2h2a2 2 0 012 2v2"
      />
    </svg>
  );
}
function Clock(props: any) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
function UserX(props: any) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5.121 17.804A10 10 0 0119.88 6.196M15 11a3 3 0 11-6 0 3 3 0 016 0zm-6 7h6m-6 0v-2a2 2 0 012-2h2a2 2 0 012 2v2"
      />
    </svg>
  );
}
