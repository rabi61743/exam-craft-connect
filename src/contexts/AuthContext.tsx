
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { toast } from "sonner";

type UserRole = "teacher" | "student" | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => void;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data - in a real app this would come from a database
const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Teacher Demo",
    email: "teacher@example.com",
    role: "teacher",
  },
  {
    id: "2",
    name: "Student Demo",
    email: "student@example.com",
    role: "student",
  }
];

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("examUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, password: string, role: UserRole) => {
    // Simple authentication for demo
    const foundUser = MOCK_USERS.find(
      (u) => u.email === email && u.role === role
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("examUser", JSON.stringify(foundUser));
      toast.success(`Welcome back, ${foundUser.name}!`);
      return true;
    } else {
      toast.error("Invalid credentials or role");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("examUser");
    toast.info("You have been logged out");
  };

  const register = (name: string, email: string, password: string, role: UserRole) => {
    // In a real app, you would register the user in a database
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role,
    };

    setUser(newUser);
    localStorage.setItem("examUser", JSON.stringify(newUser));
    toast.success(`Welcome, ${name}!`);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
