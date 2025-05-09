const Result = require('../models/Result');
const Exam = require('../models/Exam');
const User = require('../models/User');

// Submit exam results
exports.submitExam = async (req, res) => {
  try {
    // Only students can submit exams
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { examId, answers, timeTaken } = req.body;

    // Get the exam to check answers
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Get student info
    const student = await User.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Calculate score
    let score = 0;
    for (let i = 0; i < answers.length; i++) {
      if (i < exam.questions.length && answers[i] === exam.questions[i].correctAnswer) {
        score++;
      }
    }

    const newResult = new Result({
      examId,
      studentId: req.user.id,
      studentName: student.name,
      score,
      maxScore: exam.questions.length,
      timeTaken,
      answers
    });

    const result = await newResult.save();
    res.json(result);
  } catch (error) {
    console.error('Submit exam error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get results for a specific student
exports.getStudentResults = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    
    // Students can only see their own results
    // Teachers can see any student's results
    if (req.user.role === 'student' && req.user.id !== studentId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const results = await Result.find({ studentId }).sort({ completedAt: -1 });
    res.json(results);
  } catch (error) {
    console.error('Get student results error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get results for a specific exam
exports.getExamResults = async (req, res) => {
  try {
    // Only teachers can see exam results
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const examId = req.params.examId;
    
    // Check if the exam belongs to this teacher
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    
    if (exam.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const results = await Result.find({ examId }).sort({ score: -1 });
    res.json(results);
  } catch (error) {
    console.error('Get exam results error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
