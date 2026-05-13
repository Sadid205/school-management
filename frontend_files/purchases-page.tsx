"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, Eye, MoreVertical, FileText, Filter } from "react-feather";

interface Purchase {
  id: string;
  supplier: string;
  date: string;
  items: number;
  total: number;
  status: "pending" | "received" | "cancelled";
  reference: string;
}

const mockPurchases: Purchase[] = [
  {
    id: "PUR001",
    supplier: "School Supplies Co.",
    date: "2024-01-15",
    items: 15,
    total: 5500,
    status: "received",
    reference: "SUP-2024-001",
  },
  {
    id: "PUR002",
    supplier: "Educational Materials Ltd.",
    date: "2024-01-10",
    items: 8,
    total: 3200,
    status: "pending",
    reference: "EDU-2024-002",
  },
  {
    id: "PUR003",
    supplier: "Office World",
    date: "2024-01-05",
    items: 25,
    total: 8750,
    status: "received",
    reference: "OFF-2024-003",
  },
  {
    id: "PUR004",
    supplier: "Tech Supplies",
    date: "2024-12-28",
    items: 12,
    total: 12500,
    status: "pending",
    reference: "TECH-2024-004",
  },
];

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState(mockPurchases);
  const [filterStatus, setFilterStatus] = useState("");
  const [openActions, setOpenActions] = useState<string | null>(null);

  const filteredPurchases = purchases.filter((p) =>
    !filterStatus ? true : p.status === filterStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "received":
        return "badge-success";
      case "pending":
        return "badge-warning";
      case "cancelled":
        return "badge-danger";
      default:
        return "badge-navy";
    }
  };

  const totalPurchases = purchases.reduce((sum, p) => sum + p.total, 0);
  const pendingTotal = purchases
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.total, 0);

  return (
    <div className="page-content">
      {/* Page Header */}
      <div className="page-header mb-6">
        <h1 className="page-title">Purchases Management</h1>
        <p className="page-subtitle">
          Track and manage all school purchases and invoices
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card border-l-4 border-l-[#f5a623]">
          <p className="text-sm font-medium text-gray-600 mb-1">Total Purchases</p>
          <h3 className="text-3xl font-bold text-[#0f1f3d]">
            ৳ {totalPurchases.toLocaleString()}
          </h3>
          <p className="text-xs text-gray-500 mt-2">{purchases.length} orders</p>
        </div>

        <div className="card border-l-4 border-l-yellow-500">
          <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
          <h3 className="text-3xl font-bold text-[#0f1f3d]">
            ৳ {pendingTotal.toLocaleString()}
          </h3>
          <p className="text-xs text-yellow-600 mt-2">
            {purchases.filter((p) => p.status === "pending").length} pending orders
          </p>
        </div>

        <div className="card border-l-4 border-l-green-600">
          <p className="text-sm font-medium text-gray-600 mb-1">Received</p>
          <h3 className="text-3xl font-bold text-[#0f1f3d]">
            {purchases.filter((p) => p.status === "received").length}
          </h3>
          <p className="text-xs text-green-600 mt-2">Total delivered</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <Filter size={18} className="text-gray-400" />
            <select
              className="input-field"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="received">Received</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <span className="text-sm text-gray-600">
              Showing {filteredPurchases.length} of {purchases.length}
            </span>
          </div>

          <button
            data-bs-toggle="modal"
            data-bs-target="#add-units"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#f5a623] text-[#0f1f3d] rounded-lg text-sm font-medium hover:bg-[#ffc85a] transition-colors"
          >
            <Plus size={16} />
            Add Purchase
          </button>
        </div>
      </div>

      {/* Purchases Table */}
      <div className="card">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Supplier</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.length > 0 ? (
                filteredPurchases.map((purchase) => (
                  <tr key={purchase.id}>
                    <td>
                      <div>
                        <p className="font-medium text-[#0f1f3d]">
                          {purchase.reference}
                        </p>
                        <p className="text-xs text-gray-500">{purchase.id}</p>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm text-gray-700">
                        {purchase.supplier}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm text-gray-700">
                        {new Date(purchase.date).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm font-medium text-gray-700">
                        {purchase.items} items
                      </span>
                    </td>
                    <td>
                      <span className="text-sm font-bold text-[#0f1f3d]">
                        ৳ {purchase.total.toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusColor(purchase.status)}`}>
                        {purchase.status.charAt(0).toUpperCase() +
                          purchase.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className="relative flex justify-center">
                        <button
                          onClick={() =>
                            setOpenActions(
                              openActions === purchase.id ? null : purchase.id
                            )
                          }
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical size={18} className="text-gray-600" />
                        </button>

                        {/* Action Dropdown */}
                        {openActions === purchase.id && (
                          <div className="absolute right-0 mt-10 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <button className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100">
                              <Eye size={16} />
                              View Details
                            </button>
                            <button className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100">
                              <Edit2 size={16} />
                              Edit
                            </button>
                            <button className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100">
                              <FileText size={16} />
                              Invoice
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
                  <td colSpan={7} className="text-center py-8">
                    <p className="text-gray-500">No purchases found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* AddPurchases Modal - TODO: Import the AddPurchases component */}
      <div id="add-units"></div>
    </div>
  );
}
