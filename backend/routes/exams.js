const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  createExam, 
  getExams, 
  getExamById, 
  getTeacherExams 
} = require('../controllers/examController');

// @route   POST api/exams
// @desc    Create a new exam
// @access  Private (teachers only)
router.post('/', auth, createExam);

// @route   GET api/exams
// @desc    Get all exams (for students)
// @access  Private
router.get('/', auth, getExams);

// @route   GET api/exams/:id
// @desc    Get exam by ID
// @access  Private
router.get('/:id', auth, getExamById);

// @route   GET api/exams/teacher/:teacherId
// @desc    Get exams created by a specific teacher
// @access  Private (teacher only)
router.get('/teacher/:teacherId', auth, getTeacherExams);

module.exports = router;
