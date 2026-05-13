"use client";

import { useState } from "react";
import {
  Calendar as CalendarIcon,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Printer,
  Save,
  Search,
  Users,
  XCircle,
} from "react-feather";
import toast from "react-hot-toast";

type AttendanceStatus = "present" | "absent" | "late" | "leave";

interface Student {
  id: number;
  name: string;
  roll: string;
  class: string;
  section: string;
  avatarBg: string;
  avatarColor: string;
  initials: string;
  status: AttendanceStatus;
  note: string;
}

const mockStudents: Student[] = [
  {
    id: 1,
    name: "Ahmed Rahman",
    roll: "STU-101",
    class: "Class 8",
    section: "A",
    avatarBg: "#E6F1FB",
    avatarColor: "#185FA5",
    initials: "AR",
    status: "present",
    note: "",
  },
  {
    id: 2,
    name: "Riya Khatun",
    roll: "STU-102",
    class: "Class 8",
    section: "A",
    avatarBg: "#EAF3DE",
    avatarColor: "#3B6D11",
    initials: "RK",
    status: "present",
    note: "",
  },
  {
    id: 3,
    name: "Karim Molla",
    roll: "STU-103",
    class: "Class 8",
    section: "B",
    avatarBg: "#FFF3DC",
    avatarColor: "#854F0B",
    initials: "KM",
    status: "absent",
    note: "Sick",
  },
  {
    id: 4,
    name: "Nusrat Jahan",
    roll: "STU-104",
    class: "Class 8",
    section: "A",
    avatarBg: "#FBEAF0",
    avatarColor: "#993556",
    initials: "NJ",
    status: "late",
    note: "",
  },
  {
    id: 5,
    name: "Rafiq Islam",
    roll: "STU-105",
    class: "Class 8",
    section: "B",
    avatarBg: "#E1F5EE",
    avatarColor: "#0F6E56",
    initials: "RI",
    status: "present",
    note: "",
  },
  {
    id: 6,
    name: "Sadia Akter",
    roll: "STU-106",
    class: "Class 8",
    section: "A",
    avatarBg: "#FCEBEB",
    avatarColor: "#A32D2D",
    initials: "SA",
    status: "leave",
    note: "Family event",
  },
  {
    id: 7,
    name: "Jahir Hossain",
    roll: "STU-107",
    class: "Class 8",
    section: "B",
    avatarBg: "#E6F1FB",
    avatarColor: "#185FA5",
    initials: "JH",
    status: "present",
    note: "",
  },
  {
    id: 8,
    name: "Mim Begum",
    roll: "STU-108",
    class: "Class 8",
    section: "A",
    avatarBg: "#EAF3DE",
    avatarColor: "#3B6D11",
    initials: "MB",
    status: "absent",
    note: "",
  },
];

