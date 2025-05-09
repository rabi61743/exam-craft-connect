
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Book, User, LogOut } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Book className="h-6 w-6 text-exam-blue" />
            <span className="font-bold text-xl text-exam-dark">ExamCraft Connect</span>
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>
                    {user?.name} ({user?.role})
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>&copy; 2025 ExamCraft Connect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
