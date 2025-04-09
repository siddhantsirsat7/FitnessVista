import { ReactNode, useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useLocation, Link } from "wouter";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getPageTitle = () => {
    switch (true) {
      case location === "/":
      case location === "/dashboard":
        return "Dashboard";
      case location === "/workouts":
        return "Workouts";
      case location === "/measurements":
        return "Measurements";
      case location === "/goals":
        return "Goals";
      case location === "/nutrition":
        return "Nutrition";
      case location === "/reports":
        return "Reports";
      default:
        return "FitTrack";
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Mobile sidebar toggle */}
      {isMobile && (
        <div className="fixed top-4 left-4 z-30">
          <Button
            variant="outline"
            size="icon"
            className="bg-white"
            onClick={toggleSidebar}
          >
            <i className="ri-menu-line text-xl"></i>
          </Button>
        </div>
      )}

      {/* Sidebar - hidden on mobile unless toggled */}
      <div
        className={`${
          isMobile
            ? `fixed inset-0 z-20 transform ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              } transition-transform duration-200 ease-in-out`
            : "relative"
        }`}
      >
        {sidebarOpen && isMobile && (
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={toggleSidebar}
          />
        )}
        <div className={`relative z-30 ${isMobile ? "w-64" : "w-full"}`}>
          <Sidebar />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-gray-50 pb-10">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-800">{getPageTitle()}</h1>
              <div className="flex items-center space-x-4">
                <button className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1">
                  <i className="ri-notification-3-line text-xl"></i>
                </button>
                <button className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1">
                  <i className="ri-settings-3-line text-xl"></i>
                </button>
                <Button className="hidden md:flex">
                  <i className="ri-add-line mr-1"></i> 
                  Track Activity
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        {children}
      </main>
    </div>
  );
}
