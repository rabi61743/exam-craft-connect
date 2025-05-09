
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useExam } from "../../contexts/ExamContext";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function TakeExam() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getExam, submitExam } = useExam();
  
  const exam = examId ? getExam(examId) : undefined;
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(exam?.timeLimit ? exam.timeLimit * 60 : 0);
  const [startTime] = useState(Date.now());
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  
  useEffect(() => {
    // Initialize selected answers array with -1 (no selection)
    if (exam) {
      setSelectedAnswers(Array(exam.questions.length).fill(-1));
    }
  }, [exam]);
  
  useEffect(() => {
    if (!exam?.timeLimit) return;
    
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [exam]);
  
  const handleTimeUp = () => {
    toast.warning("Time's up! Submitting your exam...");
    handleSubmitExam();
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  
  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < (exam?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitExam = () => {
    if (!exam || !user) return;
    
    // Calculate score
    let score = 0;
    exam.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        score++;
      }
    });
    
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    
    submitExam({
      examId: exam.id,
      studentId: user.id,
      studentName: user.name,
      score,
      maxScore: exam.questions.length,
      timeTaken,
      answers: selectedAnswers,
    });
    
    navigate("/student/results");
  };
  
  const numberOfUnanswered = selectedAnswers.filter((a) => a === -1).length;
  
  if (!exam) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Exam not found</h2>
          <p className="text-gray-500 mb-6">The exam you are looking for does not exist or has been removed.</p>
          <Button onClick={() => navigate("/student/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / exam.questions.length) * 100;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Exam header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{exam.title}</h1>
          <p className="text-gray-500 mb-2">{exam.description}</p>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-b py-4 my-4">
            <div className="flex items-center">
              <span className="text-sm mr-5">
                Question {currentQuestionIndex + 1} of {exam.questions.length}
              </span>
              <Progress value={progress} className="w-32" />
            </div>
            
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              Time remaining: <span className="font-medium ml-1">{formatTime(timeRemaining)}</span>
            </div>
          </div>
        </div>
        
        {/* Question */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              {currentQuestion.text}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`border rounded-md p-3 cursor-pointer transition-colors ${
                    selectedAnswers[currentQuestionIndex] === index
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  {option}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <Button
              variant="outline"
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            {currentQuestionIndex < exam.questions.length - 1 ? (
              <Button
                onClick={handleNextQuestion}
                className="flex items-center"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={() => setShowSubmitDialog(true)}
                className="flex items-center"
              >
                Submit Exam
              </Button>
            )}
          </CardFooter>
        </Card>
        
        {/* Question navigation */}
        <div className="mt-6 py-4 border-t">
          <h3 className="text-sm font-medium mb-3">Question Navigator</h3>
          <div className="flex flex-wrap gap-2">
            {exam.questions.map((_, index) => (
              <button
                key={index}
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
                  currentQuestionIndex === index
                    ? "bg-exam-blue text-white"
                    : selectedAnswers[index] !== -1
                    ? "bg-gray-200"
                    : "bg-gray-100 text-gray-500"
                }`}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button
            onClick={() => setShowSubmitDialog(true)}
            className="flex items-center"
          >
            Submit Exam
          </Button>
        </div>
      
        <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
              <AlertDialogDescription>
                {numberOfUnanswered > 0 ? (
                  <div className="flex items-center text-amber-600 mb-2">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span>You have {numberOfUnanswered} unanswered questions.</span>
                  </div>
                ) : (
                  "You have answered all questions."
                )}
                Are you sure you want to submit your exam? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmitExam}>
                Submit Exam
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
