"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart2,
  BookOpen,
  Calendar,
  Clock,
  Facebook,
  GitHub,
  Linkedin,
  Mail,
  MapPin,
  Phone, // ← BarChart3 না, BarChart2 ব্যবহার করুন
  Shield,
  Star,
  Twitter,
  Users,
} from "react-feather";

export default function HomePage() {
  const router = useRouter();

  const features = [
    {
      icon: Users,
      title: "Student Management",
      description:
        "Complete student profile management with attendance, marks, and performance tracking.",
      color: "blue",
    },
    {
      icon: Calendar,
      title: "Attendance System",
      description: "Easy daily attendance marking with reports and analytics.",
      color: "green",
    },
    {
      icon: BookOpen,
      title: "Course Management",
      description: "Manage courses, subjects, assignments, and exam schedules.",
      color: "amber",
    },
    {
      icon: BarChart2,
      title: "Analytics & Reports",
      description: "Advanced analytics with visual reports and insights.",
      color: "purple",
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Enterprise-grade security with role-based access control.",
      color: "red",
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Instant notifications and real-time data synchronization.",
      color: "indigo",
    },
  ];

  const stats = [
    { value: "5,000+", label: "Active Students", icon: Users },
    { value: "200+", label: "Expert Teachers", icon: Users },
    { value: "98%", label: "Parent Satisfaction", icon: Star },
    { value: "24/7", label: "Support Available", icon: Clock },
  ];

  const testimonials = [
    {
      name: "Ahmed Rahman",
      role: "School Principal",
      content:
        "EduNest has transformed how we manage our school operations. The attendance system alone saved us hours of manual work.",
      rating: 5,
      avatar: "AR",
    },
    {
      name: "Fatema Begum",
      role: "Parent",
      content:
        "I can easily track my child's attendance, exam results, and fee status from one dashboard. Very user-friendly!",
      rating: 5,
      avatar: "FB",
    },
    {
      name: "Prof. Karim Molla",
      role: "Head of Academics",
      content:
        "The exam management and result processing features are outstanding. Highly recommended for educational institutions.",
      rating: 5,
      avatar: "KM",
    },
  ];

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      blue: "bg-blue-50 text-blue-600",
      green: "bg-green-50 text-green-600",
      amber: "bg-amber-50 text-amber-600",
      purple: "bg-purple-50 text-purple-600",
      red: "bg-red-50 text-red-600",
      indigo: "bg-indigo-50 text-indigo-600",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber flex items-center justify-center text-navy font-bold">
                E
              </div>
              <span className="font-bold text-xl text-navy">EduNest</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-navy transition-colors"
              >
                Features
              </a>
              <a
                href="#about"
                className="text-gray-600 hover:text-navy transition-colors"
              >
                About
              </a>
              <a
                href="#contact"
                className="text-gray-600 hover:text-navy transition-colors"
              >
                Contact
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-navy font-medium hover:bg-gray-50 rounded-lg transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-navy text-white font-medium rounded-lg hover:bg-navy-mid transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-pale text-amber-700 text-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-amber"></span>
                Next-Gen School Management
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy leading-tight mb-6">
                Manage Your School
                <span className="text-amber"> Smarter & Faster</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Complete school management platform for students, teachers, and
                parents. Attendance, exams, results, fees — all in one place.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="px-6 py-3 bg-navy text-white font-semibold rounded-lg hover:bg-navy-mid transition-colors flex items-center gap-2"
                >
                  Start Free Trial <ArrowRight size={18} />
                </Link>
                <Link
                  href="#features"
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-navy hover:text-navy transition-colors"
                >
                  Watch Demo
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-8 pt-4">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="text-center">
                      <div className="text-2xl font-bold text-navy">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {stat.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-navy to-navy-mid rounded-2xl p-8 shadow-2xl">
                <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-amber flex items-center justify-center">
                      <Users size={20} className="text-navy" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">
                        Quick Stats
                      </div>
                      <div className="text-white/60 text-sm">
                        Today's Overview
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      {
                        label: "Present Today",
                        value: "342",
                        total: "380",
                        percentage: 90,
                      },
                      {
                        label: "Classes Active",
                        value: "12",
                        total: "15",
                        percentage: 80,
                      },
                      {
                        label: "Assignments Due",
                        value: "8",
                        total: "12",
                        percentage: 67,
                      },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/70">{item.label}</span>
                          <span className="text-white font-medium">
                            {item.value}/{item.total}
                          </span>
                        </div>
                        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber rounded-full transition-all"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Everything You Need to Run Your School
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Powerful features to streamline all administrative tasks and
              improve communication
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div
                    className={`w-12 h-12 rounded-lg ${getColorClass(feature.color)} flex items-center justify-center mb-4`}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-navy mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Trusted by Educational Institutions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See what our customers have to say about EduNest
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber flex items-center justify-center text-navy font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-navy">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber text-amber" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {testimonial.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your School Management?
          </h2>
          <p className="text-white/70 mb-8">
            Join thousands of schools using EduNest to streamline their
            operations
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-3 bg-amber text-navy font-semibold rounded-lg hover:bg-amber-light transition-colors"
          >
            Get Started Today <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber flex items-center justify-center text-navy font-bold">
                  E
                </div>
                <span className="font-bold text-lg">EduNest</span>
              </div>
              <p className="text-gray-400 text-sm">
                Complete school management platform for modern education.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Demo
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Mail size={14} /> support@edunest.com
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={14} /> +880 1234 567890
                </li>
                <li className="flex items-center gap-2">
                  <MapPin size={14} /> Dhaka, Bangladesh
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex justify-between items-center flex-wrap gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 EduNest. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Facebook
                size={18}
                className="text-gray-400 hover:text-white cursor-pointer transition-colors"
              />
              <Twitter
                size={18}
                className="text-gray-400 hover:text-white cursor-pointer transition-colors"
              />
              <Linkedin
                size={18}
                className="text-gray-400 hover:text-white cursor-pointer transition-colors"
              />
              <GitHub
                size={18}
                className="text-gray-400 hover:text-white cursor-pointer transition-colors"
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
