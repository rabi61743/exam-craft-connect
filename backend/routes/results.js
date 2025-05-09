const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  submitExam, 
  getStudentResults, 
  getExamResults 
} = require('../controllers/resultController');

// @route   POST api/results
// @desc    Submit exam results
// @access  Private (students only)
router.post('/', auth, submitExam);

// @route   GET api/results/student/:studentId
// @desc    Get results for a specific student
// @access  Private (student's own results or teacher)
router.get('/student/:studentId', auth, getStudentResults);

// @route   GET api/results/exam/:examId
// @desc    Get results for a specific exam
// @access  Private (teacher only)
router.get('/exam/:examId', auth, getExamResults);

module.exports = router;
