"use client";

import { useState } from "react";
import {
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Clock,
    Edit,
    Eye,
    Plus,
    Search,
    Trash2,
    Users,
} from "react-feather";
import toast from "react-hot-toast";

interface Course {
  id: number;
  name: string;
  code: string;
  teacher: string;
  class: string;
  section: string;
  students: number;
  duration: string;
  status: "active" | "inactive";
  color: string;
}

const mockCourses: Course[] = [
  {
    id: 1,
    name: "Mathematics",
    code: "MATH-101",
    teacher: "Prof. Abdur Rahman",
    class: "Class 8",
    section: "A",
    students: 32,
    duration: "Mon, Wed 10:00 AM",
    status: "active",
    color: "#E6F1FB",
  },
  {
    id: 2,
    name: "English",
    code: "ENG-101",
    teacher: "Ms. Fatema Begum",
    class: "Class 8",
    section: "A",
    students: 30,
    duration: "Tue, Thu 11:00 AM",
    status: "active",
    color: "#EAF3DE",
  },
  {
    id: 3,
    name: "Bangla",
    code: "BAN-101",
    teacher: "Dr. Kamal Hossain",
    class: "Class 8",
    section: "B",
    students: 28,
    duration: "Sun, Wed 9:00 AM",
    status: "active",
    color: "#FFF3DC",
  },
  {
    id: 4,
    name: "Science",
    code: "SCI-101",
    teacher: "Prof. Rina Akter",
    class: "Class 9",
    section: "A",
    students: 35,
    duration: "Mon, Thu 2:00 PM",
    status: "active",
    color: "#FBEAF0",
  },
  {
    id: 5,
    name: "Social Science",
    code: "SOC-101",
    teacher: "Mr. Rafiq Islam",
    class: "Class 9",
    section: "B",
    students: 33,
    duration: "Tue, Wed 1:00 PM",
    status: "inactive",
    color: "#E1F5EE",
  },
  {
    id: 6,
    name: "Computer Science",
    code: "CS-101",
    teacher: "Ms. Sumaiya Akter",
    class: "Class 10",
    section: "A",
    students: 25,
    duration: "Mon, Wed 3:00 PM",
    status: "active",
    color: "#FCEBEB",
  },
];

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.teacher.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass =
      selectedClass === "all" || course.class === selectedClass;
    const matchesStatus =
      selectedStatus === "all" || course.status === selectedStatus;
    return matchesSearch && matchesClass && matchesStatus;
  });

  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  const handleDeleteCourse = (id: number) => {
    toast.success("Course deleted successfully");
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy">Courses Management</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage all courses, subjects, and assignments
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium hover:bg-navy-mid transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Add Course
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
              <BookOpen size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-navy">24</div>
              <div className="text-xs text-gray-500">Total Courses</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-green-50 text-green-600">
              <Users size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-navy">18</div>
              <div className="text-xs text-gray-500">Active Courses</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
              <Clock size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-navy">6</div>
              <div className="text-xs text-gray-500">Inactive</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by course name, code or teacher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-navy-light outline-none"
            />
          </div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-navy-light outline-none"
          >
            <option value="all">All Classes</option>
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
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="h-2" style={{ backgroundColor: course.color }} />
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-navy text-lg">{course.name}</h3>
                  <p className="text-xs text-gray-400 font-mono mt-1">
                    {course.code}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    course.status === "active"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {course.status === "active" ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Users size={14} className="text-gray-400" />
                  <span className="text-gray-600">Teacher:</span>
                  <span className="text-gray-800">{course.teacher}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen size={14} className="text-gray-400" />
                  <span className="text-gray-600">Class:</span>
                  <span className="text-gray-800">
                    {course.class} - Section {course.section}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users size={14} className="text-gray-400" />
                  <span className="text-gray-600">Students:</span>
                  <span className="text-gray-800">
                    {course.students} enrolled
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={14} className="text-gray-400" />
                  <span className="text-gray-600">Schedule:</span>
                  <span className="text-gray-800">{course.duration}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:border-navy hover:text-navy transition-colors flex items-center justify-center gap-1">
                  <Eye size={14} />
                  Details
                </button>
                <button className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:border-navy hover:text-navy transition-colors flex items-center justify-center gap-1">
                  <Edit size={14} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCourse(course.id)}
                  className="px-3 py-1.5 text-sm border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:border-navy transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-lg text-sm transition-colors ${
                currentPage === page
                  ? "bg-navy text-white"
                  : "border border-gray-200 hover:border-navy"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:border-navy transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-navy">Add New Course</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-navy-light outline-none"
                  placeholder="e.g., Mathematics"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Code
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-navy-light outline-none"
                  placeholder="e.g., MATH-101"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teacher
                </label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-navy-light outline-none">
                  <option>Select Teacher</option>
                  <option>Prof. Abdur Rahman</option>
                  <option>Ms. Fatema Begum</option>
                  <option>Dr. Kamal Hossain</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-navy-light outline-none">
                    <option>Class 6</option>
                    <option>Class 7</option>
                    <option>Class 8</option>
                    <option>Class 9</option>
                    <option>Class 10</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Section
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-navy-light outline-none">
                    <option>A</option>
                    <option>B</option>
                    <option>C</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Schedule
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-navy-light outline-none"
                  placeholder="e.g., Mon, Wed 10:00 AM"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.success("Course added successfully");
                  setShowAddModal(false);
                }}
                className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy-mid"
              >
                Add Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function X(props: any) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}
