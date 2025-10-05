import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import JobRole from './models/JobRole.js';
import CompanyDrive from './models/CompanyDrive.js';
import LearningCourse from './models/LearningCourse.js';
import Quiz from './models/Quiz.js';
import Event from './models/Event.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await JobRole.deleteMany({});
    await CompanyDrive.deleteMany({});
    await LearningCourse.deleteMany({});
    await Quiz.deleteMany({});
    await Event.deleteMany({});

    console.log('🧹 Cleared existing data');

    // Create sample users
    // const users = await User.create([
    //   {
    //     name: 'Priya Sharma',
    //     email: 'test@example.com',
    //     password: 'password123',
    //     role: 'student',
    //     profile: {
    //       skills: ['React', 'JavaScript', 'Node.js', 'Python'],
    //       readinessScore: 78,
    //       level: 12,
    //       xp: 2350,
    //       college: 'IIT Delhi',
    //       branch: 'Computer Science',
    //       graduationYear: 2024
    //     }
    //   },
    //   {
    //     name: 'Dr. Rajesh Kumar',
    //     email: 'counselor@example.com',
    //     password: 'password123',
    //     role: 'counselor',
    //     profile: {
    //       specialties: ['Technical Interviews', 'Career Planning', 'Resume Review'],
    //       experience: '15+ years',
    //       sessionsCompleted: 1200
    //     }
    //   }
    // ]);

    // Create sample job roles
    const jobRoles = await JobRole.create([
      {
        title: "Frontend Developer",
        company: "Tech Solutions Inc",
        location: "Bangalore",
        salary: "₹8-15 LPA",
        experience: "0-2 years",
        skills: ["React", "JavaScript", "TypeScript", "CSS", "HTML"],
        description: "Build amazing user interfaces with modern web technologies and create seamless user experiences for millions of users.",
        applicants: 234,
        featured: true,
        matchScore: 92,
        companyLogo: "🚀",
        responsibilities: [
          "Develop and maintain highly responsive user interface components using React.",
          "Collaborate with UX/UI designers to translate wireframes into visual elements.",
          "Optimize application for maximum speed and scalability.",
          "Implement client-side architecture and state management using Redux/Zustand."
        ],
        qualifications: [
          "B.Tech/M.Tech in Computer Science or related field.",
          "Proficiency in JavaScript (ES6+), HTML5, and CSS3.",
          "2+ years of experience with React.js and its core principles.",
          "Familiarity with RESTful APIs and modern build pipelines (Webpack, Vite)."
        ],
        companyCulture: "Fast-paced, innovative environment with a strong focus on mentorship and growth. We believe in work-life balance and continuous learning."
      },
      {
        title: "Full Stack Developer",
        company: "StartupXYZ",
        location: "Hyderabad",
        salary: "₹10-18 LPA",
        experience: "1-3 years",
        skills: ["Node.js", "React", "MongoDB", "Express", "AWS"],
        description: "Work on end-to-end web application development in a fast-paced startup environment. Be part of our core engineering team.",
        applicants: 156,
        featured: false,
        matchScore: 85,
        companyLogo: "💻",
        responsibilities: [
          "Design and implement scalable backend services using Node.js and Express.",
          "Manage and optimize MongoDB databases and design efficient schemas.",
          "Integrate front-end components with server-side logic and APIs.",
          "Develop and maintain comprehensive documentation for APIs and services."
        ],
        qualifications: [
          "Solid understanding of the MERN stack and its ecosystem.",
          "Experience with cloud services (AWS, Azure) is a plus.",
          "Ability to handle both front-end and back-end development tasks efficiently.",
          "Strong debugging and problem-solving skills with attention to detail."
        ],
        companyCulture: "Agile, remote-friendly team that values ownership and continuous learning. We move fast and break things (responsibly!)."
      },
      {
        title: "Data Scientist",
        company: "Analytics Pro",
        location: "Mumbai",
        salary: "₹12-20 LPA",
        experience: "0-2 years",
        skills: ["Python", "Machine Learning", "SQL", "Statistics", "TensorFlow"],
        description: "Analyze complex data sets and build predictive models to drive business decisions and create data-driven products.",
        applicants: 89,
        featured: true,
        matchScore: 88,
        companyLogo: "📊",
        responsibilities: [
          "Analyze large, complex data sets to identify trends and patterns.",
          "Build and deploy machine learning models for predictive analytics.",
          "Collaborate with product teams to implement data-driven features.",
          "Create data visualizations and reports for stakeholders."
        ],
        qualifications: [
          "B.Tech/M.Tech in Computer Science, Statistics, or related field.",
          "Strong programming skills in Python and experience with ML libraries.",
          "Knowledge of statistical analysis and experimental design.",
          "Experience with SQL and database management systems."
        ],
        companyCulture: "Data-driven decision making is at our core. We encourage experimentation and innovation in everything we do."
      }
    ]);

    // Create sample company drives
    // const companyDrives = await CompanyDrive.create([
    //   {
    //     company: "Google",
    //     role: "Software Engineer Intern",
    //     location: "Bangalore",
    //     package: "₹8-12 LPA",
    //     deadline: new Date('2024-03-25'),
    //     logo: "🔍",
    //     featured: true,
    //     requirements: ["Computer Science", "JavaScript", "Data Structures", "Algorithms"],
    //     applicants: 234,
    //     description: "Join Google as a Software Engineer Intern and work on cutting-edge technology projects.",
    //     eligibility: ["B.Tech/B.E. in CS/IT", "CGPA 7.5+", "No active backlogs"],
    //     process: ["Online Test", "Technical Interviews", "HR Round"]
    //   },
    //   {
    //     company: "Microsoft",
    //     role: "Product Manager Intern",
    //     location: "Hyderabad",
    //     package: "₹10-15 LPA",
    //     deadline: new Date('2024-03-30'),
    //     logo: "💻",
    //     featured: true,
    //     requirements: ["Business", "Analytics", "Communication", "Product Thinking"],
    //     applicants: 189,
    //     description: "Microsoft Product Manager Internship program for aspiring product leaders.",
    //     eligibility: ["B.Tech/MBA", "Strong analytical skills", "Excellent communication"],
    //     process: ["Case Study", "Product Interview", "Manager Round", "HR Discussion"]
    //   },
    //   {
    //     company: "Amazon",
    //     role: "Data Scientist",
    //     location: "Mumbai",
    //     package: "₹12-18 LPA",
    //     deadline: new Date('2024-04-05'),
    //     logo: "📦",
    //     featured: false,
    //     requirements: ["Statistics", "Python", "Machine Learning", "SQL"],
    //     applicants: 156,
    //     description: "Amazon Data Science role working on recommendation systems and customer analytics.",
    //     eligibility: ["B.Tech/M.Tech in CS/Data Science", "Strong ML background", "Python proficiency"],
    //     process: ["Online Assessment", "Technical Rounds", "Data Challenge", "Final Interview"]
    //   }
    // ]);

    // Create sample learning courses
    const learningCourses = await LearningCourse.create([
      {
        title: "Advanced React Patterns",
        instructor: "Sarah Johnson",
        duration: "8 hours",
        level: "Advanced",
        rating: 4.9,
        students: 1234,
        thumbnail: "🚀",
        category: "Frontend",
        description: "Master advanced React concepts including hooks, context, performance optimization, and modern patterns used in production applications.",
        price: "Free",
        tags: ["React", "JavaScript", "Hooks", "Performance"],
        modules: 12,
        content: [
          {
            moduleTitle: "Advanced Hooks Deep Dive",
            videos: [
              { title: "useReducer vs useState", duration: "15:30", url: "/videos/react-1" },
              { title: "Custom Hooks Patterns", duration: "22:45", url: "/videos/react-2" }
            ],
            quizzes: [{ title: "Hooks Mastery", questions: 5 }]
          }
        ]
      },
      {
        title: "System Design Fundamentals",
        instructor: "Mike Chen",
        duration: "12 hours",
        level: "Intermediate",
        rating: 4.8,
        students: 856,
        thumbnail: "🏗️",
        category: "Backend",
        description: "Learn to design scalable systems that can handle millions of users. Master system architecture and distributed systems concepts.",
        price: "Premium",
        tags: ["System Design", "Architecture", "Scalability", "Distributed Systems"],
        modules: 15,
        content: [
          {
            moduleTitle: "Scalability Principles",
            videos: [
              { title: "Horizontal vs Vertical Scaling", duration: "18:20", url: "/videos/system-1" },
              { title: "Load Balancing Strategies", duration: "25:10", url: "/videos/system-2" }
            ],
            quizzes: [{ title: "Scalability Concepts", questions: 8 }]
          }
        ]
      },
      {
        title: "Data Structures & Algorithms",
        instructor: "Dr. Priya Sharma",
        duration: "20 hours",
        level: "Beginner",
        rating: 4.9,
        students: 2156,
        thumbnail: "🧮",
        category: "Programming",
        description: "Master the fundamentals of computer science with practical examples and coding challenges. Essential for technical interviews.",
        price: "Free",
        tags: ["DSA", "Programming", "Problem Solving", "Algorithms"],
        modules: 20,
        content: [
          {
            moduleTitle: "Arrays and Strings",
            videos: [
              { title: "Array Manipulation", duration: "12:45", url: "/videos/dsa-1" },
              { title: "String Algorithms", duration: "20:30", url: "/videos/dsa-2" }
            ],
            quizzes: [{ title: "Arrays Fundamentals", questions: 6 }]
          }
        ]
      }
    ]);

    // Create sample quizzes
    const quizzes = await Quiz.create([
      {
        title: "JavaScript Fundamentals",
        difficulty: "Easy",
        category: "JavaScript",
        questions: [
          {
            text: "What does the `typeof` operator return for `null` in JavaScript?",
            options: ["null", "object", "undefined", "string"],
            correctIndex: 1,
            explanation: "In JavaScript, typeof null returns 'object' which is a known historical bug in the language."
          },
          {
            text: "Which keyword is used to define a variable that cannot be reassigned?",
            options: ["var", "let", "const", "static"],
            correctIndex: 2,
            explanation: "The const keyword is used to declare variables that cannot be reassigned after their initial assignment."
          },
          {
            text: "Which method is used to add an element to the end of an array?",
            options: ["push()", "pop()", "shift()", "unshift()"],
            correctIndex: 0,
            explanation: "The push() method adds one or more elements to the end of an array and returns the new length."
          }
        ],
        timeLimit: 10,
        passingScore: 70
      },
      {
        title: "React Concepts",
        difficulty: "Medium",
        category: "React",
        questions: [
          {
            text: "What hook is primarily used for managing side effects in functional components?",
            options: ["useState", "useContext", "useEffect", "useReducer"],
            correctIndex: 2,
            explanation: "The useEffect hook is used for side effects like data fetching, subscriptions, or manually changing the DOM."
          },
          {
            text: "What is JSX?",
            options: [
              "A server-side rendering library",
              "A JavaScript syntax extension that allows HTML in JS",
              "A state management pattern",
              "A custom event handler"
            ],
            correctIndex: 1,
            explanation: "JSX is a syntax extension for JavaScript that allows writing HTML-like code in JavaScript files."
          }
        ],
        timeLimit: 15,
        passingScore: 75
      }
    ]);

    // Create sample events
    // const events = await Event.create([
    //   {
    //     title: "Google Summer Internship Drive",
    //     type: "Placement Drive",
    //     date: new Date('2024-03-15'),
    //     time: "10:00 AM - 5:00 PM",
    //     location: "Online Assessment",
    //     description: "Annual summer internship drive for 2024 batch students. Multiple positions available across engineering teams.",
    //     organizer: "Google Recruitment Team",
    //     maxAttendees: 500,
    //     status: "scheduled"
    //   },
    //   {
    //     title: "Career Counseling Session",
    //     type: "Counseling",
    //     date: new Date('2024-03-18'),
    //     time: "2:00 PM - 3:00 PM",
    //     location: "Video Call",
    //     description: "One-on-one career guidance session with experienced counselors. Get personalized advice for your career path.",
    //     organizer: "RecruitXchange Counseling Team",
    //     maxAttendees: 50,
    //     status: "scheduled"
    //   }
    // ]);

    console.log('\n🎉 Sample data created successfully!');
    // console.log(`👥 ${users.length} users`);
    // console.log(`💼 ${jobRoles.length} job roles`);
    // console.log(`🏢 ${companyDrives.length} company drives`);
    // console.log(`📚 ${learningCourses.length} learning courses`);
    // console.log(`🧩 ${quizzes.length} quizzes`);
    // console.log(`📅 ${events.length} events`);
    
    // console.log('\n🔑 Test User Credentials:');
    // console.log('   Email: test@example.com');
    // console.log('   Password: password123');
    
    // console.log('\n🚀 You can now start using the application with sample data!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();