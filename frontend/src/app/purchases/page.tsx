"use client";

import { DatePicker } from "antd";
import { useMemo, useState } from "react";
import {
    Check,
    ChevronLeft,
    ChevronRight,
    Download,
    Edit,
    Eye,
    FileText,
    Plus,
    PlusCircle,
    Search,
    Trash2,
    X
} from "react-feather";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Select from "react-select";

// Mock data
const suppliersList = [
  { value: 1, label: "ABC Suppliers" },
  { value: 2, label: "XYZ Traders" },
  { value: 3, label: "Global Books" },
  { value: 4, label: "Stationery House" },
];

const productVariantList = [
  { value: 1, label: "Mathematics Book - Class 8" },
  { value: 2, label: "English Grammar Book" },
  { value: 3, label: "Science Lab Equipment Set" },
  { value: 4, label: "Whiteboard Markers (Box)" },
  { value: 5, label: "Student Notebook (Pack)" },
  { value: 6, label: "Geometry Box" },
  { value: 7, label: "Physics Practical Kit" },
  { value: 8, label: "Chemistry Lab Glassware" },
];

interface PurchaseItem {
  product_variant: number;
  product_name: string;
  qty: number;
  purchase_price: number;
  discount: number;
  tax_percent: number;
  tax_amount: number;
  unit_cost: number;
  total_cost: number;
}

interface PurchaseForm {
  supplier: number;
  purchase_date: string;
  reference: string;
  status: string;
  items: PurchaseItem[];
  order_tax: number;
  discount: number;
  shipping: number;
  notes: string;
}

// Mock purchase history
const purchaseHistory = [
  {
    id: 1,
    reference: "PO-2024-001",
    supplier: "ABC Suppliers",
    date: "2024-05-10",
    total: 12500,
    status: "received",
    items: 5,
  },
  {
    id: 2,
    reference: "PO-2024-002",
    supplier: "XYZ Traders",
    date: "2024-05-08",
    total: 8750,
    status: "pending",
    items: 3,
  },
  {
    id: 3,
    reference: "PO-2024-003",
    supplier: "Global Books",
    date: "2024-05-05",
    total: 15200,
    status: "received",
    items: 8,
  },
  {
    id: 4,
    reference: "PO-2024-004",
    supplier: "Stationery House",
    date: "2024-05-01",
    total: 4300,
    status: "cancelled",
    items: 2,
  },
];

const statusOptions = [
  { value: "pending", label: "Pending", color: "#F5A623" },
  { value: "received", label: "Received", color: "#1D9E75" },
  { value: "cancelled", label: "Cancelled", color: "#E24B4A" },
];

