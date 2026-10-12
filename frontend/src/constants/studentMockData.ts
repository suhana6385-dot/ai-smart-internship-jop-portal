import type {
  ApplicationTimelineEvent,
  ATSResult,
  Application,
  CareerPath,
  CertificationRecommendationItem,
  IndustryTrendData,
  InterviewFeedback,
  InterviewQuestion,
  InterviewType,
  LearningRecommendation,
  NotificationPreferences,
  OpportunityItem,
  ParsedResume,
  SkillGapItem,
  SkillMatchResult,
  StudentNotification,
  StudentProfile,
} from "@/types/student";

export const MOCK_STUDENT_PROFILE: StudentProfile = {
  id: "stu_1001",
  name: "Ananya Sharma",
  email: "ananya.sharma@example.com",
  headline: "Final-year CS student | Frontend & ML enthusiast",
  bio: "Passionate about building accessible web apps and exploring applied machine learning. Looking for SDE / Data Analyst internships.",
  location: "Bengaluru, India",
  education: {
    institution: "Vellore Institute of Technology",
    degree: "B.Tech",
    fieldOfStudy: "Computer Science & Engineering",
    graduationYear: 2026,
  },
  skills: ["React", "TypeScript", "Node.js", "Python", "SQL", "Data Structures", "Git"],
  interests: ["Web Development", "Machine Learning", "UI/UX Design"],
  careerGoal: "Software Development Engineer at a product-based company",
  profileCompletion: 78,
  socialLinks: {
    linkedin: "https://linkedin.com/in/ananya-sharma",
    github: "https://github.com/ananyasharma",
  },
};

export const MOCK_PARSED_RESUME: ParsedResume = {
  fileName: "Ananya_Sharma_Resume.pdf",
  uploadedAt: "2026-07-02T10:30:00Z",
  skills: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "Python", "Pandas"],
  projects: [
    {
      name: "Smart Internship Recommender",
      description: "AI-powered portal recommending internships based on skill match.",
      techStack: ["React", "Node.js", "MongoDB", "Python"],
    },
    {
      name: "Campus Event Tracker",
      description: "Full-stack app for managing and RSVPing to campus events.",
      techStack: ["React", "Express", "PostgreSQL"],
    },
  ],
  experience: [
    {
      role: "Frontend Intern",
      organization: "Pixel Craft Studio",
      duration: "May 2025 – Jul 2025",
      description: "Built responsive UI components and improved page load time by 30%.",
    },
  ],
  certifications: ["Meta Front-End Developer", "Python for Data Science (IBM)"],
};

export const MOCK_ATS_RESULT: ATSResult = {
  overallScore: 74,
  formattingScore: 82,
  keywordScore: 68,
  readabilityScore: 79,
  keywords: [
    { keyword: "React", found: true },
    { keyword: "TypeScript", found: true },
    { keyword: "REST APIs", found: true },
    { keyword: "Unit Testing", found: false },
    { keyword: "CI/CD", found: false },
    { keyword: "Agile", found: true },
  ],
  suggestions: [
    "Add measurable outcomes (%, numbers) to your project bullet points.",
    "Include a dedicated 'Skills' section with keyword-rich, comma-separated terms.",
    "Mention testing frameworks like Jest or React Testing Library if applicable.",
    "Keep bullet points under two lines for better ATS parsing.",
  ],
};

export const MOCK_SKILL_MATCHES: SkillMatchResult[] = [
  {
    jobTitle: "Frontend Developer Intern",
    company: "Nimbus Tech",
    matchPercentage: 88,
    matchedSkills: ["React", "TypeScript", "Git"],
    missingSkills: ["Testing Library", "GraphQL"],
  },
  {
    jobTitle: "Full Stack Engineer",
    company: "Bluewave Systems",
    matchPercentage: 71,
    matchedSkills: ["Node.js", "React", "SQL"],
    missingSkills: ["Docker", "AWS", "Redis"],
  },
  {
    jobTitle: "Data Analyst Intern",
    company: "Insight Metrics",
    matchPercentage: 63,
    matchedSkills: ["Python", "SQL"],
    missingSkills: ["Power BI", "Statistics", "Excel Macros"],
  },
];

