"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    ArrowLeft,
    BookOpen,
    Calendar,
    Mail,
    MapPin,
    Phone,
    Save,
    Upload,
    User,
    Users
} from "react-feather";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface StudentFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  address: string;
  class_level: string;
  section: string;
  roll_number?: string;
  father_name: string;
  mother_name: string;
  parent_phone: string;
  parent_email: string;
}

export default function AddStudentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<StudentFormData>();

  const onSubmit = async (data: StudentFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Student added successfully!");
      router.push("/dashboard/students");
    } catch (error) {
      toast.error("Failed to add student");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-navy">
            নতুন শিক্ষার্থী যোগ করুন
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            শিক্ষার্থীর সকল তথ্য পূরণ করুন
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Profile Image Upload */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img
                    src={URL.createObjectURL(profileImage)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={32} className="text-gray-400" />
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 p-1.5 bg-navy rounded-full cursor-pointer hover:bg-navy-mid transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <Upload size={14} className="text-white" />
              </label>
            </div>
            <div>
              <p className="text-sm font-medium text-navy">শিক্ষার্থীর ছবি</p>
              <p className="text-xs text-gray-400 mt-1">
                JPG, PNG or GIF (Max 2MB)
              </p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
            <User size={18} />
            ব্যক্তিগত তথ্য
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                প্রথম নাম <span className="text-red-500">*</span>
              </label>
              <input
                {...register("first_name", {
                  required: "First name is required",
                })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-navy-light outline-none"
                placeholder="যেমন: Ahmed"
              />
              {errors.first_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.first_name.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                শেষ নাম <span className="text-red-500">*</span>
              </label>
              <input
                {...register("last_name", {
                  required: "Last name is required",
                })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-navy-light outline-none"
                placeholder="যেমন: Rahman"
              />
              {errors.last_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.last_name.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ইমেইল <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:border-navy-light outline-none"
                  placeholder="student@school.edu"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ফোন নম্বর
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  {...register("phone")}
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:border-navy-light outline-none"
                  placeholder="01XXXXXXXXX"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                জন্ম তারিখ
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  {...register("date_of_birth")}
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:border-navy-light outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                লিঙ্গ <span className="text-red-500">*</span>
              </label>
              <select
                {...register("gender", { required: "Gender is required" })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-navy-light outline-none"
              >
                <option value="">সিলেক্ট করুন</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ঠিকানা
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <textarea
                  {...register("address")}
                  rows={3}
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:border-navy-light outline-none"
                  placeholder="সম্পূর্ণ ঠিকানা লিখুন"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
            <BookOpen size={18} />
            একাডেমিক তথ্য
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ক্লাস <span className="text-red-500">*</span>
              </label>
              <select
                {...register("class_level", { required: "Class is required" })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-navy-light outline-none"
              >
                <option value="">সিলেক্ট করুন</option>
                <option value="Class 6">Class 6</option>
                <option value="Class 7">Class 7</option>
                <option value="Class 8">Class 8</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10</option>
              </select>
              {errors.class_level && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.class_level.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                সেকশন <span className="text-red-500">*</span>
              </label>
              <select
                {...register("section", { required: "Section is required" })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-navy-light outline-none"
              >
                <option value="">সিলেক্ট করুন</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
              {errors.section && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.section.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                রোল নম্বর
              </label>
              <input
                {...register("roll_number")}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-navy-light outline-none"
                placeholder="অটো জেনারেট হবে"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ভর্তির তারিখ
              </label>
              <input
                type="date"
                {...register("admission_date")}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-navy-light outline-none"
              />
            </div>
          </div>
        </div>

        {/* Parent Information */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
            <Users size={18} />
            অভিভাবক তথ্য
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                পিতার নাম
              </label>
              <input
                {...register("father_name")}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-navy-light outline-none"
                placeholder="পিতার নাম"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                মাতার নাম
              </label>
              <input
                {...register("mother_name")}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-navy-light outline-none"
                placeholder="মাতার নাম"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                অভিভাবকের ফোন
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  {...register("parent_phone")}
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:border-navy-light outline-none"
                  placeholder="01XXXXXXXXX"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                অভিভাবকের ইমেইল
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  {...register("parent_email")}
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:border-navy-light outline-none"
                  placeholder="parent@email.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            বাতিল
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-navy text-white rounded-lg font-medium hover:bg-navy-mid transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={16} />
            {isSubmitting ? "Saving..." : "শিক্ষার্থী যোগ করুন"}
          </button>
        </div>
      </form>
    </div>
  );
}
