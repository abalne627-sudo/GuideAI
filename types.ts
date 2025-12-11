
export enum AppPhase {
  Welcome = 'welcome',
  Login = 'login',
  Dashboard = 'dashboard',
  Questionnaire = 'questionnaire',
  LoadingResults = 'loading_results',
  Results = 'results',
  ResourceHub = 'resource_hub',
  CompareAssessments = 'compare_assessments',
  OccupationsExplorer = 'occupations_explorer', // New
  EducationExplorer = 'education_explorer',   // New
  Error = 'error',
}

export enum Framework {
  BigFive = 'BigFive',
  MBTI = 'MBTI',
  RIASEC = 'RIASEC',
  Values = 'Values', // New Framework
}

export enum BigFiveCategory {
  Openness = 'Openness',
  Conscientiousness = 'Conscientiousness',
  Extraversion = 'Extraversion',
  Agreeableness = 'Agreeableness',
  Neuroticism = 'Neuroticism',
}

export enum MBTICategory {
  ExtraversionIntroversion = 'E/I',
  SensingIntuition = 'S/N',
  ThinkingFeeling = 'T/F',
  JudgingPerceiving = 'J/P',
}

export enum MBTIPole {
  Extraversion = 'E',
  Introversion = 'I',
  Sensing = 'S',
  Intuition = 'N',
  Thinking = 'T',
  Feeling = 'F',
  Judging = 'J',
  Perceiving = 'P',
}

export enum RIASECCategory {
  Realistic = 'Realistic',
  Investigative = 'Investigative',
  Artistic = 'Artistic',
  Social = 'Social',
  Enterprising = 'Enterprising',
  Conventional = 'Conventional',
}

// New ValueCategory Enum
export enum ValueCategory {
  Autonomy = 'Autonomy', // Preference for independence and self-direction
  Teamwork = 'Teamwork', // Preference for collaborative environments
  Stability = 'Stability', // Preference for secure and predictable work
  Innovation = 'Innovation', // Preference for creative and forward-thinking tasks
  WorkLifeBalance = 'Work-Life Balance', // Importance of balancing career and personal life
}

export interface Question {
  id: string;
  text: string;
  framework: Framework;
  category: BigFiveCategory | MBTICategory | RIASECCategory | ValueCategory; // Updated
  pole?: MBTIPole;
}

export type Answers = Record<string, number>;

export interface StudentProfile {
  bigFive: Partial<Record<BigFiveCategory, number>>;
  mbti: Partial<Record<MBTICategory, { dominantPole: MBTIPole; scoreDominant: number; scoreRecessive: number }>>;
  riasec: Partial<Record<RIASECCategory, number>>;
  values: Partial<Record<ValueCategory, number>>; // New: Store value scores
  summary?: string;
}

export interface CareerSuggestion {
  name: string;
  description: string;
  rationale: string;
  educationPathIndia: string;
  dayInTheLifeNarrative?: string | null; // New
  dayInTheLifeImageUrl?: string | null; // New
}

export interface StreamSuggestion {
  name: string;
  description: string;
  rationale: string;
  subjects: string[];
}

export interface User {
  id: string;
  mobile: string;
}

export interface AssessmentResultData {
  profile: StudentProfile;
  profileNarrative: string | null;
  careerSuggestions: CareerSuggestion[];
  streamSuggestions: StreamSuggestion[];
  skillRecommendations?: SkillRecommendation[]; // New
}

export interface AssessmentRecord extends AssessmentResultData {
  id: string;
  userId: string;
  timestamp: number;
  assessmentName?: string;
}

// Chatbot Types
export enum ChatRole {
  User = 'user',
  Model = 'model',
  Error = 'error', // For displaying errors in chat UI
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  timestamp: number;
}

// Skill Recommendation Type
export interface SkillRecommendation {
  skillName: string;
  description: string;
  relevance: string; // Why it's relevant for the user/career
  learningResources?: Array<{ title: string; url: string; type: string }>; // type e.g. "Online Course", "Article"
}

// User Goal Type
export interface UserGoal {
  id: string;
  userId: string;
  text: string;
  relatedTo?: string; // e.g., career name, stream name, or general
  createdAt: number;
  isCompleted: boolean;
}

// Resource Hub Item Type
export interface ResourceItem {
  id: string;
  title: string;
  type: 'article' | 'video' | 'tool' | 'course_platform';
  url: string;
  description: string;
  tags: string[];
}

// --- ISCO-08 Classification Types ---

export interface SkillDetail {
  name: string;
  type: 'technical' | 'soft'; // Example types
}

export interface SpecializedISCORole {
  name: string; // e.g., "Chip Designer"
  toolsets: string[]; // e.g., ["Verilog/VHDL", "CAD"]
  typicalDegrees: string[]; // e.g., ["Bachelor's in Electrical Engineering"]
}

export interface ISCOUnitGroup {
  code: string; // e.g., "1111"
  title: string;
  minorGroupCode: string;
  // Enriched data (placeholders, to be populated from other sources or by users)
  educationPaths?: string[]; // Region-specific education paths
  requiredSkills?: SkillDetail[]; // Core technical and soft skills
  salaryRange?: string; // Region-specific salary range
  demandOutlook?: string; // Region-specific demand outlook (e.g., "High", "Medium", "Low")
  specializedRoles?: SpecializedISCORole[];
  // Tasks and duties can also be added here if available from source or enriched later
  // tasks?: string[]; 
}

export interface ISCOMinorGroup {
  code: string; // e.g., "111"
  title: string;
  subMajorGroupCode: string;
  unitGroups?: ISCOUnitGroup[]; // Optional: direct children references
}

export interface ISCOSubMajorGroup {
  code: string; // e.g., "11"
  title: string;
  majorGroupCode: string;
  minorGroups?: ISCOMinorGroup[]; // Optional: direct children references
}

export interface ISCOMajorGroup {
  code: string; // e.g., "1"
  title: string;
  subMajorGroups?: ISCOSubMajorGroup[]; // Optional: direct children references
}

export interface ISCOData {
  majorGroups: ISCOMajorGroup[];
  subMajorGroups: ISCOSubMajorGroup[];
  minorGroups: ISCOMinorGroup[];
  unitGroups: ISCOUnitGroup[];
}

// --- Shared UI Component Types ---
export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}
