
import React, { createContext, useState, useContext, ReactNode } from "react";
import { toast } from "sonner";

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  timeLimit?: number; // in minutes
  questions: Question[];
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  score: number;
  maxScore: number;
  timeTaken?: number; // in seconds
  answers: number[]; // index of selected answers
  completedAt: Date;
}

interface ExamContextType {
  exams: Exam[];
  results: ExamResult[];
  createExam: (exam: Omit<Exam, "id">) => void;
  getExam: (id: string) => Exam | undefined;
  submitExam: (result: Omit<ExamResult, "id" | "completedAt">) => void;
  getStudentResults: (studentId: string) => ExamResult[];
  getTeacherExams: (teacherId: string) => Exam[];
  getExamResults: (examId: string) => ExamResult[];
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

// Mock exam data
const MOCK_EXAMS: Exam[] = [
  {
    id: "1",
    title: "Introduction to Mathematics",
    description: "Basic arithmetic and algebra concepts",
    createdBy: "1", // Teacher ID
    timeLimit: 30,
    questions: [
      {
        id: "q1",
        text: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        correctAnswer: 1, // index of the correct answer
        explanation: "2 + 2 equals 4"
      },
      {
        id: "q2",
        text: "Solve for x: 3x + 5 = 14",
        options: ["x = 3", "x = 2", "x = 4", "x = 5"],
        correctAnswer: 0,
        explanation: "3x + 5 = 14, 3x = 9, x = 3"
      },
    ],
  },
  {
    id: "2",
    title: "Basic Science Test",
    description: "Fundamentals of physics and chemistry",
    createdBy: "1",
    timeLimit: 45,
    questions: [
      {
        id: "q1",
        text: "What is the chemical formula for water?",
        options: ["CO2", "H2O", "O2", "N2"],
        correctAnswer: 1,
        explanation: "Water is composed of two hydrogen atoms and one oxygen atom"
      },
    ],
  },
];

// Mock results
const MOCK_RESULTS: ExamResult[] = [
  {
    id: "r1",
    examId: "1",
    studentId: "2",
    studentName: "Student Demo",
    score: 2,
    maxScore: 2,
    timeTaken: 600,
    answers: [1, 0],
    completedAt: new Date("2023-05-01"),
  },
];

interface ExamProviderProps {
  children: ReactNode;
}

export function ExamProvider({ children }: ExamProviderProps) {
  const [exams, setExams] = useState<Exam[]>(MOCK_EXAMS);
  const [results, setResults] = useState<ExamResult[]>(MOCK_RESULTS);

  const createExam = (exam: Omit<Exam, "id">) => {
    const newExam = {
      ...exam,
      id: Math.random().toString(36).substr(2, 9),
    };
    setExams([...exams, newExam]);
    toast.success("Exam created successfully!");
  };

  const getExam = (id: string) => {
    return exams.find((exam) => exam.id === id);
  };

  const submitExam = (result: Omit<ExamResult, "id" | "completedAt">) => {
    const newResult = {
      ...result,
      id: Math.random().toString(36).substr(2, 9),
      completedAt: new Date(),
    };
    setResults([...results, newResult]);
    toast.success("Exam submitted successfully!");
  };

  const getStudentResults = (studentId: string) => {
    return results.filter((result) => result.studentId === studentId);
  };

  const getTeacherExams = (teacherId: string) => {
    return exams.filter((exam) => exam.createdBy === teacherId);
  };

  const getExamResults = (examId: string) => {
    return results.filter((result) => result.examId === examId);
  };

  return (
    <ExamContext.Provider
      value={{
        exams,
        results,
        createExam,
        getExam,
        submitExam,
        getStudentResults,
        getTeacherExams,
        getExamResults,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
}

export function useExam() {
  const context = useContext(ExamContext);
  if (context === undefined) {
    throw new Error("useExam must be used within an ExamProvider");
  }
  return context;
}
