
import { useParams, useNavigate } from "react-router-dom";
import { useExam } from "../../contexts/ExamContext";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Clock, Users, BookCheck } from "lucide-react";

export default function ExamView() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { getExam, getExamResults } = useExam();
  
  const exam = examId ? getExam(examId) : undefined;
  const results = examId ? getExamResults(examId) : [];
  
  if (!exam) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Exam not found</h2>
          <p className="text-gray-500 mb-6">The exam you are looking for does not exist or has been removed.</p>
          <Button onClick={() => navigate("/teacher/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate the average score
  const averageScore = results.length > 0
    ? results.reduce((acc, result) => acc + (result.score / result.maxScore) * 100, 0) / results.length
    : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <h1 className="text-2xl font-bold">{exam.title}</h1>
          <p className="text-gray-500">{exam.description}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Limit</CardTitle>
              <Clock className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{exam.timeLimit} mins</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students Completed</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{results.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <BookCheck className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {averageScore.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="questions">
          <TabsList>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="questions" className="space-y-4 mt-6">
            <h2 className="text-lg font-semibold">
              Questions ({exam.questions.length})
            </h2>
            
            {exam.questions.map((question, index) => (
              <Card key={question.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50">
                  <CardTitle className="text-base">
                    Question {index + 1}: {question.text}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Options:</h4>
                      <ul className="space-y-2">
                        {question.options.map((option, oIndex) => (
                          <li
                            key={oIndex}
                            className={`pl-6 py-1 border rounded-md ${
                              question.correctAnswer === oIndex
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200"
                            }`}
                          >
                            {option}
                            {question.correctAnswer === oIndex && (
                              <span className="ml-2 text-xs text-green-600 font-medium">
                                (Correct Answer)
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {question.explanation && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Explanation:</h4>
                        <p className="text-gray-600 bg-gray-50 p-3 rounded-md">{question.explanation}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="results" className="mt-6">
            <h2 className="text-lg font-semibold mb-4">
              Student Results ({results.length})
            </h2>
            
            {results.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed">
                <Users className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No Results Yet</h3>
                <p className="text-gray-500">
                  Students haven't taken this exam yet
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50 border-b">
                        <th className="py-3 px-4 text-left font-medium">Student</th>
                        <th className="py-3 px-4 text-left font-medium">Score</th>
                        <th className="py-3 px-4 text-left font-medium">Percentage</th>
                        <th className="py-3 px-4 text-left font-medium">Time Taken</th>
                        <th className="py-3 px-4 text-left font-medium">Completed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((result) => (
                        <tr key={result.id} className="border-b">
                          <td className="py-3 px-4">{result.studentName}</td>
                          <td className="py-3 px-4">
                            {result.score}/{result.maxScore}
                          </td>
                          <td className="py-3 px-4">
                            {((result.score / result.maxScore) * 100).toFixed(1)}%
                          </td>
                          <td className="py-3 px-4">
                            {result.timeTaken
                              ? `${Math.floor(result.timeTaken / 60)}m ${result.timeTaken % 60}s`
                              : "N/A"}
                          </td>
                          <td className="py-3 px-4">
                            {new Date(result.completedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
