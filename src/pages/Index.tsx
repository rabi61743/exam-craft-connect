
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layouts/MainLayout";
import { BookCheck, User, Check } from "lucide-react";

export default function Landing() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate(user?.role === "teacher" ? "/teacher/dashboard" : "/student/dashboard");
    } else {
      navigate("/register");
    }
  };

  const features = [
    {
      title: "For Teachers",
      description: "Create and manage exams, review student performance, and provide detailed feedback.",
      items: [
        "Create custom exams with multiple question types",
        "Set time limits and access controls",
        "Analyze student performance with detailed reports",
        "Provide automated or manual feedback on submissions",
      ],
    },
    {
      title: "For Students",
      description: "Take exams, track your progress, and review feedback to improve your learning.",
      items: [
        "Access all assigned exams in one place",
        "Take exams with a user-friendly interface",
        "Review your answers and see detailed explanations",
        "Track your progress and performance over time",
      ],
    },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative">
        <div className="exam-gradient-bg absolute inset-0 h-[500px]" />
        <div className="relative container mx-auto px-4 pt-16 pb-24 md:pt-24 md:pb-32 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Online Exam Platform for Teachers and Students
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Create, manage, and take exams easily with our comprehensive platform designed for educational excellence.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-exam-blue hover:bg-white/90"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Designed for Both Teachers and Students</h2>
          
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 shadow-sm card-hover">
                <div className="flex items-center mb-4">
                  {index === 0 ? (
                    <BookCheck className="w-8 h-8 text-exam-blue" />
                  ) : (
                    <User className="w-8 h-8 text-exam-purple" />
                  )}
                  <h3 className="text-xl font-semibold ml-3">{feature.title}</h3>
                </div>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <ul className="space-y-3">
                  {feature.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Education?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Join thousands of educators and students who are already using ExamCraft Connect
            to improve teaching and learning outcomes.
          </p>
          <Button size="lg" onClick={handleGetStarted}>
            Start for Free
          </Button>
        </div>
      </section>
    </MainLayout>
  );
}
