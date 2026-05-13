"use client";

import { useState } from "react";
import { Check, X, Calendar, Save, RotateCcw } from "react-feather";

interface AttendanceRecord {
  id: string;
  name: string;
  rollNo: string;
  status: "present" | "absent" | "leave" | null;
  remarks?: string;
}

const mockClass = [
  { id: "1", name: "Arjun Kumar", rollNo: "001" },
  { id: "2", name: "Priya Sharma", rollNo: "002" },
  { id: "3", name: "Rahul Singh", rollNo: "003" },
  { id: "4", name: "Neha Gupta", rollNo: "004" },
  { id: "5", name: "Vikram Patel", rollNo: "005" },
  { id: "6", name: "Anjali Verma", rollNo: "006" },
  { id: "7", name: "Ravi Kumar", rollNo: "007" },
  { id: "8", name: "Sneha Mishra", rollNo: "008" },
];

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState("Class 10-A");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [records, setRecords] = useState<AttendanceRecord[]>(
    mockClass.map((student) => ({
      ...student,
      status: null,
    }))
  );
  const [remarks, setRemarks] = useState("");

  const updateStatus = (
    id: string,
    status: "present" | "absent" | "leave"
  ) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const presentCount = records.filter((r) => r.status === "present").length;
  const absentCount = records.filter((r) => r.status === "absent").length;
  const leaveCount = records.filter((r) => r.status === "leave").length;

  const handleSave = async () => {
    console.log("Saving attendance...", { selectedDate, selectedClass, records });
    // TODO: Call API to save
  };

  const handleReset = () => {
    setRecords(mockClass.map((student) => ({ ...student, status: null })));
  };

  return (
    <div className="page-content">
      {/* Page Header */}
      <div className="page-header mb-6">
        <h1 className="page-title">Mark Attendance</h1>
        <p className="page-subtitle">Record student attendance for the day</p>
      </div>

      {/* Top Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="date"
              className="input-field pl-10"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>

        {/* Class Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Class
          </label>
          <select
            className="input-field"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option>Class 9-A</option>
            <option>Class 9-B</option>
            <option>Class 10-A</option>
            <option>Class 10-B</option>
            <option>Class 11-C</option>
          </select>
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-to-br from-[#0f1f3d] to-[#1a3260] rounded-lg p-4 text-white">
          <p className="text-sm mb-3">Today's Status</p>
          <div className="flex justify-between gap-2">
            <div>
              <p className="text-2xl font-bold">{presentCount}</p>
              <p className="text-xs text-[#a8bedd]">Present</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{absentCount}</p>
              <p className="text-xs text-[#a8bedd]">Absent</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{leaveCount}</p>
              <p className="text-xs text-[#a8bedd]">Leave</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="card">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Roll No.</th>
                <th>Student Name</th>
                <th className="text-center">Present</th>
                <th className="text-center">Absent</th>
                <th className="text-center">Leave</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td className="font-medium text-[#0f1f3d]">{record.rollNo}</td>
                  <td>{record.name}</td>

                  {/* Present Button */}
                  <td className="text-center">
                    <button
                      onClick={() => updateStatus(record.id, "present")}
                      className={`inline-flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                        record.status === "present"
                          ? "bg-green-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-400 hover:bg-green-50"
                      }`}
                    >
                      <Check size={18} />
                    </button>
                  </td>

                  {/* Absent Button */}
                  <td className="text-center">
                    <button
                      onClick={() => updateStatus(record.id, "absent")}
                      className={`inline-flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                        record.status === "absent"
                          ? "bg-red-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-400 hover:bg-red-50"
                      }`}
                    >
                      <X size={18} />
                    </button>
                  </td>

                  {/* Leave Button */}
                  <td className="text-center">
                    <button
                      onClick={() => updateStatus(record.id, "leave")}
                      className={`inline-flex items-center justify-center w-10 h-10 rounded-full transition-all px-2 text-xs font-bold transition-all ${
                        record.status === "leave"
                          ? "bg-yellow-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-400 hover:bg-yellow-50"
                      }`}
                    >
                      L
                    </button>
                  </td>

                  {/* Remarks */}
                  <td>
                    <input
                      type="text"
                      placeholder="Add notes..."
                      className="input-field text-xs"
                      defaultValue={record.remarks}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-6 flex justify-end gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <RotateCcw size={16} />
            Reset
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#1d9e75] text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <Save size={16} />
            Save Attendance
          </button>
        </div>
      </div>
    </div>
  );
}
