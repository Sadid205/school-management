"use client";

import Sidebar from "@/components/dashboard/sidebar";
import Topbar from "@/components/dashboard/topbar";
// import { selectIsAuthenticated } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  // const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const router = useRouter();

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push("/login");
  //   }
  // }, [isAuthenticated, router]);

  // Close mobile sidebar when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle functions - using useCallback to prevent unnecessary re-renders
  const toggleMobileSidebar = useCallback(() => {
    console.log("Toggling mobile sidebar:", !mobileSidebarOpen); // Debug log
    setMobileSidebarOpen((prev) => !prev);
  }, [mobileSidebarOpen]);

  const closeMobileSidebar = useCallback(() => {
    console.log("Closing mobile sidebar"); // Debug log
    setMobileSidebarOpen(false);
  }, []);

  // if (!isAuthenticated) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <div className="text-center">
  //         <div className="text-gray-500">Loading...</div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Topbar */}
      <Topbar
        onMenuClick={toggleMobileSidebar}
        sidebarCollapsed={sidebarCollapsed}
      />

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block shrink-0">
          <Sidebar
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
            isMobile={false}
            isOpen={true}
            onClose={() => {}}
          />
        </div>

        {/* Mobile Sidebar */}
        {mobileSidebarOpen && (
          <Sidebar
            collapsed={false}
            setCollapsed={() => {}}
            isMobile={true}
            isOpen={mobileSidebarOpen}
            onClose={closeMobileSidebar}
          />
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