export const MOCK_SKILL_GAP: SkillGapItem[] = [
  { skill: "Docker", demandLevel: "High", currentLevel: 20, requiredLevel: 75 },
  { skill: "AWS", demandLevel: "High", currentLevel: 15, requiredLevel: 70 },
  { skill: "GraphQL", demandLevel: "Medium", currentLevel: 10, requiredLevel: 60 },
  { skill: "Testing (Jest/RTL)", demandLevel: "High", currentLevel: 30, requiredLevel: 80 },
  { skill: "System Design", demandLevel: "Medium", currentLevel: 25, requiredLevel: 65 },
];

export const MOCK_LEARNING_RECOMMENDATIONS: LearningRecommendation[] = [
  {
    title: "Docker & Kubernetes for Developers",
    provider: "Coursera",
    duration: "4 weeks",
    skill: "Docker",
    url: "https://coursera.org",
  },
  {
    title: "AWS Cloud Practitioner Essentials",
    provider: "AWS Skill Builder",
    duration: "3 weeks",
    skill: "AWS",
    url: "https://aws.amazon.com/training",
  },
  {
    title: "Testing React Apps",
    provider: "freeCodeCamp",
    duration: "2 weeks",
    skill: "Testing (Jest/RTL)",
    url: "https://freecodecamp.org",
  },
];

export const MOCK_CAREER_PATHS: CareerPath[] = [
  {
    title: "Frontend Engineer",
    confidence: 91,
    description: "Build performant, accessible user interfaces for web applications.",
    averageSalary: "₹8–14 LPA",
    roadmap: [
      "Master React, TypeScript & state management",
      "Learn testing & performance optimization",
      "Contribute to open-source UI libraries",
      "Build a strong portfolio of 3-4 polished projects",
    ],
  },
  {
    title: "Full Stack Developer",
    confidence: 84,
    description: "Own both client and server-side development end to end.",
    averageSalary: "₹9–16 LPA",
    roadmap: [
      "Strengthen backend fundamentals (Node.js/Express)",
      "Learn database design & API architecture",
      "Deploy full-stack apps with CI/CD",
      "Practice system design basics",
    ],
  },
  {
    title: "Data Analyst",
    confidence: 68,
    description: "Turn raw data into actionable business insights.",
    averageSalary: "₹6–11 LPA",
    roadmap: [
      "Strengthen SQL & statistics fundamentals",
      "Learn a BI tool (Power BI / Tableau)",
      "Build 2-3 end-to-end analysis case studies",
      "Practice storytelling with data",
    ],
  },
];

export const MOCK_CERTIFICATIONS: CertificationRecommendationItem[] = [
  {
    title: "AWS Certified Cloud Practitioner",
    provider: "Amazon Web Services",
    priority: "High",
    duration: "6 weeks",
    cost: "₹8,000",
    skillCovered: "Cloud Computing",
  },
  {
    title: "Meta Front-End Developer Professional Certificate",
    provider: "Coursera / Meta",
    priority: "High",
    duration: "5 months (self-paced)",
    cost: "₹3,500/mo",
    skillCovered: "React & Frontend Engineering",
  },
  {
    title: "Google Data Analytics Certificate",
    provider: "Coursera / Google",
    priority: "Medium",
    duration: "6 months (self-paced)",
    cost: "₹3,500/mo",
    skillCovered: "Data Analysis",
  },
  {
    title: "MongoDB Associate Developer",
    provider: "MongoDB University",
    priority: "Low",
    duration: "2 weeks",
    cost: "Free",
    skillCovered: "Database Management",
  },
];

