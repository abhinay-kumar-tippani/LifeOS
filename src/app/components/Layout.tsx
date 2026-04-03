import { Outlet, Link, useLocation } from "react-router";
import { 
  LayoutGrid, 
  BookOpen, 
  Timer, 
  Kanban, 
  Grid3x3,
  User,
  Moon,
  Sun
} from "lucide-react";
import { format } from "date-fns";
import { PomodoroWidget } from "./PomodoroWidget";
import { useState, useEffect } from "react";

export function Layout() {
  const location = useLocation();
  const currentDate = format(new Date(), "EEEE, MMMM d, yyyy");
  
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark') || true; // default to dark based on previous code, but let's allow toggle
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const navItems = [
    { path: "/", icon: LayoutGrid, label: "Dashboard" },
    { path: "/journal", icon: BookOpen, label: "Journal" },
    { path: "/pomodoro", icon: Timer, label: "Pomodoro" },
    { path: "/kanban", icon: Kanban, label: "Kanban" },
    { path: "/matrix", icon: Grid3x3, label: "Matrix" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black text-neutral-900 dark:text-gray-100 transition-colors duration-300">
      {/* Collapsed Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-20 bg-white dark:bg-[#0a0a0a] border-r border-neutral-200 dark:border-white/10 flex flex-col items-center py-6 z-50 transition-colors duration-300">
        {/* Logo/Brand */}
        <div className="mb-8">
          <div className="w-10 h-10 rounded-xl bg-neutral-900 dark:bg-white flex items-center justify-center shadow-sm">
            <LayoutGrid className="w-5 h-5 text-white dark:text-black" />
          </div>
        </div>

        {/* Navigation Icons */}
        <nav className="flex-1 flex flex-col gap-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  group relative w-12 h-12 rounded-xl flex items-center justify-center
                  transition-all duration-200
                  ${active 
                    ? "bg-neutral-100 dark:bg-white/10 text-neutral-900 dark:text-white font-medium" 
                    : "text-neutral-400 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-gray-200 hover:bg-neutral-50 dark:hover:bg-white/5"
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${active ? "animate-in fade-in zoom-in duration-200" : ""}`} />
                
                {/* Tooltip */}
                <div className="absolute left-full ml-4 px-3 py-2 bg-neutral-900 dark:bg-gray-800 text-white dark:text-gray-100 text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-lg">
                  {item.label}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-neutral-900 dark:border-r-gray-800" />
                </div>

                {/* Active Indicator */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-neutral-900 dark:bg-white rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="w-12 h-12 mb-4 rounded-xl flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Profile Icon */}
        <button className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center overflow-hidden hover:scale-105 transition-transform duration-200 border border-neutral-300 dark:border-neutral-700">
          <User className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="ml-20">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-neutral-200 dark:border-white/10 transition-colors duration-300">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900 dark:text-gray-100 tracking-tight">
                Good evening, Developer
              </h1>
              <p className="text-sm text-neutral-500 dark:text-gray-400 mt-1">{currentDate}</p>
            </div>

            {/* Pomodoro Widget */}
            <PomodoroWidget />
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
