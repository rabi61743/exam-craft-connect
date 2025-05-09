
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ExamProvider } from "./contexts/ExamContext";
import { useAuth } from "./contexts/AuthContext";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import TeacherDashboard from "./pages/teacher/Dashboard";
import StudentDashboard from "./pages/student/Dashboard";
import ExamCreation from "./pages/teacher/ExamCreation";
import ExamView from "./pages/teacher/ExamView";
import TakeExam from "./pages/student/TakeExam";
import ExamResults from "./pages/student/ExamResults";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Index";

const queryClient = new QueryClient();

// Route protection component
const ProtectedRoute = ({ children, requiredRole }: { children: JSX.Element, requiredRole?: string }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" />;
  }
  
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ExamProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Teacher Routes */}
              <Route 
                path="/teacher/dashboard" 
                element={
                  <ProtectedRoute requiredRole="teacher">
                    <TeacherDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/teacher/exam/create" 
                element={
                  <ProtectedRoute requiredRole="teacher">
                    <ExamCreation />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/teacher/exam/:examId" 
                element={
                  <ProtectedRoute requiredRole="teacher">
                    <ExamView />
                  </ProtectedRoute>
                } 
              />
              
              {/* Student Routes */}
              <Route 
                path="/student/dashboard" 
                element={
                  <ProtectedRoute requiredRole="student">
                    <StudentDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/student/exam/:examId" 
                element={
                  <ProtectedRoute requiredRole="student">
                    <TakeExam />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/student/results" 
                element={
                  <ProtectedRoute requiredRole="student">
                    <ExamResults />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ExamProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