export const MOCK_INTERNSHIPS: OpportunityItem[] = [
  {
    id: "int_1",
    title: "Frontend Developer Intern",
    company: "Nimbus Tech",
    location: "Bengaluru",
    type: "Hybrid",
    matchScore: 88,
    stipendOrSalary: "₹25,000/mo",
    postedAgo: "2 days ago",
    skills: ["React", "TypeScript", "Tailwind CSS"],
  },
  {
    id: "int_2",
    title: "Software Engineering Intern",
    company: "Bluewave Systems",
    location: "Remote",
    type: "Remote",
    matchScore: 76,
    stipendOrSalary: "₹20,000/mo",
    postedAgo: "5 days ago",
    skills: ["Node.js", "MongoDB", "REST APIs"],
  },
  {
    id: "int_3",
    title: "Data Analyst Intern",
    company: "Insight Metrics",
    location: "Hyderabad",
    type: "On-site",
    matchScore: 63,
    stipendOrSalary: "₹18,000/mo",
    postedAgo: "1 week ago",
    skills: ["Python", "SQL", "Excel"],
  },
  {
    id: "int_4",
    title: "Machine Learning Intern",
    company: "Cortex AI Labs",
    location: "Remote",
    type: "Remote",
    matchScore: 58,
    stipendOrSalary: "₹22,000/mo",
    postedAgo: "3 days ago",
    skills: ["Python", "TensorFlow", "NumPy"],
  },
];

export const MOCK_JOBS: OpportunityItem[] = [
  {
    id: "job_1",
    title: "Frontend Developer",
    company: "Zenith Softworks",
    location: "Bengaluru",
    type: "Hybrid",
    matchScore: 85,
    stipendOrSalary: "₹9–12 LPA",
    postedAgo: "3 days ago",
    skills: ["React", "TypeScript", "Redux"],
  },
  {
    id: "job_2",
    title: "Full Stack Engineer",
    company: "Bluewave Systems",
    location: "Pune",
    type: "On-site",
    matchScore: 72,
    stipendOrSalary: "₹10–14 LPA",
    postedAgo: "1 week ago",
    skills: ["Node.js", "React", "AWS"],
  },
  {
    id: "job_3",
    title: "Associate Data Analyst",
    company: "Insight Metrics",
    location: "Remote",
    type: "Remote",
    matchScore: 61,
    stipendOrSalary: "₹6–9 LPA",
    postedAgo: "4 days ago",
    skills: ["SQL", "Power BI", "Python"],
  },
];

export const MOCK_INDUSTRY_TRENDS: IndustryTrendData = {
  trendingSkills: [
    { skill: "React", growth: 34 },
    { skill: "TypeScript", growth: 41 },
    { skill: "Python", growth: 28 },
    { skill: "AWS", growth: 45 },
    { skill: "GraphQL", growth: 22 },
  ],
  hiringCompanies: [
    { company: "Zenith Softworks", openings: 24 },
    { company: "Bluewave Systems", openings: 18 },
    { company: "Nimbus Tech", openings: 15 },
    { company: "Cortex AI Labs", openings: 11 },
  ],
  salaryTrends: [
    { month: "Feb", salary: 8.2 },
    { month: "Mar", salary: 8.4 },
    { month: "Apr", salary: 8.6 },
    { month: "May", salary: 8.9 },
    { month: "Jun", salary: 9.3 },
    { month: "Jul", salary: 9.6 },
  ],
  inDemandRoles: [
    { role: "Frontend Engineer", demandScore: 92 },
    { role: "Full Stack Developer", demandScore: 88 },
    { role: "Data Analyst", demandScore: 74 },
    { role: "ML Engineer", demandScore: 69 },
  ],
};

