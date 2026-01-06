
import { User, AssessmentRecord, AssessmentResultData, UserGoal, ISCOData, ISCOMajorGroup, ISCOSubMajorGroup, ISCOMinorGroup, ISCOUnitGroup } from '../types';

const USERS_KEY = 'guideai_users';
const ASSESSMENTS_KEY = 'guideai_assessments';
const CURRENT_USER_SESSION_KEY = 'guideai_currentUser';
const USER_GOALS_KEY = 'guideai_user_goals'; // New key for goals

// ISCO Data Keys
const ISCO_MAJOR_GROUPS_KEY = 'guideai_isco_major_groups';
const ISCO_SUB_MAJOR_GROUPS_KEY = 'guideai_isco_sub_major_groups';
const ISCO_MINOR_GROUPS_KEY = 'guideai_isco_minor_groups';
const ISCO_UNIT_GROUPS_KEY = 'guideai_isco_unit_groups';
const ISCO_DATA_LOADED_FLAG_KEY = 'guideai_isco_data_loaded';


// Helper to get items from localStorage
const getItem = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) as T : null;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return null;
  }
};

// Helper to set items in localStorage
const setItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
  }
};

// --- User Management ---
export const dbGetUserByMobile = (mobile: string): User | undefined => {
  const users = getItem<User[]>(USERS_KEY) || [];
  return users.find(u => u.mobile === mobile);
};

export const dbCreateUser = (mobile: string): User => {
  const users = getItem<User[]>(USERS_KEY) || [];
  const newUser: User = { id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, mobile };
  users.push(newUser);
  setItem(USERS_KEY, users);
  return newUser;
};

export const dbGetUserById = (userId: string): User | undefined => {
  const users = getItem<User[]>(USERS_KEY) || [];
  return users.find(u => u.id === userId);
};

// --- Assessment Management ---
export const dbGetAssessmentsByUserId = (userId: string): AssessmentRecord[] => {
  const allAssessments = getItem<AssessmentRecord[]>(ASSESSMENTS_KEY) || [];
  return allAssessments.filter(assessment => assessment.userId === userId).sort((a,b) => b.timestamp - a.timestamp);
};

export const dbSaveAssessmentRecord = (userId: string, assessmentData: AssessmentResultData): AssessmentRecord => {
  const allAssessments = getItem<AssessmentRecord[]>(ASSESSMENTS_KEY) || [];
  const timestamp = Date.now();
  const newRecord: AssessmentRecord = {
    id: `asmt_${timestamp}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    timestamp,
    assessmentName: `Assessment - ${new Date(timestamp).toLocaleDateString()}`,
    ...assessmentData,
  };
  allAssessments.push(newRecord);
  setItem(ASSESSMENTS_KEY, allAssessments);
  return newRecord;
};

export const dbGetAssessmentRecordById = (assessmentId: string): AssessmentRecord | undefined => {
  const allAssessments = getItem<AssessmentRecord[]>(ASSESSMENTS_KEY) || [];
  return allAssessments.find(assessment => assessment.id === assessmentId);
};

// --- Session Management (Simple Mock) ---
export const dbSetCurrentUserSession = (user: User): void => {
  setItem<User>(CURRENT_USER_SESSION_KEY, user);
};

export const dbGetCurrentUserSession = (): User | null => {
  return getItem<User>(CURRENT_USER_SESSION_KEY);
};

export const dbClearCurrentUserSession = (): void => {
  localStorage.removeItem(CURRENT_USER_SESSION_KEY);
};

// --- User Goal Management (New) ---
export const dbGetUserGoals = (userId: string): UserGoal[] => {
  const allGoals = getItem<UserGoal[]>(USER_GOALS_KEY) || [];
  return allGoals.filter(goal => goal.userId === userId).sort((a, b) => b.createdAt - a.createdAt);
};

export const dbAddUserGoal = (userId: string, text: string, relatedTo?: string): UserGoal => {
  const allGoals = getItem<UserGoal[]>(USER_GOALS_KEY) || [];
  const newGoal: UserGoal = {
    id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    text,
    relatedTo,
    createdAt: Date.now(),
    isCompleted: false,
  };
  allGoals.push(newGoal);
  setItem(USER_GOALS_KEY, allGoals);
  return newGoal;
};

export const dbUpdateUserGoal = (updatedGoal: UserGoal): UserGoal | undefined => {
  let allGoals = getItem<UserGoal[]>(USER_GOALS_KEY) || [];
  const index = allGoals.findIndex(g => g.id === updatedGoal.id && g.userId === updatedGoal.userId);
  if (index !== -1) {
    allGoals[index] = updatedGoal;
    setItem(USER_GOALS_KEY, allGoals);
    return updatedGoal;
  }
  return undefined;
};

export const dbDeleteUserGoal = (userId: string, goalId: string): boolean => {
  const allGoals = getItem<UserGoal[]>(USER_GOALS_KEY) || [];
  const initialLength = allGoals.length;
  const filteredGoals = allGoals.filter(g => g.id !== goalId);
  
  if (filteredGoals.length < initialLength) {
    setItem(USER_GOALS_KEY, filteredGoals);
    return true;
  }
  return false;
};

// --- ISCO Data Management ---
export const dbSaveISCOData = (data: ISCOData): void => {
  setItem(ISCO_MAJOR_GROUPS_KEY, data.majorGroups);
  setItem(ISCO_SUB_MAJOR_GROUPS_KEY, data.subMajorGroups);
  setItem(ISCO_MINOR_GROUPS_KEY, data.minorGroups);
  setItem(ISCO_UNIT_GROUPS_KEY, data.unitGroups);
  setItem(ISCO_DATA_LOADED_FLAG_KEY, true);
};

export const dbGetISCOData = (): ISCOData | null => {
  const majorGroups = getItem<ISCOMajorGroup[]>(ISCO_MAJOR_GROUPS_KEY);
  const subMajorGroups = getItem<ISCOSubMajorGroup[]>(ISCO_SUB_MAJOR_GROUPS_KEY);
  const minorGroups = getItem<ISCOMinorGroup[]>(ISCO_MINOR_GROUPS_KEY);
  const unitGroups = getItem<ISCOUnitGroup[]>(ISCO_UNIT_GROUPS_KEY);

  if (majorGroups && subMajorGroups && minorGroups && unitGroups) {
    return { majorGroups, subMajorGroups, minorGroups, unitGroups };
  }
  return null;
};

export const dbIsISCODataLoaded = (): boolean => {
  return getItem<boolean>(ISCO_DATA_LOADED_FLAG_KEY) === true;
};
