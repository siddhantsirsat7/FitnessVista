import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: string;
};

const mainNavItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "ri-dashboard-line" },
  { href: "/workouts", label: "Workouts", icon: "ri-run-line" },
  { href: "/measurements", label: "Measurements", icon: "ri-ruler-line" },
  { href: "/goals", label: "Goals", icon: "ri-flag-line" },
];

const toolsNavItems: NavItem[] = [
  { href: "/nutrition", label: "Nutrition", icon: "ri-restaurant-line" },
  { href: "/reports", label: "Reports", icon: "ri-bar-chart-line" },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="bg-white shadow-md w-full md:w-64 md:flex-shrink-0 md:h-screen md:overflow-y-auto border-r border-gray-200 z-20">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="rounded-md bg-primary p-1.5">
            <i className="ri-pulse-line text-white text-xl"></i>
          </div>
          <h1 className="text-xl font-bold text-gray-800">FitTrack</h1>
        </div>
        <p className="text-xs text-gray-500 mt-1">Your fitness journey companion</p>
      </div>
      
      <nav className="pt-4 pb-2">
        <div className="px-4 pb-2">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Main</p>
        </div>
        
        <ul>
          {mainNavItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <a className={cn(
                  "flex items-center px-4 py-3 transition duration-150",
                  location === item.href
                    ? "text-primary bg-primary/10 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                )}>
                  <i className={cn(item.icon, "mr-3 text-lg")}></i>
                  <span>{item.label}</span>
                </a>
              </Link>
            </li>
          ))}
        </ul>
        
        <div className="px-4 pt-4 pb-2">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Tools</p>
        </div>
        
        <ul>
          {toolsNavItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <a className={cn(
                  "flex items-center px-4 py-3 transition duration-150",
                  location === item.href
                    ? "text-primary bg-primary/10 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                )}>
                  <i className={cn(item.icon, "mr-3 text-lg")}></i>
                  <span>{item.label}</span>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="px-4 mt-auto border-t border-gray-200 py-4">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
            <i className="ri-user-line text-gray-600"></i>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-800">Alex Johnson</p>
            <p className="text-xs text-gray-500">View Profile</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
