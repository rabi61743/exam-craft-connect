const Exam = require('../models/Exam');

// Create a new exam
exports.createExam = async (req, res) => {
  try {
    // Only teachers can create exams
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, description, timeLimit, questions } = req.body;

    const newExam = new Exam({
      title,
      description,
      createdBy: req.user.id,
      timeLimit,
      questions
    });

    const exam = await newExam.save();
    res.json(exam);
  } catch (error) {
    console.error('Create exam error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all exams (for students)
exports.getExams = async (req, res) => {
  try {
    // Only return basic exam info for students to see available exams
    const exams = await Exam.find().select('title description createdBy timeLimit');
    res.json(exams);
  } catch (error) {
    console.error('Get exams error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get exam by ID
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // If student is accessing, don't include correct answers
    if (req.user.role === 'student') {
      const examForStudent = {
        ...exam.toObject(),
        questions: exam.questions.map(question => ({
          ...question.toObject(),
          correctAnswer: undefined
        }))
      };
      return res.json(examForStudent);
    }

    // If teacher is accessing, include all details
    res.json(exam);
  } catch (error) {
    console.error('Get exam error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get exams created by a teacher
exports.getTeacherExams = async (req, res) => {
  try {
    // Verify if the requested teacherId matches the authenticated user
    if (req.user.role !== 'teacher' || req.user.id !== req.params.teacherId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const exams = await Exam.find({ createdBy: req.params.teacherId });
    res.json(exams);
  } catch (error) {
    console.error('Get teacher exams error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
