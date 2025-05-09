
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useExam } from "../../contexts/ExamContext";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookCheck, Clock, Calendar } from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAuth();
  const { exams, results, getStudentResults } = useExam();
  
  // Get results for the current student
  const studentResults = user ? getStudentResults(user.id) : [];
  
  // Filter out exams that the student has already completed
  const completedExamIds = studentResults.map((result) => result.examId);
  const availableExams = exams.filter(
    (exam) => !completedExamIds.includes(exam.id)
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Exams</CardTitle>
              <BookCheck className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableExams.length}</div>
              <p className="text-xs text-muted-foreground">
                Ready to take
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Exams</CardTitle>
              <Clock className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentResults.length}</div>
              <p className="text-xs text-muted-foreground">
                Exams completed
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Calendar className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {studentResults.length > 0
                  ? (
                      studentResults.reduce(
                        (acc, result) => acc + (result.score / result.maxScore) * 100,
                        0
                      ) / studentResults.length
                    ).toFixed(1) + "%"
                  : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                Overall performance
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Available Exams */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Available Exams</h2>
          
          {availableExams.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed">
              <BookCheck className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Available Exams</h3>
              <p className="text-gray-500">
                You have completed all assigned exams
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableExams.map((exam) => (
                <Card key={exam.id} className="card-hover">
                  <CardHeader>
                    <CardTitle>{exam.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {exam.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-1 text-gray-500" />
                      <span>Time limit: {exam.timeLimit} mins</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link to={`/student/exam/${exam.id}`}>Start Exam</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Recent Results */}
        {studentResults.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Recent Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {studentResults.slice(0, 3).map((result) => {
                const exam = exams.find((e) => e.id === result.examId);
                if (!exam) return null;
                
                return (
                  <Card key={result.id}>
                    <CardHeader>
                      <CardTitle>{exam.title}</CardTitle>
                      <CardDescription>
                        Completed on {new Date(result.completedAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-1">
                          {((result.score / result.maxScore) * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-500">
                          Score: {result.score}/{result.maxScore}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" asChild>
                        <Link to="/student/results">View All Results</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
