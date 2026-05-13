"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Filter,
  MoreVertical,
  Eye,
  Download,
  Mail,
} from "react-feather";

interface Student {
  id: string;
  name: string;
  email: string;
  class: string;
  rollNo: string;
  phone: string;
  guardianName: string;
  status: "active" | "inactive" | "suspended";
  enrollment: string;
}

const mockStudents: Student[] = [
  {
    id: "STU001",
    name: "Arjun Kumar",
    email: "arjun@school.com",
    class: "Class 10-A",
    rollNo: "001",
    phone: "+880 1234567890",
    guardianName: "Mr. Kumar",
    status: "active",
    enrollment: "2023-06-15",
  },
  {
    id: "STU002",
    name: "Priya Sharma",
    email: "priya@school.com",
    class: "Class 10-B",
    rollNo: "002",
    phone: "+880 9876543210",
    guardianName: "Mrs. Sharma",
    status: "active",
    enrollment: "2023-07-20",
  },
  {
    id: "STU003",
    name: "Rahul Singh",
    email: "rahul@school.com",
    class: "Class 9-A",
    rollNo: "003",
    phone: "+880 5555555555",
    guardianName: "Mr. Singh",
    status: "inactive",
    enrollment: "2023-08-10",
  },
  {
    id: "STU004",
    name: "Neha Gupta",
    email: "neha@school.com",
    class: "Class 10-A",
    rollNo: "004",
    phone: "+880 4444444444",
    guardianName: "Mrs. Gupta",
    status: "active",
    enrollment: "2023-06-15",
  },
  {
    id: "STU005",
    name: "Vikram Patel",
    email: "vikram@school.com",
    class: "Class 11-C",
    rollNo: "005",
    phone: "+880 3333333333",
    guardianName: "Mr. Patel",
    status: "active",
    enrollment: "2022-05-10",
  },
];

export default function StudentsPage() {
  const [students, setStudents] = useState(mockStudents);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [openActions, setOpenActions] = useState<string | null>(null);

  const filteredStudents = students.filter((student) => {
    const matchSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNo.includes(searchQuery);

    const matchClass = !filterClass || student.class === filterClass;
    const matchStatus = !filterStatus || student.status === filterStatus;

    return matchSearch && matchClass && matchStatus;
  });

  const classes = ["Class 9-A", "Class 9-B", "Class 10-A", "Class 10-B", "Class 11-C"];
  const statuses = ["active", "inactive", "suspended"];

  const getStatusBadge = (status: string) => {
    const colors = {
      active: "badge-success",
      inactive: "badge-warning",
      suspended: "badge-danger",
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  return (
    <div className="page-content">
      {/* Page Header */}
      <div className="mb-8">
        <div className="page-header mb-6">
          <h1 className="page-title">Students Management</h1>
          <p className="page-subtitle">
            Manage all students in your school system
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name, email, or roll number..."
                className="input-field pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filter Class */}
          <select
            className="input-field"
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
          >
            <option value="">All Classes</option>
            {classes.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>

          {/* Filter Status */}
          <select
            className="input-field"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Found <span className="font-bold">{filteredStudents.length}</span> students
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Download size={16} />
              Export
            </button>
            <Link
              href="/dashboard/students/add"
              className="flex items-center gap-2 px-4 py-2.5 bg-[#f5a623] text-[#0f1f3d] rounded-lg text-sm font-medium hover:bg-[#ffc85a] transition-colors"
            >
              <Plus size={16} />
              Add Student
            </Link>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="card overflow-hidden">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Class</th>
                <th>Roll No.</th>
                <th>Guardian</th>
                <th>Status</th>
                <th>Enrollment</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div>
                        <p className="font-medium text-[#0f1f3d]">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.id}</p>
                      </div>
                    </td>
                    <td>
                      <a
                        href={`mailto:${student.email}`}
                        className="text-[#f5a623] hover:underline text-sm"
                      >
                        {student.email}
                      </a>
                    </td>
                    <td>
                      <span className="text-sm text-gray-700">{student.class}</span>
                    </td>
                    <td>
                      <span className="text-sm font-medium text-gray-700">
                        {student.rollNo}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm text-gray-700">
                        {student.guardianName}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(student.status)}`}>
                        {student.status.charAt(0).toUpperCase() +
                          student.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm text-gray-500">
                        {new Date(student.enrollment).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <div className="relative flex justify-center">
                        <button
                          onClick={() =>
                            setOpenActions(
                              openActions === student.id ? null : student.id
                            )
                          }
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical size={18} className="text-gray-600" />
                        </button>

                        {/* Action Dropdown */}
                        {openActions === student.id && (
                          <div className="absolute right-0 mt-10 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <Link
                              href={`/dashboard/students/${student.id}`}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
                            >
                              <Eye size={16} />
                              View Details
                            </Link>
                            <Link
                              href={`/dashboard/students/${student.id}/edit`}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
                            >
                              <Edit2 size={16} />
                              Edit
                            </Link>
                            <button className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-[#f5a623] hover:bg-amber-50 transition-colors border-b border-gray-100">
                              <Mail size={16} />
                              Send Email
                            </button>
                            <button className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-8">
                    <p className="text-gray-500">No students found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing 1-{filteredStudents.length} of {students.length} students
        </p>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            Previous
          </button>
          <button className="px-4 py-2 bg-[#0f1f3d] text-white rounded-lg text-sm font-medium">
            1
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
