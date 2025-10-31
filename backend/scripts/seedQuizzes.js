import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Quiz from '../models/Quiz.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const sampleQuizzes = [
  {
    title: 'JavaScript Fundamentals',
    difficulty: 'Easy',
    category: 'Programming',
    timeLimit: 15,
    passingScore: 70,
    questions: [
      {
        text: 'Which of the following is used to declare a variable in JavaScript?',
        options: ['var', 'let', 'const', 'All of the above'],
        correctIndex: 3,
        explanation: 'All three keywords (var, let, const) can be used to declare variables in JavaScript.'
      },
      {
        text: 'What is the correct way to write a JavaScript array?',
        options: ['var colors = "red", "green", "blue"', 'var colors = (1:"red", 2:"green", 3:"blue")', 'var colors = ["red", "green", "blue"]', 'var colors = 1 = ("red"), 2 = ("green"), 3 = ("blue")'],
        correctIndex: 2,
        explanation: 'JavaScript arrays are written with square brackets and comma-separated values.'
      },
      {
        text: 'How do you write "Hello World" in an alert box?',
        options: ['alertBox("Hello World");', 'msg("Hello World");', 'alert("Hello World");', 'msgBox("Hello World");'],
        correctIndex: 2,
        explanation: 'The alert() function is used to display an alert box with a message.'
      },
      {
        text: 'Which operator is used to assign a value to a variable?',
        options: ['*', '=', '-', 'x'],
        correctIndex: 1,
        explanation: 'The = operator is used for assignment in JavaScript.'
      },
      {
        text: 'What will the following code return: Boolean(10 > 9)',
        options: ['true', 'false', 'NaN', 'undefined'],
        correctIndex: 0,
        explanation: '10 > 9 evaluates to true, and Boolean(true) returns true.'
      }
    ]
  },
  {
    title: 'React Basics',
    difficulty: 'Medium',
    category: 'Frontend',
    timeLimit: 20,
    passingScore: 75,
    questions: [
      {
        text: 'What is JSX?',
        options: ['A JavaScript library', 'A syntax extension for JavaScript', 'A database', 'A CSS framework'],
        correctIndex: 1,
        explanation: 'JSX is a syntax extension for JavaScript that allows you to write HTML-like code in JavaScript.'
      },
      {
        text: 'Which method is used to create components in React?',
        options: ['React.createComponent()', 'React.createElement()', 'createComponent()', 'component()'],
        correctIndex: 1,
        explanation: 'React.createElement() is the method used to create React elements/components.'
      },
      {
        text: 'What is the correct way to pass props to a component?',
        options: ['<Component props={value} />', '<Component {props: value} />', '<Component prop=value />', '<Component prop={value} />'],
        correctIndex: 3,
        explanation: 'Props are passed using the attribute syntax with curly braces for JavaScript expressions.'
      },
      {
        text: 'Which hook is used to manage state in functional components?',
        options: ['useEffect', 'useState', 'useContext', 'useReducer'],
        correctIndex: 1,
        explanation: 'useState is the primary hook for managing state in functional components.'
      }
    ]
  },
  {
    title: 'Data Structures & Algorithms',
    difficulty: 'Hard',
    category: 'Computer Science',
    timeLimit: 25,
    passingScore: 80,
    questions: [
      {
        text: 'What is the time complexity of binary search?',
        options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(n²)'],
        correctIndex: 1,
        explanation: 'Binary search has O(log n) time complexity as it eliminates half the search space in each iteration.'
      },
      {
        text: 'Which data structure uses LIFO (Last In First Out) principle?',
        options: ['Queue', 'Stack', 'Array', 'Linked List'],
        correctIndex: 1,
        explanation: 'Stack follows LIFO principle where the last element added is the first one to be removed.'
      },
      {
        text: 'What is the worst-case time complexity of QuickSort?',
        options: ['O(n log n)', 'O(n)', 'O(n²)', 'O(log n)'],
        correctIndex: 2,
        explanation: 'QuickSort has O(n²) worst-case time complexity when the pivot is always the smallest or largest element.'
      },
      {
        text: 'In a binary tree, what is the maximum number of nodes at level k?',
        options: ['2^k', '2^(k-1)', '2^(k+1)', 'k^2'],
        correctIndex: 0,
        explanation: 'At level k in a binary tree, the maximum number of nodes is 2^k (assuming level starts from 0).'
      }
    ]
  },
  {
    title: 'Database Fundamentals',
    difficulty: 'Medium',
    category: 'Database',
    timeLimit: 18,
    passingScore: 70,
    questions: [
      {
        text: 'What does SQL stand for?',
        options: ['Structured Query Language', 'Simple Query Language', 'Standard Query Language', 'System Query Language'],
        correctIndex: 0,
        explanation: 'SQL stands for Structured Query Language, used for managing relational databases.'
      },
      {
        text: 'Which SQL command is used to retrieve data from a database?',
        options: ['GET', 'SELECT', 'RETRIEVE', 'FETCH'],
        correctIndex: 1,
        explanation: 'SELECT is the SQL command used to retrieve data from database tables.'
      },
      {
        text: 'What is a primary key?',
        options: ['A key that opens the database', 'A unique identifier for each record', 'The first column in a table', 'A password for the database'],
        correctIndex: 1,
        explanation: 'A primary key is a unique identifier for each record in a database table.'
      },
      {
        text: 'Which normal form eliminates transitive dependencies?',
        options: ['1NF', '2NF', '3NF', 'BCNF'],
        correctIndex: 2,
        explanation: 'Third Normal Form (3NF) eliminates transitive dependencies in database tables.'
      }
    ]
  }
];

const seedQuizzes = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing quizzes
    await Quiz.deleteMany({});
    console.log('Cleared existing quizzes');

    // Insert sample quizzes
    const createdQuizzes = await Quiz.insertMany(sampleQuizzes);
    console.log(`Created ${createdQuizzes.length} sample quizzes`);

    // Display created quizzes
    createdQuizzes.forEach(quiz => {
      console.log(`- ${quiz.title} (${quiz.difficulty}) - ${quiz.questions.length} questions`);
    });

    console.log('\nSample quizzes created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding quizzes:', error);
    process.exit(1);
  }
};

seedQuizzes();