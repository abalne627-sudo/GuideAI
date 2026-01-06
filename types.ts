
export enum AppPhase {
  Welcome = 'welcome',
  Login = 'login',
  Dashboard = 'dashboard',
  Questionnaire = 'questionnaire',
  LoadingResults = 'loading_results',
  Results = 'results',
  ResourceHub = 'resource_hub',
  CompareAssessments = 'compare_assessments',
  OccupationsExplorer = 'occupations_explorer',
  EducationExplorer = 'education_explorer',
  Bibliography = 'bibliography',
  Error = 'error',
}

export enum Framework {
  BigFive = 'BigFive',
  MBTI = 'MBTI',
  RIASEC = 'RIASEC',
  Values = 'Values',
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

export enum ValueCategory {
  Autonomy = 'Autonomy',
  Teamwork = 'Teamwork',
  Stability = 'Stability',
  Innovation = 'Innovation',
  WorkLifeBalance = 'Work-Life Balance',
}

export interface Question {
  id: string;
  text: string;
  framework: Framework;
  category: BigFiveCategory | MBTICategory | RIASECCategory | ValueCategory;
  pole?: MBTIPole;
}

export type Answers = Record<string, number>;

export interface StudentProfile {
  bigFive: Partial<Record<BigFiveCategory, number>>;
  mbti: Partial<Record<MBTICategory, { dominantPole: MBTIPole; scoreDominant: number; scoreRecessive: number }>>;
  riasec: Partial<Record<RIASECCategory, number>>;
  values: Partial<Record<ValueCategory, number>>;
  summary?: string;
}

export interface CareerSuggestion {
  name: string;
  description: string;
  rationale: string;
  educationPathIndia: string;
  dayInTheLifeNarrative?: string | null;
  dayInTheLifeImageUrl?: string | null;
  iscoCode?: string | null; // New: Connects to the Global Occupations Explorer
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
  skillRecommendations?: SkillRecommendation[];
}

export interface AssessmentRecord extends AssessmentResultData {
  id: string;
  userId: string;
  timestamp: number;
  assessmentName?: string;
}

export enum ChatRole {
  User = 'user',
  Model = 'model',
  Error = 'error',
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  timestamp: number;
}

export interface SkillRecommendation {
  skillName: string;
  description: string;
  relevance: string;
  learningResources?: Array<{ title: string; url: string; type: string }>;
}

export interface UserGoal {
  id: string;
  userId: string;
  text: string;
  relatedTo?: string;
  createdAt: number;
  isCompleted: boolean;
}

export interface ResourceItem {
  id: string;
  title: string;
  type: 'article' | 'video' | 'tool' | 'course_platform';
  url: string;
  description: string;
  tags: string[];
}

export interface SkillDetail {
  name: string;
  type: 'technical' | 'soft';
}

export interface SpecializedISCORole {
  name: string;
  toolsets: string[];
  typicalDegrees: string[];
}

export interface ISCOUnitGroup {
  code: string;
  title: string;
  minorGroupCode: string;
  educationPaths?: string[];
  requiredSkills?: SkillDetail[];
  salaryRange?: string;
  demandOutlook?: string;
  specializedRoles?: SpecializedISCORole[];
}

export interface ISCOMinorGroup {
  code: string;
  title: string;
  subMajorGroupCode: string;
  unitGroups?: ISCOUnitGroup[];
}

export interface ISCOSubMajorGroup {
  code: string;
  title: string;
  majorGroupCode: string;
  minorGroups?: ISCOMinorGroup[];
}

export interface ISCOMajorGroup {
  code: string;
  title: string;
  subMajorGroups?: ISCOSubMajorGroup[];
}

export interface ISCOData {
  majorGroups: ISCOMajorGroup[];
  subMajorGroups: ISCOSubMajorGroup[];
  minorGroups: ISCOMinorGroup[];
  unitGroups: ISCOUnitGroup[];
}

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

export interface OccupationDeepDive {
  salaryIndia: string;
  marketDemand: string;
  automationRisk: string;
  topSkills: string[];
  growthPotential: string;
  careerPathSummary: string;
}
