import mongoose from 'mongoose';
import dotenv from 'dotenv';
import JobRole from '../models/JobRole.js';
import connectDB from '../config/db.js';

// Load env vars
dotenv.config();

const sampleRoles = [
  {
    roleName: 'Full Stack Developer',
    techStack: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript', 'HTML/CSS'],
    averagePackage: '8-15 LPA',
    description: 'Full Stack Developers work on both front-end and back-end development of web applications. They are responsible for creating complete web solutions from user interface to server-side logic.',
    majorCompanies: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'Uber'],
    skillsRequired: ['Problem Solving', 'Communication', 'Team Collaboration', 'Time Management'],
    careerPath: 'Junior Developer → Senior Developer → Tech Lead → Engineering Manager',
    workEnvironment: 'Collaborative team environment with agile methodologies, remote work options available',
    jobResponsibilities: [
      'Develop and maintain web applications',
      'Write clean, maintainable code',
      'Collaborate with designers and product managers',
      'Participate in code reviews',
      'Debug and troubleshoot issues'
    ],
    educationRequirements: ['Bachelor\'s in Computer Science or related field', 'Strong portfolio of projects', 'Understanding of software development principles'],
    experienceLevel: 'All Levels',
    industryDemand: 'Very High',
    remoteWorkOptions: 'Hybrid',
    featured: true
  },
  {
    roleName: 'Data Scientist',
    techStack: ['Python', 'R', 'SQL', 'Machine Learning', 'TensorFlow', 'Pandas', 'NumPy'],
    averagePackage: '12-25 LPA',
    description: 'Data Scientists analyze complex data to help organizations make informed decisions. They use statistical methods, machine learning, and data visualization to extract insights from large datasets.',
    majorCompanies: ['Google', 'Microsoft', 'Amazon', 'IBM', 'Spotify', 'Airbnb'],
    skillsRequired: ['Statistical Analysis', 'Critical Thinking', 'Data Visualization', 'Business Acumen'],
    careerPath: 'Data Analyst → Data Scientist → Senior Data Scientist → Data Science Manager',
    workEnvironment: 'Research-oriented environment with access to large datasets and computing resources',
    jobResponsibilities: [
      'Analyze large datasets to identify trends',
      'Build predictive models',
      'Create data visualizations',
      'Present findings to stakeholders',
      'Collaborate with engineering teams'
    ],
    educationRequirements: ['Bachelor\'s/Master\'s in Statistics, Mathematics, or Computer Science', 'Strong foundation in statistics and mathematics', 'Experience with data analysis tools'],
    experienceLevel: 'Mid Level',
    industryDemand: 'Very High',
    remoteWorkOptions: 'Fully Remote',
    featured: true
  },
  {
    roleName: 'DevOps Engineer',
    techStack: ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Terraform', 'Linux', 'Git'],
    averagePackage: '10-20 LPA',
    description: 'DevOps Engineers bridge the gap between development and operations teams. They focus on automating and streamlining software deployment, infrastructure management, and continuous integration/delivery processes.',
    majorCompanies: ['Amazon', 'Microsoft', 'Google', 'Netflix', 'Atlassian', 'Red Hat'],
    skillsRequired: ['Automation', 'Problem Solving', 'System Administration', 'Collaboration'],
    careerPath: 'System Administrator → DevOps Engineer → Senior DevOps Engineer → DevOps Architect',
    workEnvironment: 'Fast-paced environment focused on automation and continuous improvement',
    jobResponsibilities: [
      'Automate deployment processes',
      'Manage cloud infrastructure',
      'Monitor system performance',
      'Implement CI/CD pipelines',
      'Ensure system security and reliability'
    ],
    educationRequirements: ['Bachelor\'s in Computer Science or related field', 'Experience with cloud platforms', 'Understanding of networking and security'],
    experienceLevel: 'Mid Level',
    industryDemand: 'High',
    remoteWorkOptions: 'Hybrid'
  },
  {
    roleName: 'UI/UX Designer',
    techStack: ['Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'Prototyping Tools'],
    averagePackage: '6-12 LPA',
    description: 'UI/UX Designers create intuitive and visually appealing user interfaces and experiences. They research user needs, design wireframes and prototypes, and ensure products are user-friendly and accessible.',
    majorCompanies: ['Apple', 'Google', 'Microsoft', 'Adobe', 'Airbnb', 'Spotify'],
    skillsRequired: ['Creativity', 'User Research', 'Visual Design', 'Communication', 'Empathy'],
    careerPath: 'Junior Designer → UI/UX Designer → Senior Designer → Design Lead → Design Director',
    workEnvironment: 'Creative environment with focus on user-centered design and collaboration',
    jobResponsibilities: [
      'Conduct user research and testing',
      'Create wireframes and prototypes',
      'Design user interfaces',
      'Collaborate with developers',
      'Iterate based on user feedback'
    ],
    educationRequirements: ['Bachelor\'s in Design, HCI, or related field', 'Strong portfolio showcasing design work', 'Understanding of design principles'],
    experienceLevel: 'All Levels',
    industryDemand: 'High',
    remoteWorkOptions: 'Hybrid'
  },
  {
    roleName: 'Mobile App Developer',
    techStack: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Java', 'Dart'],
    averagePackage: '7-16 LPA',
    description: 'Mobile App Developers create applications for mobile devices including smartphones and tablets. They work with platform-specific technologies or cross-platform frameworks to build engaging mobile experiences.',
    majorCompanies: ['Apple', 'Google', 'Meta', 'Uber', 'WhatsApp', 'Instagram'],
    skillsRequired: ['Mobile Development', 'Problem Solving', 'User Experience', 'Performance Optimization'],
    careerPath: 'Junior Mobile Developer → Mobile Developer → Senior Mobile Developer → Mobile Architect',
    workEnvironment: 'Agile development environment with focus on mobile user experience',
    jobResponsibilities: [
      'Develop mobile applications',
      'Optimize app performance',
      'Implement user interfaces',
      'Test on multiple devices',
      'Publish apps to app stores'
    ],
    educationRequirements: ['Bachelor\'s in Computer Science or related field', 'Experience with mobile development frameworks', 'Understanding of mobile design patterns'],
    experienceLevel: 'All Levels',
    industryDemand: 'High',
    remoteWorkOptions: 'Hybrid'
  },
  {
    roleName: 'Cybersecurity Analyst',
    techStack: ['Network Security', 'Penetration Testing', 'SIEM Tools', 'Firewalls', 'Encryption', 'Risk Assessment'],
    averagePackage: '8-18 LPA',
    description: 'Cybersecurity Analysts protect organizations from digital threats by monitoring networks, investigating security breaches, and implementing security measures to safeguard sensitive information.',
    majorCompanies: ['IBM', 'Cisco', 'Microsoft', 'Palo Alto Networks', 'CrowdStrike', 'FireEye'],
    skillsRequired: ['Analytical Thinking', 'Attention to Detail', 'Ethical Hacking', 'Risk Assessment'],
    careerPath: 'Security Analyst → Senior Security Analyst → Security Architect → CISO',
    workEnvironment: 'Security-focused environment with emphasis on threat detection and prevention',
    jobResponsibilities: [
      'Monitor network security',
      'Investigate security incidents',
      'Implement security policies',
      'Conduct vulnerability assessments',
      'Train employees on security practices'
    ],
    educationRequirements: ['Bachelor\'s in Cybersecurity, Computer Science, or related field', 'Security certifications (CISSP, CEH, etc.)', 'Understanding of network protocols'],
    experienceLevel: 'Mid Level',
    industryDemand: 'Very High',
    remoteWorkOptions: 'Hybrid'
  }
];

const seedRoles = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing roles
    await JobRole.deleteMany({});
    console.log('Cleared existing roles');

    // Insert sample roles
    const createdRoles = await JobRole.insertMany(sampleRoles);
    console.log(`Created ${createdRoles.length} sample roles:`);
    
    createdRoles.forEach(role => {
      console.log(`- ${role.roleName} (${role.experienceLevel}, ${role.industryDemand} demand)`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding roles:', error);
    process.exit(1);
  }
};

seedRoles();