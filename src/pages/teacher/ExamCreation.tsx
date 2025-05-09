
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useExam, Question } from "../../contexts/ExamContext";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, Save, Clock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function ExamCreation() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createExam } = useExam();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState(30);
  const [questions, setQuestions] = useState<Omit<Question, "id">[]>([
    {
      text: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
    },
  ]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: "",
      },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    } else {
      toast.error("You must have at least one question");
    }
  };

  const handleQuestionChange = (
    index: number,
    field: keyof Omit<Question, "id">,
    value: string | number | string[]
  ) => {
    const newQuestions = [...questions];
    if (field === "options") {
      // Type assertion as we know this is handled only for options field
      newQuestions[index][field] = value as string[];
    } else if (field === "correctAnswer") {
      newQuestions[index][field] = value as number;
    } else {
      // For text and explanation fields
      newQuestions[index][field] = value as string;
    }
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Please enter an exam title");
      return;
    }
    
    if (questions.some(q => !q.text.trim())) {
      toast.error("All questions must have text");
      return;
    }
    
    if (questions.some(q => q.options.some(o => !o.trim()))) {
      toast.error("All options must have text");
      return;
    }

    // Add IDs to the questions
    const questionsWithIds = questions.map((q) => ({
      ...q,
      id: Math.random().toString(36).substring(2, 9),
    }));

    createExam({
      title,
      description,
      createdBy: user?.id || "",
      timeLimit,
      questions: questionsWithIds,
    });

    navigate("/teacher/dashboard");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button type="button" onClick={handleSubmit} className="flex items-center">
            <Save className="h-4 w-4 mr-2" />
            Save Exam
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Exam Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Exam Title *
                  </label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter exam title"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter exam description"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700 mb-1">
                    Time Limit (minutes)
                  </label>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    <Input
                      id="timeLimit"
                      type="number"
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(Number(e.target.value))}
                      min={1}
                      className="w-32"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Questions</h2>
              <Button onClick={handleAddQuestion} className="flex items-center" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>

            {questions.map((question, qIndex) => (
              <Card key={qIndex}>
                <CardHeader className="flex flex-row items-start justify-between">
                  <CardTitle className="text-base">Question {qIndex + 1}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveQuestion(qIndex)}
                    disabled={questions.length <= 1}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question Text *
                    </label>
                    <Textarea
                      value={question.text}
                      onChange={(e) =>
                        handleQuestionChange(qIndex, "text", e.target.value)
                      }
                      placeholder="Enter question text"
                      rows={2}
                      required
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Options *
                    </label>
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center space-x-2">
                        <div className="flex-shrink-0">
                          <input
                            type="radio"
                            checked={question.correctAnswer === oIndex}
                            onChange={() =>
                              handleQuestionChange(qIndex, "correctAnswer", oIndex)
                            }
                            className="h-4 w-4 text-exam-blue"
                            id={`question-${qIndex}-option-${oIndex}`}
                          />
                        </div>
                        <Input
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(qIndex, oIndex, e.target.value)
                          }
                          placeholder={`Option ${oIndex + 1}`}
                          className="flex-1"
                          id={`question-${qIndex}-option-${oIndex}-text`}
                          required
                        />
                      </div>
                    ))}
                    <div className="text-xs text-gray-500">
                      Select the radio button next to the correct answer
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Explanation (Optional)
                    </label>
                    <Textarea
                      value={question.explanation || ""}
                      onChange={(e) =>
                        handleQuestionChange(qIndex, "explanation", e.target.value)
                      }
                      placeholder="Explain why the correct answer is right (students will see this after completing the exam)"
                      rows={2}
                    />
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-3 bg-gray-50">
                  <div className="text-xs text-gray-500">
                    * Required fields
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit}>
              Save Exam
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
