export enum AppState {
  AUTH = 'AUTH',
  INTAKE = 'INTAKE',
  BRIDGE_ANALYSIS = 'BRIDGE_ANALYSIS',
  DASHBOARD = 'DASHBOARD',
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export enum Branch {
  // Engineering
  CSE = 'CSE',
  ECE = 'ECE',
  Mechanical = 'Mechanical',
  Civil = 'Civil',
  Chemical = 'Chemical',
  Aerospace = 'Aerospace',
  Biotech = 'Biotech',
  
  // Science
  BSc_Physics = 'BSc Physics',
  BSc_Math = 'BSc Math',
  BSc_Bio = 'BSc Biology',
  
  // Commerce
  BCom = 'BCom',
  BBA = 'BBA',
  CA = 'CA',
  
  // Medicine
  MBBS = 'MBBS',
  BPharm = 'BPharm',
  
  // Arts/Design/Other
  BA = 'BA',
  Design = 'B.Design',
  BArch = 'BArch',
  Law = 'Law',
  Other = 'Other'
}

export enum Interest {
  // Tech & AI
  AIML = 'AI/ML',
  Web3 = 'Web3 & Blockchain',
  Cybersecurity = 'Cybersecurity',
  CloudDevOps = 'Cloud & DevOps',
  DataScience = 'Data Science',
  
  // Business
  Fintech = 'Fintech',
  Investment = 'Investment & Trading',
  Startup = 'Entrepreneurship',
  
  // Impact
  ClimateTech = 'Climate Tech',
  HealthTech = 'HealthTech',
  EdTech = 'EdTech',
  
  // Creative
  CreatorEconomy = 'Creator Economy',
  Design = 'Design & UX/UI',
  Gaming = 'Gaming',
  
  // Specialized
  SpaceTech = 'Space Tech',
  Robotics = 'Robotics',
  Biotech = 'Biotech'
}

export interface UserProfile {
  // Stage 1: Basic Info
  name: string;
  email: string;
  phone?: string;
  gender: 'Male' | 'Female' | 'Prefer not to say';
  age?: number;
  city?: string;
  country?: string;
  branch: Branch;
  year: number;
  college?: string;
  graduationDate?: string;
  cgpa?: number;

  // Stage 2: Skills
  technicalSkills: string[];
  tools: string[];
  domainKnowledge: string[];
  softSkills: string[];
  languages: string[];
  workExperience?: string; // Summary

  // Stage 3: Interests
  primaryInterest: Interest; // Main focus for the algorithm
  secondaryInterests: string[]; // Other selected interests
  depthPreference: string;
  impactMotivation: string;
  industryPreference: string;
  roleType: string;

  // Stage 4: Time
  timeMode: string;
  weeklyHours: number;
  availableDays: string[];
  peakHours: string[];
  examMonths: string[];

  // Stage 5: Constraints
  budget?: string;
  hasLaptop?: boolean;
  internetQuality?: string;
  
  // Stage 6: Context
  careerQuestion?: string;
  learningStyle?: string[];

  // Stage 7: Consent
  privacyAccepted: boolean;
}

export interface BridgeData {
  transferableSkills: string[];
  missingSkills: string[];
  uniqueAdvantage: string;
  salaryPremium: string;
  roleTitle: string;
}

export interface CareerNode {
  id: string;
  title: string;
  description: string;
  type: 'milestone' | 'project' | 'learning';
  duration: string; // e.g., "2 weeks"
  status: 'locked' | 'active' | 'completed';
  relatedResources?: string[];
}

export interface CareerPath {
  id: string;
  name: string; // e.g., "Product Builder", "Research Scientist"
  color: string;
  description: string;
  nodes: CareerNode[];
  totalDurationWeeks: number; // Base duration
}

export interface DailyTask {
  id: string;
  title: string;
  durationMin: number;
  type: 'theory' | 'practice' | 'project';
  completed: boolean;
}

export interface MentorMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: number;
}