function buildTimeline(
  startDate: string,
  statuses: Application["status"][]
): ApplicationTimelineEvent[] {
  const start = new Date(startDate);
  return statuses.map((status, index) => {
    const date = new Date(start);
    date.setDate(date.getDate() + index * 4);
    return { status, date: date.toISOString().slice(0, 10) };
  });
}

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: "app_1",
    jobTitle: "Frontend Developer Intern",
    company: "Nimbus Tech",
    appliedOn: "2026-06-20",
    status: "Interview",
    timeline: buildTimeline("2026-06-20", ["Applied", "Interview"]),
  },
  {
    id: "app_2",
    jobTitle: "Full Stack Engineer",
    company: "Bluewave Systems",
    appliedOn: "2026-06-15",
    status: "Offer",
    timeline: buildTimeline("2026-06-15", ["Applied", "Interview", "Offer"]),
  },
  {
    id: "app_3",
    jobTitle: "Data Analyst Intern",
    company: "Insight Metrics",
    appliedOn: "2026-06-25",
    status: "Applied",
    timeline: buildTimeline("2026-06-25", ["Applied"]),
  },
  {
    id: "app_4",
    jobTitle: "Machine Learning Intern",
    company: "Cortex AI Labs",
    appliedOn: "2026-06-10",
    status: "Rejected",
    timeline: buildTimeline("2026-06-10", ["Applied", "Interview", "Rejected"]),
  },
];

export const MOCK_NOTIFICATIONS: StudentNotification[] = [
  {
    id: "notif_1",
    type: "Interview",
    title: "Interview scheduled",
    message: "Your interview with Nimbus Tech is scheduled for Jul 15, 10:00 AM.",
    createdAt: "2026-07-09T09:00:00Z",
    read: false,
  },
  {
    id: "notif_2",
    type: "Job",
    title: "New job match",
    message: "A new Frontend Developer role at Zenith Softworks matches your profile.",
    createdAt: "2026-07-08T14:20:00Z",
    read: false,
  },
  {
    id: "notif_3",
    type: "Resume",
    title: "Resume score improved",
    message: "Your ATS score increased to 74 after your latest resume update.",
    createdAt: "2026-07-06T11:00:00Z",
    read: true,
  },
  {
    id: "notif_4",
    type: "Certification",
    title: "Certification reminder",
    message: "Complete your AWS Cloud Practitioner course — 2 weeks remaining.",
    createdAt: "2026-07-04T08:30:00Z",
    read: true,
  },
  {
    id: "notif_5",
    type: "Internship",
    title: "Internship deadline approaching",
    message: "Applications for Cortex AI Labs' ML Internship close in 3 days.",
    createdAt: "2026-07-03T16:45:00Z",
    read: true,
  },
];

export const MOCK_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  newJobs: true,
  internshipAlerts: true,
  interviewReminders: true,
  resumeAlerts: false,
  certificationReminders: true,
};

export const MOCK_INTERVIEW_QUESTIONS: Record<InterviewType, InterviewQuestion[]> = {
  Technical: [
    { id: "t1", type: "Technical", question: "Explain the difference between == and === in JavaScript." },
    { id: "t2", type: "Technical", question: "What is the virtual DOM and why does React use it?" },
    { id: "t3", type: "Technical", question: "How would you optimize a React app that re-renders too often?" },
  ],
  HR: [
    { id: "h1", type: "HR", question: "Tell me about yourself and your career goals." },
    { id: "h2", type: "HR", question: "Describe a time you handled conflict within a team." },
    { id: "h3", type: "HR", question: "Why do you want to work with our company?" },
  ],
  Aptitude: [
    { id: "a1", type: "Aptitude", question: "A train travels 60km in 45 minutes. What is its speed in km/h?" },
    { id: "a2", type: "Aptitude", question: "If 5 workers finish a task in 12 days, how long will 8 workers take?" },
    { id: "a3", type: "Aptitude", question: "Find the next number in the series: 2, 6, 12, 20, 30, ?" },
  ],
  Coding: [
    { id: "c1", type: "Coding", question: "Write a function to reverse a linked list." },
    { id: "c2", type: "Coding", question: "Find the first non-repeating character in a string." },
    { id: "c3", type: "Coding", question: "Implement a function to check if a string is a valid palindrome." },
  ],
};

export function buildMockInterviewFeedback(): InterviewFeedback {
  return {
    overallScore: 78,
    communication: 82,
    technicalAccuracy: 74,
    confidence: 80,
    strengths: [
      "Clear and structured explanations",
      "Good grasp of core JavaScript/React fundamentals",
    ],
    improvements: [
      "Add more real-world examples when explaining concepts",
      "Practice time complexity analysis for coding questions",
    ],
  };
}
