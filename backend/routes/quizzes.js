import express from 'express';
import { protect } from '../middleware/auth.js';
import Quiz from '../models/Quiz.js';
import UserProgress from '../models/UserProgress.js';

const router = express.Router();

// @desc    Get all quizzes
// @route   GET /api/quizzes
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, page = 1, limit = 10 } = req.query;
    
    let query = { isActive: true };
    
    if (category) {
      query.category = category;
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    const quizzes = await Quiz.find(query)
      .select('title difficulty category questions timeLimit passingScore')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Quiz.countDocuments(query);

    res.json({
      quizzes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get user's quiz progress/results
// @route   GET /api/quizzes/my-results
// @access  Private
router.get('/my-results', protect, async (req, res) => {
  try {
    const results = await UserProgress.find({
      userId: req.user._id,
      quizId: { $exists: true }
    }).populate('quizId', 'title difficulty category');

    const formattedResults = results.map(result => ({
      quizId: result.quizId._id,
      title: result.quizId.title,
      difficulty: result.quizId.difficulty,
      category: result.quizId.category,
      score: result.score,
      completed: result.completed,
      completedAt: result.completedAt
    }));

    res.json({ results: formattedResults });
  } catch (error) {
    console.error('Get user quiz results error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get single quiz
// @route   GET /api/quizzes/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Don't send correct answers initially
    const quizWithoutAnswers = {
      ...quiz.toObject(),
      questions: quiz.questions.map(q => ({
        text: q.text,
        options: q.options
      }))
    };

    res.json(quizWithoutAnswers);
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Submit quiz answers
// @route   POST /api/quizzes/:id/submit
// @access  Private
router.post('/:id/submit', protect, async (req, res) => {
  try {
    const { answers } = req.body; // Array of { questionIndex, selectedOption }
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Validate answers array
    if (!answers || !Array.isArray(answers) || answers.length !== quiz.questions.length) {
      return res.status(400).json({ message: 'Invalid answers format' });
    }

    // Calculate score
    let correctCount = 0;
    const detailedAnswers = answers.map(answer => {
      const question = quiz.questions[answer.questionIndex];
      const isCorrect = answer.selectedOption === question.correctIndex;
      if (isCorrect) correctCount++;
      
      return {
        questionIndex: answer.questionIndex,
        selectedOption: answer.selectedOption,
        correctIndex: question.correctIndex,
        isCorrect
      };
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    // Calculate XP based on performance
    let xpEarned = 0;
    if (passed) {
      // Base XP for passing
      xpEarned = correctCount * 10;
      
      // Bonus XP for difficulty
      const difficultyMultiplier = {
        'Easy': 1,
        'Medium': 1.5,
        'Hard': 2
      };
      xpEarned = Math.round(xpEarned * (difficultyMultiplier[quiz.difficulty] || 1));
      
      // Perfect score bonus
      if (score === 100) {
        xpEarned += 50;
      }
    }

    // Update user XP and level with modulo system
    const user = req.user;
    const currentXP = user.profile.xp || 0;
    const currentLevel = user.profile.level || 1;
    const totalXP = currentXP + xpEarned;
    
    // Calculate level progression
    let newLevel = currentLevel;
    let finalXP = totalXP;
    let leveledUp = false;
    
    if (totalXP >= 1000) {
      // Calculate how many levels to increase
      const levelsToIncrease = Math.floor(totalXP / 1000);
      newLevel = currentLevel + levelsToIncrease;
      finalXP = totalXP % 1000; // Remaining XP after level ups
      leveledUp = levelsToIncrease > 0;
    }
    
    // Update user profile
    user.profile.xp = finalXP;
    user.profile.level = newLevel;
    
    await user.save();

    // Check if user has already completed this quiz
    const existingProgress = await UserProgress.findOne({
      userId: req.user._id,
      quizId: quiz._id
    });

    if (existingProgress) {
      // Update existing progress if new score is better
      if (score > existingProgress.score) {
        existingProgress.score = score;
        existingProgress.answers = detailedAnswers;
        existingProgress.completedAt = new Date();
        await existingProgress.save();
      }
    } else {
      // Save new progress
      const userProgress = new UserProgress({
        userId: req.user._id,
        quizId: quiz._id,
        score,
        completed: true,
        answers: detailedAnswers,
        completedAt: new Date()
      });
      await userProgress.save();
    }

    res.json({
      score,
      totalQuestions: quiz.questions.length,
      correctAnswers: correctCount,
      passed,
      xpEarned,
      leveledUp,
      newLevel,
      totalXP: totalXP,
      currentXP: user.profile.xp,
      detailedAnswers
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get quiz results
// @route   GET /api/quizzes/results/:id
// @access  Private
router.get('/results/:id', protect, async (req, res) => {
  try {
    const progress = await UserProgress.findOne({
      userId: req.user._id,
      quizId: req.params.id
    }).populate('quizId', 'title difficulty category questions');

    if (!progress) {
      return res.status(404).json({ message: 'Quiz results not found' });
    }

    res.json(progress);
  } catch (error) {
    console.error('Get quiz results error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;