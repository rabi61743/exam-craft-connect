
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useExam } from "../../contexts/ExamContext";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookCheck, Clock, Users, Plus, Calendar } from "lucide-react";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { exams, getTeacherExams, getExamResults } = useExam();
  
  const teacherExams = user ? getTeacherExams(user.id) : [];
  
  // Get count of students who took each exam
  const getStudentCount = (examId: string) => {
    const results = getExamResults(examId);
    return results.length;
  };
  
  const totalStudents = teacherExams.reduce(
    (acc, exam) => acc + getStudentCount(exam.id),
    0
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
          <Button asChild>
            <Link to="/teacher/exam/create" className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Create New Exam
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
              <BookCheck className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teacherExams.length}</div>
              <p className="text-xs text-muted-foreground">
                Created exams
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                Students who took your exams
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Latest Activity</CardTitle>
              <Calendar className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Today</div>
              <p className="text-xs text-muted-foreground">
                Last login
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Exams */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Your Exams</h2>
          
          {teacherExams.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed">
              <BookCheck className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Exams Created Yet</h3>
              <p className="text-gray-500 mb-4">Create your first exam to get started</p>
              <Button asChild>
                <Link to="/teacher/exam/create">Create Exam</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teacherExams.map((exam) => (
                <Card key={exam.id} className="card-hover">
                  <CardHeader>
                    <CardTitle>{exam.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {exam.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-500" />
                        <span>{exam.timeLimit} mins</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-gray-500" />
                        <span>{getStudentCount(exam.id)} students</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to={`/teacher/exam/${exam.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              <Card className="border-dashed bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-gray-600">Create New Exam</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center py-8">
                  <Button variant="outline" size="lg" className="h-16 w-16 rounded-full" asChild>
                    <Link to="/teacher/exam/create">
                      <Plus className="h-6 w-6" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
