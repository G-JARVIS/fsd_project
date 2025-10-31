import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import CompanyDrive from '../models/CompanyDrive.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const sampleDrives = [
  {
    company: 'Google',
    role: 'Software Engineer',
    location: 'Bangalore',
    package: '₹25-30 LPA',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    logo: '🔍',
    featured: true,
    requirements: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    description: 'Join Google as a Software Engineer and work on cutting-edge technologies.',
    eligibility: ['B.Tech/B.E. in CS/IT', 'CGPA > 7.0', 'No backlogs'],
    process: ['Online Test', 'Technical Interview', 'HR Interview'],
    processSchedule: [
      {
        stage: 'Online Test',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        time: '10:00 AM - 12:00 PM',
        venue: 'Online Platform',
        description: 'Coding and aptitude test covering DSA, JavaScript, and problem-solving'
      },
      {
        stage: 'Technical Interview',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        time: '2:00 PM - 4:00 PM',
        venue: 'Google Bangalore Office',
        description: 'Technical discussion on projects, system design, and coding challenges'
      },
      {
        stage: 'HR Interview',
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        time: '11:00 AM - 12:00 PM',
        venue: 'Google Bangalore Office',
        description: 'Discussion on career goals, cultural fit, and compensation'
      }
    ],
    applicants: 45
  },
  {
    company: 'Microsoft',
    role: 'Full Stack Developer',
    location: 'Hyderabad',
    package: '₹22-28 LPA',
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    logo: '🪟',
    featured: true,
    requirements: ['C#', '.NET', 'Azure', 'SQL Server'],
    description: 'Build scalable applications at Microsoft.',
    eligibility: ['B.Tech/B.E. in CS/IT/EXTC', 'CGPA > 6.5'],
    process: ['Coding Round', 'System Design', 'Behavioral Interview'],
    processSchedule: [
      {
        stage: 'Coding Round',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        time: '9:00 AM - 11:00 AM',
        venue: 'Online Platform',
        description: 'Coding challenges in C# and .NET framework'
      },
      {
        stage: 'System Design',
        date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        time: '3:00 PM - 4:30 PM',
        venue: 'Microsoft Hyderabad Office',
        description: 'Design scalable systems and discuss architecture patterns'
      },
      {
        stage: 'Behavioral Interview',
        date: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000),
        time: '10:30 AM - 11:30 AM',
        venue: 'Microsoft Hyderabad Office',
        description: 'Leadership principles and team collaboration discussion'
      }
    ],
    applicants: 38
  },
  {
    company: 'Amazon',
    role: 'SDE-1',
    location: 'Chennai',
    package: '₹20-25 LPA',
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    logo: '📦',
    featured: false,
    requirements: ['Java', 'Python', 'AWS', 'Data Structures'],
    description: 'Software Development Engineer role at Amazon.',
    eligibility: ['B.Tech/B.E. in CS/IT', 'CGPA > 7.5'],
    process: ['Online Assessment', 'Technical Interview', 'Bar Raiser'],
    processSchedule: [
      {
        stage: 'Online Assessment',
        date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        time: '2:00 PM - 4:00 PM',
        venue: 'Online Platform',
        description: 'Coding assessment with focus on algorithms and data structures'
      },
      {
        stage: 'Technical Interview',
        date: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000),
        time: '1:00 PM - 2:30 PM',
        venue: 'Amazon Chennai Office',
        description: 'Deep dive into technical skills and problem-solving approach'
      },
      {
        stage: 'Bar Raiser',
        date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        time: '4:00 PM - 5:00 PM',
        venue: 'Amazon Chennai Office',
        description: 'Final interview focusing on Amazon leadership principles'
      }
    ],
    applicants: 67
  },
  {
    company: 'Flipkart',
    role: 'Software Engineer',
    location: 'Bangalore',
    package: '₹18-22 LPA',
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    logo: '🛒',
    featured: false,
    requirements: ['Java', 'Spring Boot', 'MySQL', 'Microservices'],
    description: 'Join Flipkart engineering team.',
    eligibility: ['B.Tech/B.E. in CS/IT/EXTC', 'CGPA > 6.0'],
    process: ['Machine Coding', 'Technical Interview', 'Hiring Manager Round'],
    processSchedule: [
      {
        stage: 'Machine Coding',
        date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        time: '10:00 AM - 1:00 PM',
        venue: 'Online Platform',
        description: 'Build a working application with given requirements'
      },
      {
        stage: 'Technical Interview',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        time: '2:30 PM - 4:00 PM',
        venue: 'Flipkart Bangalore Office',
        description: 'Discussion on machine coding solution and system design'
      },
      {
        stage: 'Hiring Manager Round',
        date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        time: '11:30 AM - 12:30 PM',
        venue: 'Flipkart Bangalore Office',
        description: 'Final discussion with hiring manager on role expectations'
      }
    ],
    applicants: 52
  },
  {
    company: 'TCS',
    role: 'Systems Engineer',
    location: 'Mumbai',
    package: '₹3.5-4.5 LPA',
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    logo: '💼',
    featured: false,
    requirements: ['Any Programming Language', 'Problem Solving', 'Communication'],
    description: 'Entry-level position at TCS.',
    eligibility: ['Any Engineering Branch', 'CGPA > 6.0', 'No active backlogs'],
    process: ['Online Test', 'Technical Interview', 'HR Interview'],
    processSchedule: [
      {
        stage: 'Online Test',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        time: '9:00 AM - 11:00 AM',
        venue: 'Online Platform',
        description: 'Aptitude, technical, and English comprehension test'
      },
      {
        stage: 'Technical Interview',
        date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        time: '10:00 AM - 11:00 AM',
        venue: 'TCS Mumbai Office',
        description: 'Basic technical concepts and programming fundamentals'
      },
      {
        stage: 'HR Interview',
        date: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        time: '2:00 PM - 2:30 PM',
        venue: 'TCS Mumbai Office',
        description: 'Personal interview and company culture discussion'
      }
    ],
    applicants: 234
  },
  {
    company: 'Infosys',
    role: 'Systems Engineer',
    location: 'Pune',
    package: '₹4-5 LPA',
    deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
    logo: '🏢',
    featured: false,
    requirements: ['Programming Fundamentals', 'Database Concepts', 'OOPS'],
    description: 'Graduate trainee program at Infosys.',
    eligibility: ['B.Tech/B.E./MCA', 'CGPA > 6.0'],
    process: ['Online Test', 'Technical + HR Interview'],
    processSchedule: [
      {
        stage: 'Online Test',
        date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        time: '1:00 PM - 3:00 PM',
        venue: 'Online Platform',
        description: 'Programming, logical reasoning, and verbal ability test'
      },
      {
        stage: 'Technical + HR Interview',
        date: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
        time: '9:30 AM - 11:00 AM',
        venue: 'Infosys Pune Office',
        description: 'Combined technical and HR interview session'
      }
    ],
    applicants: 189
  }
];

const seedDrives = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing drives
    await CompanyDrive.deleteMany({});
    console.log('Cleared existing drives');

    // Insert sample drives
    const createdDrives = await CompanyDrive.insertMany(sampleDrives);
    console.log(`Created ${createdDrives.length} sample drives`);

    console.log('Sample drives created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding drives:', error);
    process.exit(1);
  }
};

seedDrives();