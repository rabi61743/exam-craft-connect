
import { useAuth } from "../../contexts/AuthContext";
import { useExam } from "../../contexts/ExamContext";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";

export default function ExamResults() {
  const { user } = useAuth();
  const { exams, getStudentResults } = useExam();
  
  const results = user ? getStudentResults(user.id) : [];
  
  // Sort results by completion date (newest first)
  const sortedResults = [...results].sort((a, b) => {
    return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
  });
  
  const getExamById = (id: string) => {
    return exams.find((exam) => exam.id === id);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Your Exam Results</h1>
        
        {results.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
            <h2 className="text-lg font-medium text-gray-900 mb-2">No Results Yet</h2>
            <p className="text-gray-500">
              You haven't completed any exams yet. Take an exam to see your results here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedResults.map((result) => {
              const exam = getExamById(result.examId);
              if (!exam) return null;
              
              const percentage = (result.score / result.maxScore) * 100;
              let gradeColor = "text-red-500";
              
              if (percentage >= 90) {
                gradeColor = "text-green-600";
              } else if (percentage >= 70) {
                gradeColor = "text-blue-600";
              } else if (percentage >= 60) {
                gradeColor = "text-amber-600";
              }
              
              return (
                <Card key={result.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <CardTitle>{exam.title}</CardTitle>
                      <div className="text-sm text-gray-500">
                        Completed on {new Date(result.completedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">Score</div>
                        <div className="text-2xl font-bold">
                          {result.score}/{result.maxScore}
                        </div>
                      </div>
                      
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">Percentage</div>
                        <div className={`text-2xl font-bold ${gradeColor}`}>
                          {percentage.toFixed(1)}%
                        </div>
                      </div>
                      
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">Time Taken</div>
                        <div className="text-2xl font-bold">
                          {result.timeTaken
                            ? `${Math.floor(result.timeTaken / 60)}m ${result.timeTaken % 60}s`
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="font-medium text-lg mb-4">Questions & Answers</h3>
                    
                    <div className="space-y-4">
                      {exam.questions.map((question, qIndex) => {
                        const selectedAnswer = result.answers[qIndex];
                        const isCorrect = selectedAnswer === question.correctAnswer;
                        
                        return (
                          <div key={question.id} className="border rounded-md overflow-hidden">
                            <div className="p-4 bg-gray-50 border-b">
                              <div className="flex items-start">
                                <span className="text-gray-600 font-medium mr-2">
                                  {qIndex + 1}.
                                </span>
                                <span>{question.text}</span>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="space-y-2">
                                {question.options.map((option, oIndex) => (
                                  <div
                                    key={oIndex}
                                    className={`p-3 rounded-md ${
                                      oIndex === question.correctAnswer
                                        ? "bg-green-50 border border-green-200"
                                        : oIndex === selectedAnswer && selectedAnswer !== question.correctAnswer
                                        ? "bg-red-50 border border-red-200"
                                        : "bg-gray-50 border border-gray-200"
                                    }`}
                                  >
                                    <div className="flex items-start">
                                      {oIndex === question.correctAnswer ? (
                                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                                      ) : oIndex === selectedAnswer && selectedAnswer !== question.correctAnswer ? (
                                        <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                                      ) : (
                                        <div className="w-5 mr-2" />
                                      )}
                                      <span>{option}</span>
                                      
                                      {oIndex === selectedAnswer && (
                                        <span className="ml-2 text-xs font-medium">
                                          (Your answer)
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              
                              {question.explanation && (
                                <div className="mt-3 pt-3 border-t">
                                  <div className="text-sm font-medium text-gray-700 mb-1">
                                    Explanation:
                                  </div>
                                  <div className="text-gray-600">{question.explanation}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