export default function PurchasesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<any>({});

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PurchaseForm>({
    defaultValues: {
      status: "pending",
      items: [],
      order_tax: 0,
      discount: 0,
      shipping: 0,
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = watch("items") || [];
  const watchedOrderTax = watch("order_tax") || 0;
  const watchedDiscount = watch("discount") || 0;
  const watchedShipping = watch("shipping") || 0;

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    if (!productSearch) return productVariantList;
    return productVariantList.filter((p) =>
      p.label.toLowerCase().includes(productSearch.toLowerCase()),
    );
  }, [productSearch]);

  // Calculate item values
  const calculateItemValues = (item: Partial<PurchaseItem>) => {
    const purchasePrice = parseFloat(item.purchase_price as any) || 0;
    const discount = parseFloat(item.discount as any) || 0;
    const taxPercent = parseFloat(item.tax_percent as any) || 0;
    const qty = parseInt(item.qty as any) || 0;

    const unitCost = purchasePrice - discount;
    const taxAmount = (unitCost * taxPercent) / 100;
    const totalCost = (unitCost + taxAmount) * qty;

    return {
      unit_cost: unitCost.toFixed(2),
      tax_amount: taxAmount.toFixed(2),
      total_cost: totalCost.toFixed(2),
    };
  };

  // Add product to items
  const handleSelectProduct = (product: any) => {
    const exists = watchedItems.find(
      (item: any) => item.product_variant === product.value,
    );
    if (exists) {
      toast.error("Product already added");
      setShowProductDropdown(false);
      setProductSearch("");
      return;
    }

    append({
      product_variant: product.value,
      product_name: product.label,
      qty: 1,
      purchase_price: 0,
      discount: 0,
      tax_percent: 0,
      tax_amount: 0,
      unit_cost: 0,
      total_cost: 0,
    });

    setShowProductDropdown(false);
    setProductSearch("");
  };

  // Edit handlers
  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditValues({ ...watchedItems[index] });
  };

  const saveEdit = (index: number) => {
    const calculated = calculateItemValues(editValues);
    update(index, {
      ...editValues,
      ...calculated,
    });
    setEditingIndex(null);
    setEditValues({});
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditValues({});
  };

  // Calculate grand total
  const grandTotal = useMemo(() => {
    const itemsTotal = watchedItems.reduce((sum: number, item: any) => {
      return sum + (parseFloat(item.total_cost) || 0);
    }, 0);
    return itemsTotal + watchedOrderTax + watchedShipping - watchedDiscount;
  }, [watchedItems, watchedOrderTax, watchedDiscount, watchedShipping]);

  // Handle form submit
  const onSubmit = async (data: PurchaseForm) => {
    if (data.items.length === 0) {
      toast.error("Please add at least one product");
      return;
    }
    if (!data.supplier) {
      toast.error("Please select a supplier");
      return;
    }
    if (!data.purchase_date) {
      toast.error("Please select purchase date");
      return;
    }

    toast.success("Purchase saved successfully!");
    reset();
    setShowAddModal(false);
  };

  // Filter purchases for history table
  const filteredPurchases = purchaseHistory.filter(
    (p) =>
      p.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.supplier.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "received":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-50 text-green-700">
            Received
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-amber-50 text-amber-700">
            Pending
          </span>
        );
      case "cancelled":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-50 text-red-700">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy">Purchases Management</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage all purchase orders and inventory
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-navy hover:text-navy transition-colors flex items-center gap-2">
            <Download size={16} />
            Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium hover:bg-navy-mid transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Add Purchase
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-navy">24</div>
              <div className="text-xs text-gray-500">Total Purchases</div>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
              <FileText size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-navy">৳ 40,750</div>
              <div className="text-xs text-gray-500">Total Spent</div>
            </div>
            <div className="p-2.5 rounded-lg bg-green-50 text-green-600">
              <PlusCircle size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-navy">18</div>
              <div className="text-xs text-gray-500">Received</div>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
              <Check size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-navy">6</div>
              <div className="text-xs text-gray-500">Pending</div>
            </div>
            <div className="p-2.5 rounded-lg bg-red-50 text-red-600">
              <Clock size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by PO number or supplier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-navy-light outline-none"
            />
          </div>
          <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-navy-light outline-none">
            <option value="">All Status</option>
            <option value="received">Received</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  PO Number
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Supplier
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Date
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Items
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Total
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPurchases.map((purchase) => (
                <tr
                  key={purchase.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-navy">
                    {purchase.reference}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {purchase.supplier}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-sm">
                    {purchase.date}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {purchase.items} items
                  </td>
                  <td className="px-4 py-3 font-semibold text-navy">
                    ৳ {purchase.total.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(purchase.status)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedPurchase(purchase);
                          setShowDetailModal(true);
                        }}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-navy transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-navy transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
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
            Showing 1 – 4 of 24 purchases
          </div>
          <div className="flex gap-1">
            <button className="p-2 rounded-lg border border-gray-200 hover:border-navy transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 rounded-lg bg-navy text-white">1</button>
            <button className="w-8 h-8 rounded-lg border border-gray-200 hover:border-navy transition-colors">
              2
            </button>
            <button className="w-8 h-8 rounded-lg border border-gray-200 hover:border-navy transition-colors">
              3
            </button>
            <button className="p-2 rounded-lg border border-gray-200 hover:border-navy transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Add Purchase Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-5xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-navy">Add Purchase</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              {/* Row 1: Supplier, Date, Reference, Status */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier Name <span className="text-red-500">*</span>
                  </label>
                  <Select
                    options={suppliersList}
                    className="react-select"
                    classNamePrefix="react-select"
                    placeholder="Select supplier"
                    onChange={(opt: any) => setValue("supplier", opt?.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purchase Date <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    className="w-full"
                    placeholder="dd/mm/yyyy"
                    format="DD/MM/YYYY"
                    onChange={(date, dateString) =>
                      setValue("purchase_date", dateString as string)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reference No
                  </label>
                  <input
                    {...register("reference")}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-navy-light outline-none"
                    placeholder="Auto-generated"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <Select
                    options={statusOptions}
                    className="react-select"
                    classNamePrefix="react-select"
                    placeholder="Select status"
                    defaultValue={statusOptions[0]}
                    onChange={(opt: any) => setValue("status", opt?.value)}
                  />
                </div>
              </div>

              {/* Product Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => {
                      setProductSearch(e.target.value);
                      setShowProductDropdown(true);
                    }}
                    onFocus={() => setShowProductDropdown(true)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-navy-light outline-none"
                    placeholder="Please type product code and select"
                  />
                  {showProductDropdown && productSearch && (
                    <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <button
                            key={product.value}
                            type="button"
                            onClick={() => handleSelectProduct(product)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm"
                          >
                            {product.label}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          No products found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">
                        Product
                      </th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 w-20">
                        Qty
                      </th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 w-28">
                        Price ($)
                      </th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 w-24">
                        Discount ($)
                      </th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 w-20">
                        Tax (%)
                      </th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 w-24">
                        Tax Amount
                      </th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 w-24">
                        Unit Cost
                      </th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 w-28">
                        Total Cost
                      </th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 w-20">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {fields.length === 0 ? (
                      <tr>
                        <td
                          colSpan={9}
                          className="text-center py-8 text-gray-400"
                        >
                          No products added yet
                        </td>
                      </tr>
                    ) : (
                      fields.map((field, index) => {
                        const item = watchedItems[index] || {};
                        const calculated = calculateItemValues(item);
                        const isEditing = editingIndex === index;

                        return (
                          <tr key={field.id}>
                            <td className="px-3 py-2 text-sm">
                              {item.product_name}
                            </td>
                            <td className="px-3 py-2">
                              {isEditing ? (
                                <input
                                  type="number"
                                  className="w-20 px-2 py-1 border border-gray-200 rounded text-sm text-center"
                                  value={editValues.qty}
                                  onChange={(e) =>
                                    setEditValues({
                                      ...editValues,
                                      qty: e.target.value,
                                    })
                                  }
                                />
                              ) : (
                                <div className="text-center">{item.qty}</div>
                              )}
                            </td>
                            <td className="px-3 py-2">
                              {isEditing ? (
                                <input
                                  type="number"
                                  className="w-28 px-2 py-1 border border-gray-200 rounded text-sm"
                                  value={editValues.purchase_price}
                                  onChange={(e) =>
                                    setEditValues({
                                      ...editValues,
                                      purchase_price: e.target.value,
                                    })
                                  }
                                />
                              ) : (
                                <div className="text-center">
                                  ${item.purchase_price}
                                </div>
                              )}
                            </td>
                            <td className="px-3 py-2">
                              {isEditing ? (
                                <input
                                  type="number"
                                  className="w-24 px-2 py-1 border border-gray-200 rounded text-sm"
                                  value={editValues.discount}
                                  onChange={(e) =>
                                    setEditValues({
                                      ...editValues,
                                      discount: e.target.value,
                                    })
                                  }
                                />
                              ) : (
                                <div className="text-center">
                                  ${item.discount}
                                </div>
                              )}
                            </td>
                            <td className="px-3 py-2">
                              {isEditing ? (
                                <input
                                  type="number"
                                  className="w-20 px-2 py-1 border border-gray-200 rounded text-sm text-center"
                                  value={editValues.tax_percent}
                                  onChange={(e) =>
                                    setEditValues({
                                      ...editValues,
                                      tax_percent: e.target.value,
                                    })
                                  }
                                />
                              ) : (
                                <div className="text-center">
                                  {item.tax_percent}%
                                </div>
                              )}
                            </td>
                            <td className="px-3 py-2 text-center text-sm">
                              $
                              {isEditing
                                ? calculateItemValues(editValues).tax_amount
                                : calculated.tax_amount}
                            </td>
                            <td className="px-3 py-2 text-center text-sm">
                              $
                              {isEditing
                                ? calculateItemValues(editValues).unit_cost
                                : calculated.unit_cost}
                            </td>
                            <td className="px-3 py-2 text-center text-sm font-medium">
                              $
                              {isEditing
                                ? calculateItemValues(editValues).total_cost
                                : calculated.total_cost}
                            </td>
                            <td className="px-3 py-2 text-center">
                              {isEditing ? (
                                <div className="flex gap-1 justify-center">
                                  <button
                                    type="button"
                                    onClick={() => saveEdit(index)}
                                    className="p-1 rounded bg-green-100 text-green-600 hover:bg-green-200"
                                  >
                                    <Check size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="p-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex gap-1 justify-center">
                                  <button
                                    type="button"
                                    onClick={() => startEdit(index)}
                                    className="p-1 rounded hover:bg-gray-100 text-gray-500"
                                  >
                                    <Edit size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="p-1 rounded hover:bg-gray-100 text-red-500"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                    {fields.length > 0 && (
                      <tr className="bg-gray-50 font-semibold">
                        <td colSpan={7} className="px-3 py-2 text-right">
                          Grand Total:
                        </td>
                        <td className="px-3 py-2 text-center">
                          ${grandTotal.toFixed(2)}
                        </td>
                        <td></td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Order Tax, Discount, Shipping */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order Tax
                  </label>
                  <input
                    {...register("order_tax")}
                    type="number"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-navy-light outline-none"
                    defaultValue={0}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount
                  </label>
                  <input
                    {...register("discount")}
                    type="number"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-navy-light outline-none"
                    defaultValue={0}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shipping
                  </label>
                  <input
                    {...register("shipping")}
                    type="number"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-navy-light outline-none"
                    defaultValue={0}
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  {...register("notes")}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-navy-light outline-none"
                  placeholder="Additional notes..."
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setShowAddModal(false);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-navy text-white rounded-lg font-medium hover:bg-navy-mid"
                >
                  Submit Purchase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Purchase Detail Modal */}
      {showDetailModal && selectedPurchase && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-navy">Purchase Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-gray-400">PO Number</div>
                  <div className="font-medium text-navy">
                    {selectedPurchase.reference}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Date</div>
                  <div className="text-gray-700">{selectedPurchase.date}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Supplier</div>
                  <div className="text-gray-700">
                    {selectedPurchase.supplier}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Status</div>
                  <div>{getStatusBadge(selectedPurchase.status)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Total Items</div>
                  <div className="text-gray-700">{selectedPurchase.items}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Total Amount</div>
                  <div className="font-bold text-navy text-lg">
                    ৳ {selectedPurchase.total.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy-mid">
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Missing icon
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