const statusConfig = {
  present: {
    label: "উপস্থিত",
    icon: CheckCircle,
    color: "green",
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  absent: {
    label: "অনুপস্থিত",
    icon: XCircle,
    color: "red",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
  late: {
    label: "দেরিতে",
    icon: Clock,
    color: "amber",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  leave: {
    label: "ছুটিতে",
    icon: CalendarIcon,
    color: "blue",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
};

const statusButtons = [
  { value: "present", label: "✓ উপস্থিত", color: "green" },
  { value: "absent", label: "✗ অনুপস্থিত", color: "red" },
  { value: "late", label: "⏱ দেরিতে", color: "amber" },
  { value: "leave", label: "📋 ছুটি", color: "blue" },
];

export default function MarkAttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState("Class 8");
  const [selectedSection, setSelectedSection] = useState("A");
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.roll.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const updateStudentStatus = (id: number, status: AttendanceStatus) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s)),
    );
  };

  const updateStudentNote = (id: number, note: string) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, note } : s)));
  };

  const handleBulkAction = (status: AttendanceStatus) => {
    if (selectedStudents.length === 0) {
      setStudents((prev) => prev.map((s) => ({ ...s, status })));
    } else {
      setStudents((prev) =>
        prev.map((s) =>
          selectedStudents.includes(s.id) ? { ...s, status } : s,
        ),
      );
    }
    toast.success(
      `${selectedStudents.length || filteredStudents.length} students marked as ${status}`,
    );
  };

  const handleSaveAttendance = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Attendance saved successfully!");
    setIsSaving(false);
  };

  const toggleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map((s) => s.id));
    }
  };

  const toggleSelectStudent = (id: number) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents((prev) => prev.filter((sid) => sid !== id));
    } else {
      setSelectedStudents((prev) => [...prev, id]);
    }
  };

  const getStats = () => {
    const total = students.length;
    const present = students.filter((s) => s.status === "present").length;
    const absent = students.filter((s) => s.status === "absent").length;
    const late = students.filter((s) => s.status === "late").length;
    const leave = students.filter((s) => s.status === "leave").length;
    return { total, present, absent, late, leave };
  };

  const stats = getStats();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("bn-BD", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy">উপস্থিতি ব্যবস্থাপনা</h1>
          <p className="mt-1 text-sm text-gray-500">
            শিক্ষার্থীদের দৈনিক উপস্থিতি নিয়ন্ত্রণ করুন
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg hover:border-navy hover:text-navy">
            <Download size={16} />
            রিপোর্ট Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg hover:border-navy hover:text-navy">
            <Printer size={16} />
            প্রিন্ট
          </button>
          <button
            onClick={handleSaveAttendance}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <Save size={16} />
            {isSaving ? "Saving..." : "সংরক্ষণ করুন"}
          </button>
        </div>
      </div>

      {/* Filters Card */}
      <div className="p-4 mb-6 bg-white border border-gray-100 rounded-xl">
        <div className="flex flex-wrap items-center gap-4">
          {/* Date Selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => changeDate(-1)}
              className="p-2 transition-colors border border-gray-200 rounded-lg hover:border-navy"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg">
              <CalendarIcon size={16} className="text-gray-400" />
              <span className="text-sm text-navy">
                {formatDate(selectedDate)}
              </span>
            </div>
            <button
              onClick={() => changeDate(1)}
              className="p-2 transition-colors border border-gray-200 rounded-lg hover:border-navy"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => setSelectedDate(new Date())}
              className="px-3 py-2 text-sm transition-colors border rounded-lg border-amber-200 text-amber-700 hover:bg-amber-50"
            >
              আজ
            </button>
          </div>

          <div className="w-px h-8 bg-gray-200" />

          {/* Class Selector */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-navy-light"
          >
            <option>Class 6</option>
            <option>Class 7</option>
            <option>Class 8</option>
            <option>Class 9</option>
            <option>Class 10</option>
          </select>

          {/* Section Selector */}
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-navy-light"
          >
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>

          {/* Subject Selector */}
          <select className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-navy-light">
            <option>সব বিষয়</option>
            <option>গণিত</option>
            <option>বাংলা</option>
            <option>ইংরেজি</option>
            <option>বিজ্ঞান</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="p-3 text-center bg-white border border-gray-100 rounded-xl">
          <Users size={20} className="mx-auto mb-1 text-navy" />
          <div className="text-xl font-bold text-navy">{stats.total}</div>
          <div className="text-xs text-gray-500">মোট শিক্ষার্থী</div>
        </div>
        <div className="p-3 text-center border border-green-100 bg-green-50 rounded-xl">
          <CheckCircle size={20} className="mx-auto mb-1 text-green-600" />
          <div className="text-xl font-bold text-green-700">
            {stats.present}
          </div>
          <div className="text-xs text-green-600">উপস্থিত</div>
          <div className="text-xs text-green-500">
            {Math.round((stats.present / stats.total) * 100)}%
          </div>
        </div>
        <div className="p-3 text-center border border-red-100 bg-red-50 rounded-xl">
          <XCircle size={20} className="mx-auto mb-1 text-red-600" />
          <div className="text-xl font-bold text-red-700">{stats.absent}</div>
          <div className="text-xs text-red-600">অনুপস্থিত</div>
          <div className="text-xs text-red-500">
            {Math.round((stats.absent / stats.total) * 100)}%
          </div>
        </div>
        <div className="p-3 text-center border bg-amber-50 rounded-xl border-amber-100">
          <Clock size={20} className="mx-auto mb-1 text-amber-600" />
          <div className="text-xl font-bold text-amber-700">{stats.late}</div>
          <div className="text-xs text-amber-600">দেরিতে</div>
          <div className="text-xs text-amber-500">
            {Math.round((stats.late / stats.total) * 100)}%
          </div>
        </div>
        <div className="p-3 text-center border border-blue-100 bg-blue-50 rounded-xl">
          <CalendarIcon size={20} className="mx-auto mb-1 text-blue-600" />
          <div className="text-xl font-bold text-blue-700">{stats.leave}</div>
          <div className="text-xs text-blue-600">ছুটিতে</div>
          <div className="text-xs text-blue-500">
            {Math.round((stats.leave / stats.total) * 100)}%
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="p-4 mb-6 bg-white border border-gray-100 rounded-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              <b id="selectedCount">{selectedStudents.length}</b> টি সিলেক্ট করা
              হয়েছে
            </span>
            <div className="flex gap-2">
              {statusButtons.map((btn) => (
                <button
                  key={btn.value}
                  onClick={() =>
                    handleBulkAction(btn.value as AttendanceStatus)
                  }
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                    btn.color === "green"
                      ? "border-green-200 text-green-700 hover:bg-green-50"
                      : btn.color === "red"
                        ? "border-red-200 text-red-700 hover:bg-red-50"
                        : btn.color === "amber"
                          ? "border-amber-200 text-amber-700 hover:bg-amber-50"
                          : "border-blue-200 text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <Search
              size={16}
              className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2"
            />
            <input
              type="text"
              placeholder="নাম খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 py-2 pl-10 pr-4 text-sm border border-gray-200 rounded-lg outline-none focus:border-navy-light"
            />
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="overflow-hidden bg-white border border-gray-100 rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={
                      selectedStudents.length === filteredStudents.length &&
                      filteredStudents.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="w-4 h-4 border-gray-300 rounded text-navy focus:ring-navy"
                  />
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-left text-gray-500 uppercase">
                  শিক্ষার্থী
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-left text-gray-500 uppercase">
                  রোল নং
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-left text-gray-500 uppercase">
                  ক্লাস / সেকশন
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-left text-gray-500 uppercase">
                  উপস্থিতি স্ট্যাটাস
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-left text-gray-500 uppercase">
                  নোট
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map((student) => {
                const status = statusConfig[student.status];
                const StatusIcon = status.icon;
                return (
                  <tr
                    key={student.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => toggleSelectStudent(student.id)}
                        className="w-4 h-4 border-gray-300 rounded text-navy focus:ring-navy"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex items-center justify-center text-sm font-bold rounded-full w-9 h-9"
                          style={{
                            backgroundColor: student.avatarBg,
                            color: student.avatarColor,
                          }}
                        >
                          {student.initials}
                        </div>
                        <div>
                          <div className="font-medium text-navy">
                            {student.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {student.class}, Section {student.section}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-navy-light">
                      {student.roll}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded-md">
                        {student.class} — {student.section}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {statusButtons.map((btn) => {
                          const isActive = student.status === btn.value;
                          return (
                            <button
                              key={btn.value}
                              onClick={() =>
                                updateStudentStatus(
                                  student.id,
                                  btn.value as AttendanceStatus,
                                )
                              }
                              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                                isActive
                                  ? btn.color === "green"
                                    ? "bg-green-600 text-white"
                                    : btn.color === "red"
                                      ? "bg-red-600 text-white"
                                      : btn.color === "amber"
                                        ? "bg-amber-600 text-white"
                                        : "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              {btn.label}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={student.note}
                        onChange={(e) =>
                          updateStudentNote(student.id, e.target.value)
                        }
                        placeholder="নোট লিখুন..."
                        className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:border-navy-light outline-none w-40"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
