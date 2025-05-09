
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Book, BookCheck, Search, LogOut, Menu, X, User, Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const teacherNavItems = [
    { name: "Dashboard", href: "/teacher/dashboard", icon: <Book className="h-5 w-5" /> },
    { name: "Create Exam", href: "/teacher/exam/create", icon: <BookCheck className="h-5 w-5" /> },
  ];

  const studentNavItems = [
    { name: "Dashboard", href: "/student/dashboard", icon: <Book className="h-5 w-5" /> },
    { name: "Results", href: "/student/results", icon: <Calendar className="h-5 w-5" /> },
  ];

  const navItems = user?.role === "teacher" ? teacherNavItems : studentNavItems;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r">
        <div className="p-4 border-b">
          <Link to="/" className="flex items-center space-x-2">
            <Book className="h-6 w-6 text-exam-blue" />
            <span className="font-bold text-lg text-exam-dark">ExamCraft</span>
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-exam-blue transition-colors"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-exam-blue rounded-full p-2 text-white">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-gray-800">{user?.name}</p>
              <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            className="w-full flex items-center justify-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </Button>
        </div>
      </aside>

      {/* Mobile menu */}
      <div className={cn(
        "fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden transition-opacity duration-200",
        mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white">
          <div className="p-4 border-b flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Book className="h-6 w-6 text-exam-blue" />
              <span className="font-bold text-lg text-exam-dark">ExamCraft</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-exam-blue transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-exam-blue rounded-full p-2 text-white">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-gray-800">{user?.name}</p>
                <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="w-full flex items-center justify-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="bg-white border-b md:py-3 md:px-6 py-2 px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="text-gray-500 md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">{user?.role === "teacher" ? "Teacher" : "Student"} Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100">
              <Search className="h-5 w-5" />
            </button>
            <div className="md:hidden">
              <Button 
                onClick={handleLogout} 
                variant="ghost" 
                size="icon"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
